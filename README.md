# SearXNG Search

Search your own [SearXNG](https://docs.searxng.org/) instance from Raycast or
[Tinycast](https://github.com/abue-ammar/tinycast), with suggestions as you type.

## Features

- Suggestions appear as you type, straight from your instance
- Press return to open the search in your default browser
- Shortcuts for image, video and map searches: **Shift-Cmd-I**, **Shift-Cmd-Y** and **Shift-Cmd-M**
- Search the text you have selected, with optional clipboard fallback
- Recent searches are kept locally and reappear next time
- Works as a fallback command, so you can throw text at it from anywhere

## Before You Install

This extension is not in the Raycast store, so there is no one-click install. You build it once on your
Mac, then point your launcher at the built folder.

You need:

- macOS
- [Node.js](https://nodejs.org/) 20 or newer, which brings `npm`
- [pnpm](https://pnpm.io/installation) - `brew install pnpm` or `npm install -g pnpm`

## Build It

From the root of this repository:

```bash
pnpm install
pnpm build
```

The build writes a `dist` folder next to `src`. That folder - not the repository root - is what you
install. It contains `package.json`, one JavaScript file per command and the `assets` folder. It is not
checked in, so a fresh clone has none until you run the build.

## Install in Tinycast

1. Open **Settings -> Extensions**.
2. Choose **Add from folder**.
3. Select the **`dist`** folder inside this repository.

## Install in Raycast

```bash
pnpm dev
```

Raycast picks the extension up from there. Changes are rebuilt as you save.

## Getting Started

1. Open the extension's preferences - **Cmd-K -> Configure Extension** from any of its commands.
2. Enter the address of your instance, for example `https://search.example.com`.

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

**The extension does not appear in Tinycast.** Check you added `dist` and not the repository root, then
turn it on under Settings -> Extensions.

## Licence

MIT
