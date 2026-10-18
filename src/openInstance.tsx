import { closeMainWindow, open, showHUD } from "@raycast/api";
import { getSettings } from "./utils/settings";

export default async function Command() {
  const { baseUrl } = getSettings();

  await open(baseUrl);
  await showHUD(`Opened ${baseUrl}`);
  await closeMainWindow();
}
