import {
  Clipboard,
  closeMainWindow,
  getPreferenceValues,
  getSelectedText,
  LocalStorage,
  open,
  showToast,
  Toast,
} from "@raycast/api";
import { describeSuggestion, getSearchHistory, newId } from "./utils/handleResults";
import { buildSearchUrl, getHistoryKey, getSettings } from "./utils/settings";
import { showErrorToast } from "./utils/showErrorToast";

export default async function Command() {
  const preferences = getPreferenceValues<{ useClipboardFallback?: boolean }>();
  const settings = getSettings();

  try {
    let searchText = "";

    try {
      searchText = (await getSelectedText()).trim();
    } catch {
      // Nothing selected.
    }

    if (!searchText && preferences.useClipboardFallback) {
      searchText = (await Clipboard.readText())?.trim() ?? "";
      if (!searchText) {
        throw new Error("No text selected, and the clipboard has no text");
      }
    }

    if (!searchText) {
      throw new Error("No text selected");
    }

    if (!settings.baseUrl) {
      throw new Error("Set your SearXNG instance URL in the extension preferences");
    }

    const url = buildSearchUrl(searchText);
    await open(url);
    await closeMainWindow();

    if (settings.rememberSearchHistory) {
      const entry = {
        id: newId(),
        query: searchText,
        url,
        description: describeSuggestion(searchText, settings),
        isHistory: true,
      };
      const history = (await getSearchHistory(settings)).filter((item) => item.url !== entry.url);
      history.unshift(entry);

      await LocalStorage.setItem(getHistoryKey(settings.baseUrl), JSON.stringify(history));
      await showToast(Toast.Style.Success, `Searched for "${searchText}"`);
    }
  } catch (error) {
    await showErrorToast("No text available", error);
  }
}
