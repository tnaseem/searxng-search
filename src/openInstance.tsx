import { closeMainWindow, open, openExtensionPreferences, showHUD, showToast, Toast } from "@raycast/api";
import { getSettings } from "./utils/settings";

export default async function Command() {
  const { baseUrl } = getSettings();

  if (!baseUrl) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Set your SearXNG instance URL",
      message: "Add it in the extension preferences",
      primaryAction: { title: "Open Preferences", onAction: openExtensionPreferences },
    });
    return;
  }

  await open(baseUrl);
  await showHUD(`Opened ${baseUrl}`);
  await closeMainWindow();
}
