# Working on SearXNG Search

SearXNG Search - a Raycast extension that also runs in Tinycast. The README is written for people who
install it; this file is for working on it.

## Layout

- `src/index.tsx` - main view command (list, actions, category shortcuts)
- `src/searchSelectText.tsx` - no-view command for the current selection
- `src/openInstance.tsx` - no-view command that opens the instance home page
- `src/utils/settings.ts` - preference handling, URL builders
- `src/utils/handleResults.ts` - autocomplete fetching and response normalising, history storage
- `src/utils/useSearch.tsx` - the shared search hook
- `test/` - Node harness for the pure logic (see below)

## Build

```bash
pnpm install
pnpm build     # ray build -e dist -o dist
```

`ray build` writes nothing without `-o`; `-e` only selects the environment. Output lands in `dist/` as
`package.json`, one `.js` per command and `assets/`.

## Install into Tinycast While Working

Settings -> Extensions -> **Add from folder** -> pick `dist`. Or copy `dist/package.json`, the `.js`
files and `dist/assets/` into
`~/Library/Application Support/com.tinycast.app.beta/extensions/searxng-search/`. Restart Tinycast
after changing the manifest or an icon; per-command JavaScript is picked up on the next run.

## Icons

`assets/icon.svg` is the source, `assets/icon.png` is what the manifest uses. Render with librsvg -
ImageMagick's own SVG renderer silently drops strokes and produces a blank tile:

```bash
rsvg-convert -w 512 -h 512 assets/icon.svg -o assets/icon.png
```

## Testing the Logic

View commands need the Raycast runtime, but the helpers run under Node with a stubbed `@raycast/api`:

```bash
node -e "require('esbuild').buildSync({entryPoints:['test/run.ts'],bundle:true,platform:'node',format:'cjs',outfile:'test/run.cjs',alias:{'@raycast/api':'./test/stub-api.ts'}})"
node test/run.cjs
```

It hits a live instance, so set `SEARXNG_BASE_URL` to point it somewhere other than the default.

## Behaviour Worth Preserving

- A `User-Agent` header is sent deliberately: SearXNG's bot detection answers 429 to requests with no
  User-Agent at all.
- An empty instance URL is never defaulted. The view command shows an empty state that links to the
  preferences; the no-view commands report it as an error.
- Search history is keyed by instance URL, so entries follow the instance they belong to.
- Bundles are small because `@raycast/api` and `react` are external; both hosts provide them at
  runtime.
