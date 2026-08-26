---
# =============================================================================
# FreeCell — self-developed, MIT License (SnackArcade).
# Fills the {{PLACEHOLDERS}} by hand because `npm run new:game` is interactive.
# =============================================================================

# Short display name. Max 60 characters.
title: "FreeCell"

# The visible headline at the top of the page. 8–90 characters.
h1: "Play FreeCell Online — Free, No Download"

# Set to true to hide the page from the built site while you finish writing it.
draft: false

seo:
  # 30–60 characters. Google cuts off anything longer.
  title: "Play FreeCell Online Free — No Download | SnackArcade"
  # 120–158 characters. Aim for 140–155.
  description: "Play FreeCell free in your browser. Move cards to four foundations by suit, use four free cells to plan, and clear the board with no download or timer."
  # 1–8 search phrases this page should win.
  targetKeywords:
    - "freecell solitaire"
    - "play freecell online"
  noindexOverride: false

media:
  # Run `npm run gen:covers` to create this automatically if you have no screenshot.
  cover: ../../assets/games/freecell/cover.png
  # At least 10 characters. Describe what is actually in the image.
  coverAlt: "FreeCell title card on a dark board showing four free cells and four suit foundations"
  aspectRatio: [16, 9]

source:
  # self_hosted = the game files live in this project under games-src/
  # iframe      = the game is embedded from a partner platform
  sourceType: self_hosted
  bundlePath: games-src/freecell
  entryFile: index.html
  # These two are filled in by `npm run new:game`. If you change the game files
  # later, the build tells you the new numbers to put here.
  bundleFileCount: 4
  bundleBytes: 19513

taxonomy:
  # Must be one of the files in src/content/categories/
  primaryCategory: card-board
  categories:
    - card-board
  # 2–10 tags, all of which must already exist in src/content/data/tags.json
  tags:
    - no-download
    - single-player
    - classic
    - open-source
    - strategy
    - brain-training
    - no-signup
    - family-friendly

content:
  # At least 60 words. This is the first paragraph a visitor reads.
  intro: >-
    FreeCell is a calm, single-deck card game where nearly every deal is winnable with enough planning. You get four free cells for temporary storage and four foundations to build up by suit from Ace to King. There is no timer and no score to chase — just you, 52 cards, and a puzzle that rewards patience over reflexes. Play it free in your browser, no download required.

  # 2–4 paragraphs, each at least 80 characters.
  about:
    - >-
      FreeCell belongs to the solitaire family but plays nothing like Klondike. All 52 cards are dealt face-up at the start, so you can see the whole board and plan several moves ahead. The only real question is whether your particular shuffle can be solved — and almost all of them can.
    - >-
      Because nothing is hidden, FreeCell is a pure logic puzzle. The four free cells are your safety valves: park a blocking card there, free up a column, and keep the chains moving. Build each foundation in strict suit order and the entire tableau melts away.

  # 3–6 steps. This section wins the "how to play X" searches.
  howToPlay:
    - step: "Deal the board"
      detail: >-
        The game deals all 52 cards into eight columns. The first four columns receive seven cards, the last four get six. Four free cells sit top-left and four foundations sit top-right.
    - step: "Move cards by suit and colour"
      detail: >-
        Send Aces up to start a foundation, then build each suit upward to the King. On the tableau, stack cards in descending order while alternating red and black.
    - step: "Clear the tableau to win"
      detail: >-
        Move every card onto its foundation pile. Use the free cells to park single cards when a column is blocked. Double-click a card to auto-send it when a move is obvious.

  # 8–15 rows. List every key and gesture, including fullscreen and restart.
  controls:
    - action: "Select a card"
      desktop: "Click the top card of any column or a card sitting in a free cell"
      mobile: "Tap the top card of any column or a free-cell card"
    - action: "Move a card"
      desktop: "Click a free cell, foundation, or column to place the selected card"
      mobile: "Tap a free cell, foundation, or column to place the selected card"
    - action: "Auto-send"
      desktop: "Double-click a card to send it to a foundation or free cell automatically"
      mobile: "Double-tap a card to auto-send it to a foundation or free cell"
    - action: "New game"
      desktop: "Click New Game in the top bar to deal a fresh shuffle"
      mobile: "Tap New Game in the top bar to deal a fresh shuffle"
    - action: "Undo"
      desktop: "Click Undo to take back your last move"
      mobile: "Tap Undo to take back your last move"
    - action: "Restart"
      desktop: "Click New Game again to abandon the deal and redeal"
      mobile: "Tap New Game again to abandon the deal and redeal"
    - action: "Fullscreen"
      desktop: "Press F11 or use your browser's native fullscreen control"
      mobile: "Hide the address bar or use your browser's fullscreen option"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"

  # 5–8 tips, each body at least 30 characters.
  tips:
    - title: "Empty columns are power"
      body: >-
        A free column can hold a full descending sequence, so clear one early whenever you can.
    - title: "Keep a free cell in reserve"
      body: >-
        Try not to fill all four free cells; you often need one open to untangle a stuck column.
    - title: "Build foundations evenly"
      body: >-
        Don't rush every card upward if it still helps as a tableau connector lower down.
    - title: "Plan before you move"
      body: >-
        Because all cards are visible, think two or three moves ahead instead of grabbing the first free cell.
    - title: "Use undo to learn"
      body: >-
        The Undo button is free — experiment with a move, see the result, and step back if it blocks you.

  features:
    - "Runs entirely in your browser with no download or plugin"
    - "Free to play with no account required"
    - "Unlimited undo so you can experiment safely"
    - "Every deal is face-up — pure planning, no luck"

  # 5–7 questions. These generate the FAQ structured data Google shows in search.
  faq:
    - q: "Is FreeCell free to play?"
      a: >-
        Yes. FreeCell on SnackArcade is completely free. There is no account to create, no trial period, and nothing to install before you start a game.
    - q: "Do I need to download or install anything?"
      a: >-
        No. FreeCell runs entirely in your web browser. There is nothing to install, no plugin to enable and no account to create before you play.
    - q: "Can I play FreeCell on my phone?"
      a: >-
        Yes. The board scales down to phone-sized screens and every control works with a tap, so you can play FreeCell on a phone, tablet, or desktop.
    - q: "Is my progress saved?"
      a: >-
        The current deal stays on screen while the tab is open. We do not store games on a server, so only refresh when you are ready to start a new deal.
    - q: "Are all FreeCell deals winnable?"
      a: >-
        Almost every random deal is winnable with perfect play, though some are very hard. If you get stuck, use Undo to backtrack or deal a new game with the New Game button.

info:
  developer: "SnackArcade"
  released: "2026-08-26"
  genre:
    - "Card Game"
    - "Solitaire"
  # Exactly one of: SinglePlayer, MultiPlayer, CoOp
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 5

license:
  # Allowed: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, CC0-1.0, CC-BY-4.0,
  #          Unlicense, ISC, Zlib, platform-licensed, author-permission
  # NEVER: GPL, AGPL, or anything with NC or ND in the name.
  license: MIT
  licenseUrl: "https://playsnackarcade.com/games/freecell/"
  author: "SnackArcade"
  authorUrl: "https://playsnackarcade.com"
  sourceUrl: "https://playsnackarcade.com/games/freecell/"
  assetsLicense: "same as code license"
  attributionRendered: "FreeCell by SnackArcade · MIT License"
  # The day you personally opened the LICENSE file and read it.
  verifiedAt: 2026-08-26

# Leave count at 0 until real visitors have rated the game. Publishing a star
# rating you do not have is structured-data fraud and Google penalises the whole
# site for it, not just this page.
ratings:
  count: 0

publishedAt: 2026-08-26
updatedAt: 2026-08-26
---

FreeCell is the perfect coffee-break puzzle: easy to learn, endless to master, and never unfair. Deal a fresh board and see how few moves it takes you to clear the table.
