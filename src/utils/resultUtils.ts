import { Icon } from "@raycast/api";
import { SearchResult } from "./types";

export const getIcon = (item: SearchResult) => {
  if (item.isHistory) {
    return Icon.Clock;
  }

  if (item.isNavigation) {
    return Icon.Link;
  }

  return Icon.MagnifyingGlass;
};
