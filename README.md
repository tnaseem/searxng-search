# SearXNG Search

Search your own [SearXNG](https://docs.searxng.org/) instance from Raycast or
[Tinycast](https://github.com/abue-ammar/tinycast), with suggestions as you type.

## Features

- Suggestions appear as you type, straight from your instance
- Press return to open the search in your default browser
- **Shift-Cmd-I** for an image search, with news, videos and maps on every row
- Search the text you have selected, with optional clipboard fallback
- Recent searches are kept locally and reappear next time
- Works as a fallback command, so you can throw text at it from anywhere

## Getting Started

1. Install the extension and turn it on in Settings -> Extensions.
2. Open the extension's preferences.
3. Enter the address of your instance, for example `https://search.example.com`.

That is all it needs. The address is the only required setting.

## Preferences

| Setting | Default | What it does |
| --- | --- | --- |
| Instance URL | *empty* | Address of your SearXNG instance. `https://` is added if you leave it out |
| Default Category | General | Category used for the main search |
| Language | Auto | Language sent to the instance. Auto lets it decide |
| Safe Search | Off | Off, Moderate or Strict |
| Remember Search History | On | Keep recent searches on this Mac |

## Privacy

Searches go only to your own instance. Nothing else is contacted, nothing is scraped, and no telemetry
is collected.

Recent searches are stored on this Mac and never leave it. They are kept separately for each instance
address, so changing the address starts a fresh list.

## Troubleshooting

**Suggestions stop appearing.** Check the instance address in the preferences, and that the instance is
reachable from this Mac - including over a VPN if it runs on your own network.

**"Could not load suggestions" with a 429.** The instance is rate-limiting the extension. Relax the
limiter, or allow this Mac, in the instance's `limiter.toml`.

**The list is empty.** Searches you saved under a previous instance address stay with that address.

## Licence

MIT
