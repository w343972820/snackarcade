---
title: "Reversi"
h1: "Play Reversi Online — Free 2 Player Board Game"
draft: false

seo:
  title: "Play Reversi Free — 2 Player Board Game | SnackArcade"
  description: "Play Reversi free in your browser. Flip your opponent's discs by sandwiching them between your own and own the board. Full rules, tips and FAQ. No download."
  targetKeywords:
    - reversi online
    - play reversi free
    - reversi 2 player
    - disc flipping game
    - how to play reversi
  noindexOverride: false

media:
  cover: ../../assets/games/reversi/cover.png
  coverAlt: "Reversi board with black and white discs placed across the eight by eight grid"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/reversi
  entryFile: index.html
  bundleFileCount: 7
  bundleBytes: 81360

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
    - disc-flipping
    - flanking
    - board-control

content:
  intro: >-
    Reversi is the classic strategy game of black and white discs, where the goal is not to
    build your own line but to flip your opponent's discs into your colour. Place a disc so
    it sandwiches a line of opponent discs between your new disc and one of your own, and
    every disc in that line flips to your colour. The rules are famously simple, yet the
    strategy is deep enough to reward a lifetime of study. Play it free in your browser
    against a friend with no download and no account.

  about:
    - >-
      Reversi has been played since the late nineteenth century and is one of the most
      popular two-player board games in the world. Its appeal is the elegant inversion of
      most games: instead of capturing pieces, you convert them. Every move you make
      strengthens your position by turning the opponent's own discs against them.
    - >-
      The game is played on an eight by eight board, starting with four discs in the centre
      — two black, two white, arranged diagonally. On each turn you place one disc so that
      it flanks at least one line of opponent discs in any of the eight directions. Those
      discs flip to your colour, and play passes to your opponent. The game ends when no
      legal move remains, and the player with more discs wins.
    - >-
      This version is based on an open-source HTML5 Canvas implementation by zuramai,
      released under the MIT licence. It runs entirely in your browser and supports two
      players sharing one screen. No download, no sign-up and no waiting for an opponent.

  howToPlay:
    - step: "Start with four discs."
      detail: >-
        The game begins with two black and two white discs in the centre of the board,
        arranged diagonally. Black moves first.
    - step: "Place a disc to flank."
      detail: >-
        Click or tap an empty square where your disc will sandwich at least one line of
        opponent discs between your new disc and one of your existing discs.
    - step: "Flip the captured discs."
      detail: >-
        Every opponent disc in the flanked line — horizontally, vertically or diagonally —
        flips to your colour. Multiple lines can be flipped in a single move.
    - step: "Pass or skip."
      detail: >-
        If you have no legal move, you skip your turn and your opponent plays again. A move
        that does not flank anything is never legal.
    - step: "Own the board to win."
      detail: >-
        The game ends when neither player can move. The player whose colour covers the most
        discs wins the board.

  controls:
    - action: "Place a disc"
      desktop: "Click an empty highlighted square"
      mobile: "Tap an empty highlighted square"
    - action: "See legal moves"
      desktop: "Legal squares are highlighted for the current player"
      mobile: "Legal squares are highlighted for the current player"
    - action: "See whose turn it is"
      desktop: "The turn indicator shows black or white"
      mobile: "The turn indicator shows black or white"
    - action: "See the disc count"
      desktop: "The black and white totals are shown beside the board"
      mobile: "The black and white totals are shown beside the board"
    - action: "Pass your turn"
      desktop: "Your turn is skipped automatically when no move is legal"
      mobile: "Your turn is skipped automatically when no move is legal"
    - action: "Restart the game"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Own the corners early"
      body: >-
        A disc in a corner can never be flipped, so corners are the most valuable squares on
        the board. Fight for them, but never give your opponent a move that takes one.
    - title: "Avoid giving away the edge"
      body: >-
        Placing a disc on the edge looks safe, but a disc next to a corner square often hands
        the corner to your opponent. Play the edges only when they do not open the corner.
    - title: "Count the discs before the endgame"
      body: >-
        Reversi is won in the last moves, not the first. Keep the disc count close early and
        plan for the endgame, where one well-placed disc can flip an entire side.
    - title: "Learn the quiet moves"
      body: >-
        The best moves are often the quiet ones — moves that flip few discs but keep your
        options open. Flipping everything you can early usually gives your opponent strong
        responses.
    - title: "Watch for the X-square trap"
      body: >-
        The squares diagonally adjacent to the corners are called X-squares. Playing there
        often lets your opponent take the corner next move — avoid them unless you can
        capture the corner immediately after.
    - title: "Control the centre squares"
      body: >-
        The four central squares open up the most flanking lines. Controlling the middle
        gives you more legal moves and more ways to force your opponent into bad ones.

  features:
    - "Classic Reversi gameplay for two players on one screen"
    - "Runs entirely in your browser with no download or plugin"
    - "Legal moves highlighted for easy play"
    - "Full rules including multi-direction flanking"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Reversi free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no sign-up and no premium version.
    - q: "What are the rules of Reversi?"
      a: >-
        Players place one disc per turn so that it flanks a line of opponent discs between
        itself and one of their own discs. Every flanked disc flips to your colour, and the
        player with the most discs at the end wins.
    - q: "Can two people play on the same computer?"
      a: >-
        Yes. The game is designed for two players sharing one screen, taking turns placing
        discs. No accounts or room codes are needed.
    - q: "Can I play Reversi on my phone?"
      a: >-
        Yes. Tap an empty highlighted square to place your disc. The game works in portrait
        and landscape on mobile browsers.
    - q: "Why is my move not allowed?"
      a: >-
        A move is legal only if it flanks at least one line of opponent discs. If you have no
        legal move, your turn is skipped automatically.
    - q: "How do I win at Reversi?"
      a: >-
        End the game with more discs of your colour than your opponent. The tips above cover
        the corner, edge and endgame strategies that decide close games.

info:
  developer: "zuramai"
  released: "2020"
  genre:
    - Board
    - Strategy
  players: MultiPlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 12

license:
  license: MIT
  licenseUrl: "https://github.com/zuramai/othello/blob/master/LICENSE"
  author: "zuramai"
  authorUrl: "https://github.com/zuramai"
  sourceUrl: "https://github.com/zuramai/othello"
  assetsLicense: "same as code license"
  attributionRendered: "Reversi, based on an open-source game by zuramai · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-05
updatedAt: 2026-08-05
---

Reversi is the rare game where your opponent's pieces become your own. Every move is a
conversion, every corner is a fortress, and the player who thinks in terms of the final
board rather than the next flip wins. It is a strategy game disguised as a friendly tile
game.
