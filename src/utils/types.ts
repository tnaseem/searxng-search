export interface SearchResult {
  id: string;
  description?: string;
  query: string;
  url: string;
  isNavigation?: boolean;
  isHistory?: boolean;
}

export interface Settings {
  baseUrl: string;
  defaultCategories: string;
  language: string;
  safesearch: string;
  rememberSearchHistory: boolean;
}

/** Raw autocomplete suggestion, normalised from whatever shape the instance returns. */
export interface Suggestion {
  text: string;
  description?: string;
  url?: string;
  isNavigation?: boolean;
}
