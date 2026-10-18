// Minimal @raycast/api stand-in so the pure logic can run under Node for testing.
const store: Record<string, string> = {};

export const LocalStorage = {
  getItem: async (key: string) => store[key],
  setItem: async (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: async (key: string) => {
    delete store[key];
  },
};

export function getPreferenceValues() {
  return { baseUrl: process.env.SEARXNG_BASE_URL || "https://search.naseem.uk" };
}

export const Icon = new Proxy({}, { get: (_t, prop) => String(prop) });
export const Toast = { Style: { Success: "success", Failure: "failure" } };
export const Clipboard = { copy: async () => undefined, readText: async () => "" };
export const showToast = async () => undefined;
export const open = async () => undefined;
export const closeMainWindow = async () => undefined;
export const getSelectedText = async () => "";
