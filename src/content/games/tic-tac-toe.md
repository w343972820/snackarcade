---
title: "Tic Tac Toe"
h1: "Play Tic Tac Toe Online — Free 2 Player Game"
draft: false

seo:
  title: "Play Tic Tac Toe Free — 2 Player Game | SnackArcade"
  description: "Play Tic Tac Toe free in your browser. Take turns placing X and O and be the first to line up three. Against the computer or a friend. No download."
  targetKeywords:
    - tic tac toe online
    - play tic tac toe free
    - tic tac toe vs computer
    - tic tac toe 2 player
    - how to play tic tac toe
  noindexOverride: false

media:
  cover: ../../assets/games/tic-tac-toe/cover.png
  coverAlt: "Tic Tac Toe grid with X and O marks and a winning line drawn through three"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/tic-tac-toe
  entryFile: index.html
  bundleFileCount: 5
  bundleBytes: 46834

taxonomy:
  primaryCategory: 2-player
  categories:
    - 2-player
    - puzzle
  tags:
    - classic
    - two-player
    - strategy
    - no-download
    - family-friendly
    - quick-session
    - open-source
    - no-signup
  mechanics:
    - grid-placement
    - line-building
    - blocking

content:
  intro: >-
    Tic Tac Toe is the first strategy game most people ever learn: a 3 by 3 grid, two
    players, and the goal of placing three marks in a row. It is simple enough for a child
    and, against the right opponent, surprisingly tricky — because perfect play always ends
    in a draw. The version here lets you play against a smart computer opponent or against a
    friend on the same device, and it runs free in your browser with no download and no
    account.

  about:
    - >-
      Tic Tac Toe, also called noughts and crosses, has been played for thousands of years
      and is the universal gateway game. Its rules fit in one sentence — take turns placing
      X and O, be the first to make three in a row — and its strategy is small enough to
      master completely. The game is a draw with perfect play, which is exactly why it
      teaches the fundamentals of planning and blocking so well.
    - >-
      The three-by-three grid has only nine squares, but the decisions matter. The centre
      square is the most valuable, the corners are next, and the edges are the weakest.
      Experienced players know that the way to win is not just to build your own lines but to
      force your opponent into positions where they cannot block both threats at once.
    - >-
      This version is based on an open-source Tic Tac Toe game by Ramazan Çetinkaya,
      released under the MIT licence. It runs entirely in your browser with zero dependencies,
      includes a heuristic computer opponent for solo play, and supports two-player mode on
      one screen. No download, no sign-up and no waiting.

  howToPlay:
    - step: "Choose your mark."
      detail: >-
        One player takes X and the other takes O. X always moves first, and the players
        alternate turns on the 3 by 3 grid.
    - step: "Place your mark."
      detail: >-
        Click or tap an empty square to place your X or O. Once placed, a mark stays for the
        rest of the game.
    - step: "Make three in a row."
      detail: >-
        The first player to place three of their marks in a straight line — across, down or
        diagonally — wins the game.
    - step: "Block your opponent."
      detail: >-
        If your opponent has two marks in a line with the third square empty, that square is
        a winning threat. Block it before you build your own lines.
    - step: "Accept the draw."
      detail: >-
        If all nine squares fill with no winner, the game is a draw — the most common result
        when both players know the game. Start a new round to try again.

  controls:
    - action: "Place a mark"
      desktop: "Click an empty square"
      mobile: "Tap an empty square"
    - action: "See whose turn it is"
      desktop: "The turn indicator shows X or O"
      mobile: "The turn indicator shows X or O"
    - action: "See the winning line"
      desktop: "The winning line is highlighted when the game ends"
      mobile: "The winning line is highlighted when the game ends"
    - action: "Restart the game"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Choose game mode"
      desktop: "Select Computer or Two Player before starting"
      mobile: "Select Computer or Two Player before starting"
    - action: "Start a new round"
      desktop: "Click New Game on the result screen"
      mobile: "Tap New Game on the result screen"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the grid"
      mobile: "Tap the fullscreen button above the grid"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Take the centre if you can"
      body: >-
        The centre square participates in the most winning lines — four of the eight possible
        three-in-a-rows pass through it. Control the centre and you control the game.
    - title: "Use the corners second"
      body: >-
        After the centre, the corners are the next strongest squares. A mark in a corner
        creates two potential lines at once, which makes it a real threat.
    - title: "Block every immediate three"
      body: >-
        If your opponent has two in a row with an open end, you must play that square or lose.
        Check for open twos after every move, yours and theirs.
    - title: "Create double threats to win"
      body: >-
        The only way to win against a careful opponent is to create two open threats at once.
        Position your marks so that two different lines each need one more mark — your
        opponent can block only one.
    - title: "Do not play the edges first"
      body: >-
        Edge squares are the weakest opening moves because they create only one potential
        line. Save them for the middle of the game when they complete a threat.
    - title: "Play the computer to learn"
      body: >-
        The computer opponent is a patient teacher. Play against it to learn the opening and
        blocking patterns, then test them on a human friend.

  features:
    - "Classic Tic Tac Toe against the computer or a friend"
    - "Runs entirely in your browser with no download or plugin"
    - "Zero dependencies — loads instantly"
    - "Quick rounds perfect for a short break"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Tic Tac Toe free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "Can I play against the computer?"
      a: >-
        Yes. The game includes a smart computer opponent, so you can practise alone without
        needing another player.
    - q: "Can two people play on the same device?"
      a: >-
        Yes. Choose the two-player mode and both players share the same screen, taking turns
        to place X and O.
    - q: "Why is Tic Tac Toe often a draw?"
      a: >-
        With perfect play, neither player can force a win — the game always ends in a draw.
        Against a human opponent who makes mistakes, the game becomes winnable again.
    - q: "Can I play Tic Tac Toe on my phone?"
      a: >-
        Yes. Tap an empty square to place your mark. The game works in portrait and landscape
        on mobile browsers.
    - q: "How do I win at Tic Tac Toe?"
      a: >-
        Take the centre or a corner, block your opponent's open twos, and try to create two
        threats at once. The tips above cover the full strategy.

info:
  developer: "Ramazan Çetinkaya"
  released: "2023"
  genre:
    - Board
    - Strategy
  players: MultiPlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 3

license:
  license: MIT
  licenseUrl: "https://github.com/ramazancetinkaya/tictactoe/blob/main/LICENSE"
  author: "Ramazan Çetinkaya"
  authorUrl: "https://github.com/ramazancetinkaya"
  sourceUrl: "https://github.com/ramazancetinkaya/tictactoe"
  assetsLicense: "same as code license"
  attributionRendered: "Tic Tac Toe, based on an open-source game by Ramazan Çetinkaya · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-06
updatedAt: 2026-08-06
---

Tic Tac Toe is the game that teaches you how strategy works before you even know the word.
Every round is a tiny lesson in planning, blocking and double threats — and the fact that
perfect play always draws is exactly why learning to play perfectly is so satisfying.
