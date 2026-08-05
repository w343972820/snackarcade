---
title: "Mahjong Solitaire"
h1: "Play Mahjong Solitaire Online — Free, No Download"
draft: false

seo:
  title: "Play Mahjong Solitaire Free — No Download | SnackArcade"
  description: "Play Mahjong Solitaire free in your browser. Match pairs of free tiles to clear the board across dozens of layouts. Full rules, tips and FAQ. No download."
  targetKeywords:
    - mahjong solitaire
    - mahjong solitaire free online
    - play mahjong online
    - mahjong tile matching
    - how to play mahjong solitaire
  noindexOverride: false

media:
  cover: ../../assets/games/mahjong-solitaire/cover.png
  coverAlt: "Mahjong Solitaire board with stacked tiles waiting to be matched in pairs"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/mahjong-solitaire
  entryFile: index.html
  bundleFileCount: 478
  bundleBytes: 10924637

taxonomy:
  primaryCategory: card-board
  categories:
    - card-board
  tags:
    - classic
    - single-player
    - relaxing
    - no-download
    - mobile-friendly
    - open-source
    - no-signup
    - long-session
  mechanics:
    - tile-matching
    - pattern-recognition
    - board-clearing

content:
  intro: >-
    Mahjong Solitaire is the calm cousin of the classic tile game: a board piled high
    with decorated tiles, and one job — remove every tile by matching pairs. You can
    only match a tile that is free, meaning nothing sits on top of it and at least one
    of its left or right sides is open. There is no clock and no opponent, so a game
    is a quiet, meditative puzzle that you solve at your own pace. Play it free in
    your browser with dozens of layouts and no download.

  about:
    - >-
      Mahjong Solitaire was invented in 1981 by Brodie Lockard, who created the single-player
      matching version of the ancient four-player tile game. It spread through early computer
      systems and has been a staple of every casual game collection since. The appeal is
      simple: the rules take ten seconds to learn, the board is always different, and the
      challenge is entirely about seeing the path through the pile.
    - >-
      The tiles are drawn from the traditional mahjong set — bamboos, characters, circles,
      winds, dragons and bonus tiles. Identical tiles can be matched, but only when they are
      free: a tile with another tile on top of it, or with both neighbours covering its
      sides, cannot be selected. Good players do not just clear tiles, they plan which
      matches to take and which to leave for later.
    - >-
      This version is built on an open-source implementation by ffalt, released under the
      MIT licence, and offers a wide range of layouts from simple towers to the classic
      turtle arrangement. The code is MIT licensed while the tile artwork carries its own
      permissive licences, all credited on this page. Everything runs in your browser with
      no account, no download and no time pressure.

  howToPlay:
    - step: "Find a free pair."
      detail: >-
        Look for two identical tiles that are both free — nothing on top of them and at
        least one open side. Click them to remove both from the board.
    - step: "Match identical tiles only."
      detail: >-
        A pair must show the same design. Different suits never match, and the bonus tile
        pairs are limited to their own set.
    - step: "Clear the whole board."
      detail: >-
        Keep removing free pairs until every tile is gone. The game ends when the board is
        empty, or when you have no legal matches left — a state you can often avoid by
        planning ahead.
    - step: "Choose a layout."
      detail: >-
        The game offers several layouts, from small practice towers to large classic shapes.
        Bigger layouts take longer and reward more planning, while small ones are good for
        a quick session.
    - step: "Use the hints when you are stuck."
      detail: >-
        When no move is obvious, a hint can show you a legal pair. Using hints sparingly
        keeps the puzzle honest while making sure you never get permanently stuck.

  controls:
    - action: "Select a tile"
      desktop: "Click a free tile"
      mobile: "Tap a free tile"
    - action: "Match a pair"
      desktop: "Click the second tile of the pair"
      mobile: "Tap the second tile of the pair"
    - action: "Get a hint"
      desktop: "Click the Hint button"
      mobile: "Tap the Hint button"
    - action: "Undo last match"
      desktop: "Click the Undo button"
      mobile: "Tap the Undo button"
    - action: "Shuffle the board"
      desktop: "Click the Shuffle button"
      mobile: "Tap the Shuffle button"
    - action: "Restart the layout"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Match the hardest pairs first"
      body: >-
        Tiles buried at the bottom of a stack are the ones that end games. Look for pairs
        that unlock deeper tiles early, rather than clearing the easy top layer first.
    - title: "Keep an eye on open sides"
      body: >-
        A tile is only free if at least one side is open. When you choose which of several
        identical tiles to take, take the one whose removal opens the most other tiles.
    - title: "Do not clear pairs randomly"
      body: >-
        Every match changes which tiles are free. Before you take a pair, ask whether
        removing it will expose the pair you actually need next, or bury it further.
    - title: "Count the tiles that are left"
      body: >-
        If the board gets thin, count the remaining pairs. A tile with no matching partner
        still on the board is a game over waiting to happen — find it before it traps you.
    - title: "Use shuffle as a last resort"
      body: >-
        Shuffle rearranges the board and can change which tiles are free, but it also erases
        the plan you have built. Prefer a hint or a careful rethink before you shuffle.
    - title: "Learn the tile designs"
      body: >-
        The fastest players recognise tile designs at a glance. Spend a few games learning
        the bamboo, circle and character suits and you will spot pairs far more quickly.

  features:
    - "Classic Mahjong Solitaire matching with dozens of layouts"
    - "Runs entirely in your browser with no download or plugin"
    - "No timer and no moves limit — play completely at your own pace"
    - "Hints and shuffle help when you are stuck"
    - "Open source under the MIT licence with artwork credits"

  faq:
    - q: "Is Mahjong Solitaire free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no sign-up and no premium version.
    - q: "What makes a tile free in Mahjong Solitaire?"
      a: >-
        A tile is free when no other tile sits on top of it and at least one of its left or
        right sides is open. You can only match two free identical tiles.
    - q: "Can I play Mahjong Solitaire on my phone?"
      a: >-
        Yes. The game supports touch controls — tap a tile to select it and tap its matching
        partner to remove the pair. It works in portrait and landscape on mobile browsers.
    - q: "What happens when I have no legal moves?"
      a: >-
        If no two free tiles match, the game offers a shuffle that rearranges the board and
        usually creates new pairs. You can also undo a match and try a different path.
    - q: "How many layouts are available?"
      a: >-
        The game includes a wide selection of layouts, from small practice boards to the
        classic turtle arrangement, so you can choose the size and difficulty of each game.
    - q: "Is my progress saved between sessions?"
      a: >-
        Your current board state is kept in your browser's local storage where the game
        supports it, so you can close the tab and return to the same layout later.
    - q: "What other matching games are on this site?"
      a: >-
        If you enjoy matching tiles, Klondike Solitaire offers a card-based matching puzzle,
        and 2048 gives you a number-merging challenge. Both are linked from their game pages.

info:
  developer: "ffalt"
  released: "2017"
  genre:
    - Board
    - Tile Matching
    - Puzzle
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 15

license:
  license: MIT
  licenseUrl: "https://github.com/ffalt/mah/blob/main/LICENSE"
  author: "ffalt"
  authorUrl: "https://github.com/ffalt"
  sourceUrl: "https://github.com/ffalt/mah"
  assetsLicense: "MIXED — code MIT; uni.svg tile set Public Domain (Shizhao); riichi.svg tile set CC-BY-4.0 (FluffyStuff); selected backgrounds under the Unsplash License"
  attributionRendered: "Mahjong Solitaire (Mah) by ffalt · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Mahjong Solitaire is the game to open when you want to think without being rushed. There is
no timer counting down and no score to protect, only a board of tiles that asks a simple
question over and over: which pair can I safely take next? Answer it patiently and the
board disappears one pair at a time.
