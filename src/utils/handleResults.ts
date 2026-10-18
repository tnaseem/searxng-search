import { LocalStorage } from "@raycast/api";
import { buildSearchUrl, getAutocompleteUrl, getHistoryKey, getSettings } from "./settings";
import { SearchResult, Settings, Suggestion } from "./types";

/** Sent explicitly: SearXNG's bot detection answers 429 to requests with no User-Agent at all. */
const USER_AGENT = "searxng-search-raycast/1.0";

let counter = 0;

export function newId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function describeSuggestion(text: string, settings: Settings): string {
  const host = settings.baseUrl.replace(/^https?:\/\//i, "");
  return `Search ${host} for '${text}'`;
}

export function getStaticResult(searchText: string): SearchResult[] {
  if (!searchText.trim()) {
    return [];
  }

  const settings = getSettings();

  return [
    {
      id: newId(),
      query: searchText,
      description: describeSuggestion(searchText, settings),
      url: buildSearchUrl(searchText),
    },
  ];
}

function asSuggestion(value: unknown): Suggestion | null {
  if (typeof value === "string") {
    const text = value.trim();
    return text ? { text } : null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const raw = record.text ?? record.phrase ?? record.value ?? record.query;
    if (typeof raw !== "string" || !raw.trim()) {
      return null;
    }

    const suggestion: Suggestion = { text: raw.trim() };

    if (typeof record.description === "string" && record.description) {
      suggestion.description = record.description;
    }

    if (typeof record.url === "string" && /^https?:\/\//i.test(record.url)) {
      suggestion.url = record.url;
      suggestion.isNavigation = true;
    }

    return suggestion;
  }

  return null;
}

function dedupe(suggestions: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();

  return suggestions.filter((suggestion) => {
    const key = suggestion.text.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * SearXNG returns whatever its autocomplete backend returns. With the Google backend that is
 * Google's own chrome tuple - [query, suggestions[], descriptions[], [], {"google:suggesttype": []}] -
 * whose suggestion entries may be plain strings or { text, icon } objects. Other backends return a
 * flat array of strings, an array of { phrase } objects, or { suggestions: [] }.
 */
export function normaliseSuggestions(json: unknown): Suggestion[] {
  const candidates: unknown[] = [];

  if (Array.isArray(json)) {
    const isTuple = json.length >= 2 && Array.isArray(json[1]);

    if (isTuple) {
      const entries = json[1] as unknown[];
      const descriptions = Array.isArray(json[2]) ? (json[2] as unknown[]) : [];
      const metadata = (json[4] ?? {}) as Record<string, unknown>;
      const types = Array.isArray(metadata["google:suggesttype"]) ? (metadata["google:suggesttype"] as unknown[]) : [];

      entries.forEach((entry, index) => {
        const suggestion = asSuggestion(entry);
        if (!suggestion) {
          return;
        }

        const description = descriptions[index];
        if (!suggestion.description && typeof description === "string" && description) {
          suggestion.description = description;
        }

        if (types[index] === "NAVIGATION") {
          suggestion.isNavigation = true;
        }

        candidates.push(suggestion);
      });

      return dedupe(candidates as Suggestion[]);
    }

    candidates.push(...json);
  } else if (json && typeof json === "object") {
    const record = json as Record<string, unknown>;
    const nested = record.suggestions ?? record.data ?? record.results;
    if (Array.isArray(nested)) {
      candidates.push(...nested);
    }
  }

  return dedupe(candidates.map(asSuggestion).filter((value): value is Suggestion => value !== null));
}

export async function getAutoSearchResults(searchText: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const settings = getSettings();
  const response = await fetch(getAutocompleteUrl(settings.baseUrl, searchText), {
    signal,
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        `Instance rate-limited the autocomplete request (429). Check the instance URL and its limiter settings.`,
      );
    }
    throw new Error(`Autocomplete returned ${response.status} ${response.statusText}`);
  }

  const suggestions = normaliseSuggestions(await response.json());

  return suggestions.map((suggestion) => ({
    id: newId(),
    query: suggestion.text,
    description: suggestion.description || describeSuggestion(suggestion.text, settings),
    url: suggestion.url ?? buildSearchUrl(suggestion.text),
    isNavigation: suggestion.isNavigation,
  }));
}

export async function getSearchHistory(settings: Settings = getSettings()): Promise<SearchResult[]> {
  if (!settings.rememberSearchHistory) {
    return [];
  }

  const stored = await LocalStorage.getItem<string>(getHistoryKey(settings.baseUrl));
  if (!stored) {
    return [];
  }

  let items: SearchResult[];

  try {
    items = JSON.parse(stored) as SearchResult[];
  } catch (error) {
    console.error("Could not parse search history", error);
    return [];
  }

  const seen = new Set<string>();

  // Rebuild search URLs from the stored query so entries survive a change of category, language or
  // instance URL. Navigation entries keep the URL they were saved with.
  return items
    .filter((item) => item.isNavigation || item.query?.trim())
    .map((item) =>
      item.isNavigation
        ? { ...item, isHistory: true }
        : {
            ...item,
            url: buildSearchUrl(item.query.trim()),
            description: describeSuggestion(item.query.trim(), settings),
            isHistory: true,
          },
    )
    .filter((item) => !seen.has(item.url) && seen.add(item.url));
}
