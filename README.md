# SnackArcade

Free browser games with real, written guides — no download, no sign-up. Built to
rank in Google organic search and to be maintainable by a non-technical site owner.

## What this is

A fully static website (no server, no database, no cloud account required) that
hosts a handful of real, open-source HTML5 games. Each game has its own page with
a how-to-play guide, a full controls table, strategy tips, an FAQ and its licence
attribution. Pages are generated at build time with [Astro](https://astro.build).

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | Astro 7.x (static output)                           |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)               |
| Islands        | Native TypeScript `.astro` components (no React/Vue)|
| Search         | MiniSearch (client-side, no backend)                |
| Images         | sharp (build-time optimisation)                      |
| Tests          | Vitest (pure logic only: schemas, word count, SEO)  |

Exact versions are pinned in `package.json`.

## Commands

```bash
npm install          # install dependencies (local, no -g)
npm run dev          # local dev server with live reload
npm run build        # validate content, mirror games, build to ./dist
npm run preview      # preview the production build locally
npm run test         # run the unit tests
npm run doctor       # print a health report (ads state, game mirror, etc.)
```

`npm run build` runs three steps automatically:

1. `validate-content.mjs` — checks every game/category/tag/page file for the
   rules that keep the site healthy (word counts, allowed licences, real ratings).
2. `sync-local-games.mjs` — copies each game from `games-src/{slug}/` into
   `public/play/{slug}/` so games are playable with zero cloud services.
3. `astro build` → `check-deploy-budget.mjs` — reports the file count so you know
   when to move game assets to an external origin.

## Adding a new game

```bash
npm run new:game
```

The wizard downloads a game, records its licence, writes the content file
scaffold (with the required word-count and licence fields) and updates the
manifest. Fill in the guide text and run `npm run build`. Do **not** fabricate
game files or rename a game to dodge a trademark — the project deliberately
renames clones (e.g. canvas-tetris → "Block Drop") and credits the original.

## Turning ads on (when AdSense approves)

Ads ship **OFF** by default — the build contains zero ad code until you opt in.
To enable:

1. Put your publisher ID in `.env`: `PUBLIC_ADSENSE_PUB_ID=ca-pub-xxxxxxxxxxxxxxxx`
2. Open `src/config/ads.ts` and change `ENABLED_IN_CODE` from `false` to `true`.
3. Redeploy.

To switch to Mediavine later, change `NETWORK` to `'mediavine'` and add
`PUBLIC_MEDIAVINE_SITE_ID` — no page, layout or component needs to change.

## Project layout

```
src/
  components/        UI, layout, ads and SEO components
  config/            site, nav, SEO and the single ads switch
  content/           game/category/tag/page/collection/blog content + data
  layouts/           BaseLayout, ListPageLayout, ArticleLayout
  lib/               content queries, SEO helpers, URL/game-url utils
  pages/             routes (games, categories, tags, search, licences, ...)
  scripts/           ad loader + analytics bootstrap (inline, zero-trace when off)
  styles/            global.css (Tailwind v4 + design tokens) and ads.css
games-src/           source of truth for self-hosted game bundles (Git-tracked)
public/play/         generated mirror of game bundles (git-ignored)
tests/unit/          pure-logic unit tests (the regression fuses)
```

## Hard rules baked into the build

- **No cloud required.** Games serve from `/play/{slug}/` on the same site unless
  `PUBLIC_GAME_ORIGIN` is set, in which case they serve from that origin.
- **Real games only.** Bundles are downloaded and credited; no placeholders.
- **Human-readable validation errors.** Content failures name the file, field and
  fix instead of dumping a stack trace.
- **Ads leave zero traces when off.** `scripts/validate-ads.mjs` fails the build
  if any ad token survives with ads disabled.
- **No fake ratings.** `aggregateRating` is emitted only with real ratings —
  `tests/unit/schema.test.ts` fails the build if that is ever weakened.
