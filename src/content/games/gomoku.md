---
title: "Gomoku"
h1: "Play Gomoku Online — Free Five in a Row Game"
draft: false

seo:
  title: "Play Gomoku Free — Five in a Row Game | SnackArcade"
  description: "Play Gomoku free in your browser. Place your stones on the grid and be the first to line up five in any direction. Full rules, strategy tips and FAQ."
  targetKeywords:
    - gomoku online
    - play gomoku free
    - five in a row game
    - gomoku 2 player
    - how to play gomoku
  noindexOverride: false

media:
  cover: ../../assets/games/gomoku/cover.png
  coverAlt: "Gomoku board with black and white stones placed in a five-in-a-row line"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/gomoku
  entryFile: index.html
  bundleFileCount: 7
  bundleBytes: 43742

taxonomy:
  primaryCategory: card-board
  categories:
    - card-board
    - 2-player
  tags:
    - classic
    - strategy
    - two-player
    - no-download
    - brain-training
    - mobile-friendly
    - open-source
    - no-signup
  mechanics:
    - stone-placement
    - line-building
    - blocking

content:
  intro: >-
    Gomoku is the five-in-a-row board game that plays like chess but takes ten seconds to
    learn. Two players take turns placing black and white stones on the intersections of a
    grid, and the first to line up five stones in any direction — horizontally, vertically
    or diagonally — wins. It is one of the oldest board games in Asia, and it is the perfect
    two-player duel for one screen. Play it free in your browser with no download and no
    account.

  about:
    - >-
      Gomoku, also called five in a row, has been played for centuries and is a favourite
      game across Asia. The rules could not be simpler — place a stone, try to make five in
      a line — but the strategy is surprisingly deep. The first player holds a real
      advantage, and both players must balance attack and defence on every move.
    - >-
      The game is played on the intersections of a grid, usually fifteen by fifteen. Each
      turn you place one stone on any empty intersection. A line of five of your own stones
      in any direction wins the game immediately. The tactical core is the open three: three
      stones in a row with open ends on both sides, which threatens to become four, then five.
    - >-
      This version is based on an open-source Caro game by Tran Huu Dat, released under the
      MIT licence. It runs entirely in your browser and supports two players sharing one
      screen. No download, no sign-up and no waiting for an opponent.

  howToPlay:
    - step: "Choose your stone."
      detail: >-
        Black plays first and places the first stone on any empty intersection of the grid.
        White follows, and the players alternate turns.
    - step: "Place a stone."
      detail: >-
        Click or tap an empty intersection to place your stone. Stones stay where they are
        for the whole game — there is no moving or capturing.
    - step: "Build a line of five."
      detail: >-
        The first player to place five of their stones in a straight line — horizontally,
        vertically or diagonally — wins the game.
    - step: "Block your opponent."
      detail: >-
        Watch for your opponent's open threes and fours. If they can make five on their next
        move, you must block that line before you continue your own attack.
    - step: "Win or reset."
      detail: >-
        The game ends when someone makes five in a row, or when the grid is full with no
        winner. Start a new game with the New Game button.

  controls:
    - action: "Place a stone"
      desktop: "Click an empty intersection"
      mobile: "Tap an empty intersection"
    - action: "See whose turn it is"
      desktop: "The turn indicator shows black or white"
      mobile: "The turn indicator shows black or white"
    - action: "Restart the game"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Undo a move"
      desktop: "Click the Undo button, if available"
      mobile: "Tap the Undo button, if available"
    - action: "See the winning line"
      desktop: "The five stones are highlighted when someone wins"
      mobile: "The five stones are highlighted when someone wins"
    - action: "Start a new round"
      desktop: "Click New Game on the result screen"
      mobile: "Tap New Game on the result screen"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Play in the centre early"
      body: >-
        Stones near the centre of the board contribute to more potential lines than stones
        on the edge. The first few moves should stake out the middle of the grid.
    - title: "Build open threes"
      body: >-
        An open three — three stones in a row with open ends on both sides — is the most
        powerful shape in Gomoku. It threatens to become four, and a four cannot be fully
        blocked.
    - title: "Block every immediate five"
      body: >-
        Before you play your own move, check whether your opponent can make five on their
        next turn. If they can, block it first — a win for them is worse than a delay for
        you.
    - title: "Watch for double threats"
      body: >-
        The way to win is to create two open threes at once. Your opponent can block one,
        but not both, so a double threat usually ends the game in a move or two.
    - title: "Defend without overreacting"
      body: >-
        Do not block every harmless pair the opponent makes. React to real threats — open
        threes and fours — while spending your other moves building your own lines.
    - title: "Count the lines through each stone"
      body: >-
        A stone on the board participates in up to four lines — across, down and two
        diagonals. Stones placed where they serve several lines at once are the most
        valuable.

  features:
    - "Classic Gomoku five-in-a-row gameplay for two players"
    - "Runs entirely in your browser with no download or plugin"
    - "Tap or click placement on desktop and mobile"
    - "Quick rounds that reward deep thinking"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Gomoku free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no sign-up and no premium version.
    - q: "What are the rules of Gomoku?"
      a: >-
        Two players take turns placing stones on the intersections of a grid. The first to
        line up five of their own stones in any straight direction wins.
    - q: "Can two people play on the same computer?"
      a: >-
        Yes. The game is designed for two players sharing one screen, taking turns placing
        stones. No accounts or room codes are needed.
    - q: "Can I play Gomoku on my phone?"
      a: >-
        Yes. Tap an empty intersection to place your stone. The game works in portrait and
        landscape on mobile browsers.
    - q: "Who moves first?"
      a: >-
        Black moves first, which gives the first player a small but real advantage. The
        opening moves are about claiming the centre before the opponent does.
    - q: "How do I win at Gomoku?"
      a: >-
        Make five of your stones in a row while blocking your opponent's threats. The open
        three is the key weapon — build them and block them, and the win follows.

info:
  developer: "Tran Huu Dat"
  released: "2025"
  genre:
    - Board
    - Strategy
  players: MultiPlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 10

license:
  license: MIT
  licenseUrl: "https://github.com/TranHuuDat2004/Caro-Board/blob/main/LICENSE"
  author: "Tran Huu Dat"
  authorUrl: "https://github.com/TranHuuDat2004"
  sourceUrl: "https://github.com/TranHuuDat2004/Caro-Board"
  assetsLicense: "same as code license"
  attributionRendered: "Gomoku, based on Caro-Board by Tran Huu Dat · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-05
updatedAt: 2026-08-05
---

Gomoku is a board game that fits on a napkin and rewards the mind of a chess player. Every
stone is a small claim on the grid, every open three is a threat, and the whole game is a
conversation of attacks and blocks that ends in a single winning line.
