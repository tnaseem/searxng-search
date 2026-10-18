# SearXNG Search

Raycast extension for searching your own [SearXNG](https://docs.searxng.org/) instance with
autosuggestions. Runs in Raycast and in [Tinycast](https://github.com/abue-ammar/tinycast).

## Features

- Live autosuggestions from the instance's `/autocompleter` endpoint, whatever backend it uses
- One row per suggestion; return opens the search in your default browser
- Category shortcuts for images, news, videos and maps on every row
- Search selected text, with optional clipboard fallback
- Search history stored locally, keyed by instance URL
- Works as a Raycast/Tinycast fallback command

## Preferences

| Preference | Default | Notes |
| --- | --- | --- |
| Instance URL | *(blank)* | Scheme optional, trailing slashes trimmed. The commands prompt for it when empty |
| Default Category | General | Applies to the main search URL |
| Language | Auto | Omitted when set to Auto |
| Safe Search | Off | `safesearch=0`, `1` or `2` |
| Remember Search History | On | Stored per instance URL |

## How It Works

Suggestions come from `GET {instance}/autocompleter?q=...`; selecting a row opens
`{instance}/search?q=...&categories=...&language=...&safesearch=...` in the default browser. Nothing
is scraped, so the instance's HTML theme and its rate limiter never get in the way.

The autocomplete response is normalised from all the shapes SearXNG's backends return: Google's
`[query, suggestions[], descriptions[], [], {...}]` tuple, a flat array of strings, an array of
`{ text }` or `{ phrase }` objects, or `{ suggestions: [] }`.

A `User-Agent` header is sent explicitly because the instance's bot detection answers 429 to requests
without one.

## Icon

`assets/icon.svg` is the source; `assets/icon.png` is what the manifest points at. Render the PNG with
`rsvg-convert`, not ImageMagick - ImageMagick's built-in SVG renderer drops stroke attributes, which
produces a blank tile:

```bash
rsvg-convert -w 512 -h 512 assets/icon.svg -o assets/icon.png
```

## Building

```bash
pnpm install
pnpm build          # emits dist/ with package.json, index.js, searchSelectText.js, openInstance.js, assets/
```

### Installing in Tinycast

Settings -> Extensions -> **Add from folder** -> choose `dist`. Extensions are off by default; turn
them on in the same pane. Rebuild and re-add the folder after changes.

### Installing in Raycast

```bash
pnpm dev
```
