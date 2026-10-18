import { Action, ActionPanel, closeMainWindow, Icon, Keyboard, List, open } from "@raycast/api";
import { newId } from "./utils/handleResults";
import { getIcon } from "./utils/resultUtils";
import { buildSearchUrl } from "./utils/settings";
import { SearchResult } from "./utils/types";
import { useSearch } from "./utils/useSearch";

const CATEGORY_ACTIONS = [
  { category: "images", title: "Search Images", icon: Icon.Image },
  { category: "news", title: "Search News", icon: Icon.Document },
  { category: "videos", title: "Search Videos", icon: Icon.Video },
  { category: "map", title: "Search Maps", icon: Icon.Map },
];

export default function Command(props: { arguments?: { query?: string }; fallbackText?: string }) {
  const initialQuery = props.arguments?.query?.trim() || props.fallbackText || "";
  const {
    isLoading,
    results,
    search,
    searchText,
    settings,
    addHistory,
    deleteAllHistory,
    deleteHistoryItem,
  } = useSearch(initialQuery);

  async function openUrl(result: SearchResult, url: string) {
    await addHistory({ ...result, id: newId(), url });
    await open(url);
    await closeMainWindow();
  }

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={search}
      searchBarPlaceholder={`Search ${settings.baseUrl.replace(/^https?:\/\//i, "")}...`}
    >
      <List.Section title="Results" subtitle={results.length + ""}>
        {results.map((item) => (
          <List.Item
            key={item.id}
            title={item.query}
            subtitle={item.description}
            icon={getIcon(item)}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Result">
                  <Action
                    title="Open in Browser"
                    onAction={() => openUrl(item, item.url)}
                    icon={{ source: Icon.ArrowRight }}
                  />
                  <Action.CopyToClipboard title="Copy URL to Clipboard" content={item.url} />
                  <Action.CopyToClipboard
                    title="Copy Suggestion to Clipboard"
                    content={item.query}
                    shortcut={Keyboard.Shortcut.Common.Copy}
                  />
                  <Action
                    title="Set as Search Text"
                    onAction={() => search(item.query)}
                    icon={{ source: Icon.MagnifyingGlass }}
                    shortcut={{ modifiers: ["shift"], key: "tab" }}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section title="Other Searches">
                  {CATEGORY_ACTIONS.filter((entry) => entry.category !== settings.defaultCategories).map((entry) => (
                    <Action
                      key={entry.category}
                      title={entry.title}
                      icon={{ source: entry.icon }}
                      onAction={() => openUrl(item, buildSearchUrl(item.query, entry.category))}
                    />
                  ))}
                </ActionPanel.Section>

                <ActionPanel.Section title="SearXNG">
                  <Action
                    title="Open instance Home Page"
                    icon={{ source: Icon.Globe }}
                    onAction={async () => {
                      await open(settings.baseUrl);
                      await closeMainWindow();
                    }}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section title="History">
                  {item.isHistory && (
                    <Action
                      title="Remove from History"
                      onAction={() => deleteHistoryItem(item)}
                      icon={{ source: Icon.Trash }}
                      style={Action.Style.Destructive}
                      shortcut={Keyboard.Shortcut.Common.Remove}
                    />
                  )}

                  <Action
                    title="Clear All History"
                    onAction={deleteAllHistory}
                    icon={{ source: Icon.ExclamationMark }}
                    style={Action.Style.Destructive}
                    shortcut={Keyboard.Shortcut.Common.RemoveAll}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
