# Tanit Chat — feature explorer

Catalog for `features.html` (classic sidebar + stage by default; `?layout=scroll` expands every feature).

```
npm install
npm run dev
```

Then open http://localhost:5177/

`npm run build` writes `features.html` and every `features.<lang>.html`. `npm run build:inline` writes the embed fragments.

## Intro

Opening copy is Markdown, rendered at build time with [marked](https://github.com/markedjs/marked) (same library as the chat app). Showdown is not used.

On the standalone page, `/` is the intro. A feature’s slides are at `/` plus the label slug (`Files` → `/files`, `Browser Use` → `/browser-use`). The inline embed does not change the host URL.

| File | Lang |
|---|---|
| `intro.md` | English, and the fallback when a translation is missing |
| `intro_de.md` | German (`intro_<lang>.md` or `intro-<lang>.md`) |

Optional front matter sets the sidebar label:

```md
---
label: Intro
---

# Tanit Chat

Many tools. One workspace. Local first.
```

## Create a new skin

A skin is a token file. Layout stays in `explore.css`. Do not put palette hexes there.

1. Copy the closest existing pack:

   ```
   copy explore_plex.css explore_forest.css
   ```

   Name the file `explore_<id>.css`. `<id>` is lowercase `a-z`, `0-9`, `_`, `-`.

2. At the top of the new file, set the id and optional font:

   ```css
   /**
    * @explore-theme forest
    * @explore-font https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap
    */
   ```

   `@explore-theme` must match the filename (`explore_forest.css` → `forest`).
   `@explore-font` is optional. The generator emits one `<link>` per unique URL.

3. Replace every `[data-skin="plex"]` with `[data-skin="forest"]`. Leave the `data-theme` light/dark split as it is.

4. Retoken. Required custom properties (set on both light and dark):

   | Token | Used for |
   |---|---|
   | `--tv-font` | Body / chrome |
   | `--tv-bg-light` / `--tv-bg-dark` | Page canvas helpers |
   | `--bg` `--ink` `--muted` `--dim` | Page and copy |
   | `--accent` `--accent-hover` `--accent-soft` | Selection, CTAs, tour |
   | `--amber` | Pause / warning |
   | `--panel` `--panel-2` | Cards, sidebar, foot |
   | `--line` `--line-strong` | Hairlines |
   | `--media` | Screenshot well |
   | `--shadow` `--shadow-lg` | Elevation |
   | `--sel-bg` | Selected nav / highlight |
   | `--side-w` `--radius` | Sidebar width, rounding |
   | `--lb-*` | Lightbox (inherits from `html[data-skin]`) |

   Light/dark is `data-theme`. Do not invent a third `data-theme` value for a new pack.

5. Rebuild (or let `--serve` pick it up every 5s). The generator bundles **every** `explore_*.css`. Selecting a skin only sets `data-skin`.

   ```
   node explore.mjs --serve --lang en --skin forest
   ```

   Runtime, without rebuilding:

   - `http://localhost:5177/?skin=forest`
   - `http://localhost:5177/?skin=forest&theme=dark`
   - `localStorage['tv-explore-skin']` (set after the first `?skin=` visit)

`--skin` and `--theme` are the same flag (the pack). Light/dark is only `?theme=light|dark`.

## Files

| Path | Edit for |
|---|---|
| `explore.css` | Layout, motion, clipping — not palette |
| `explore_<id>.css` | A skin |
| `explore.js` | Behavior |
| `product.json` / `product_<lang>.json` | Copy, screenshots, CTAs |
| `intro.md` / `intro_<lang>.md` | Opening copy. `label` in front matter is the sidebar name |
| `explore/fragments/` | HTML chrome |
| `explore.mjs` | CLI: discover, bundle, serve |

## Shipped packs

- `plex` — default (IBM Plex, blue)
- `shell` — DESIGN.md hardware (Public Sans, shell red; red does not change between light and dark)
