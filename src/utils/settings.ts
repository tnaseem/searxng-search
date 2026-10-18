import { getPreferenceValues } from "@raycast/api";
import { Settings } from "./types";

export const DEFAULT_BASE_URL = "https://search.naseem.uk";

/**
 * Accepts what people paste: with or without a scheme, with a trailing slash,
 * or with the /search endpoint already attached.
 */
export function normaliseBaseUrl(raw: string | undefined): string {
  let value = (raw ?? "").trim();

  if (!value) {
    return DEFAULT_BASE_URL;
  }

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  return value.replace(/\/+(search|autocompleter)$/i, "").replace(/\/+$/, "");
}

export function getSettings(): Settings {
  const preferences = getPreferenceValues<Partial<Settings>>();

  return {
    baseUrl: normaliseBaseUrl(preferences.baseUrl),
    defaultCategories: preferences.defaultCategories || "general",
    language: preferences.language || "auto",
    safesearch: preferences.safesearch ?? "0",
    rememberSearchHistory: preferences.rememberSearchHistory !== false,
  };
}

export function getAutocompleteUrl(baseUrl: string, query: string): string {
  return `${baseUrl}/autocompleter?q=${encodeURIComponent(query)}`;
}

export function getHistoryKey(baseUrl: string): string {
  return `history:${baseUrl}`;
}

/**
 * Built by hand rather than with URL/URLSearchParams so the same code behaves in
 * JavaScriptCore and Node.
 */
export function buildSearchUrl(query: string, categories?: string): string {
  const settings = getSettings();
  const category = categories ?? settings.defaultCategories;
  const params = [`q=${encodeURIComponent(query)}`];

  if (category && category !== "all") {
    params.push(`categories=${encodeURIComponent(category)}`);
  }

  if (settings.language && settings.language !== "auto") {
    params.push(`language=${encodeURIComponent(settings.language)}`);
  }

  if (settings.safesearch !== "") {
    params.push(`safesearch=${encodeURIComponent(settings.safesearch)}`);
  }

  return `${settings.baseUrl}/search?${params.join("&")}`;
}
