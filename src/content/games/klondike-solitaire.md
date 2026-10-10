---
title: "Klondike Solitaire"
h1: "Play Klondike Solitaire Online — Free, No Download"
draft: false

seo:
  title: "Play Klondike Solitaire Free — No Download | SnackArcade"
  description: "Play Klondike Solitaire free in your browser. Draw three at a time, build the four foundations and win. Full rules, controls and FAQ. No download."
  targetKeywords:
    - klondike solitaire
    - free solitaire no download
    - solitaire online free
    - how to play klondike
    - solitaire draw 3
  noindexOverride: false

media:
  cover: ../../assets/games/klondike-solitaire/cover.png
  coverAlt: "Klondike Solitaire tableau with face-up cards and four empty foundation piles"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/klondike-solitaire
  entryFile: index.html
  bundleFileCount: 3
  bundleBytes: 45064

taxonomy:
  primaryCategory: card-board
  categories:
    - card-board
  tags:
    - classic
    - single-player
    - no-download
    - mobile-friendly
    - strategy
    - relaxing
    - open-source
    - no-signup
  mechanics:
    - card-laying
    - foundation-building
    - tableau-building

content:
  intro: >-
    Klondike Solitaire is the card game that shipped with every computer for three
    decades and quietly became the most played patience game in the world. One deck,
    seven tableau columns, four foundation piles and a single goal: move every card
    onto its matching suit pile, from Ace up to King. It looks calm, but behind the
    green felt is a planning puzzle where every exposure of a hidden card changes the
    shape of the whole game. Play it free in your browser here in the classic draw-three
    style, with no download.

  about:
    - >-
      Klondike's history is fuzzy — it appeared in the late 1800s, possibly named after
      the Klondike gold rush, and became a household name when Microsoft shipped it with
      Windows 3.0 in 1990. The rules are simple enough to learn in a minute and the odds
      are just hard enough that a win feels like an achievement. Statistically, roughly
      one in five deals cannot be won no matter how well you play, and because so much of
      the deck starts face down a human player wins far fewer than that — which is why
      the game rewards patience more than luck.
    - >-
      The tableau is built with seven columns: one card in the first, two in the second,
      and so on up to seven. Only the top card of each column is face up. You build
      columns downward in alternating colours — red on black or black on red — and you
      move cards to the four foundations upward in matching suits, starting with the Aces.
      A King, and only a King, can fill an empty tableau space.
    - >-
      The version here is an open-source implementation by Radovan Janjic, released under
      the MIT licence. It runs entirely in your browser with no account and no download.
      Cards are always turned from the stock three at a time — the classic and tougher
      draw-three variant of Klondike, rather than the easier one-card draw.

  howToPlay:
    - step: "Deal the tableau."
      detail: >-
        Seven columns of cards are dealt face down and face up in a pyramid: one card in
        the first column, two in the second, up to seven in the last. Only the top card of
        each column starts face up.
    - step: "Build columns in alternating colours."
      detail: >-
        Move face-up cards onto the column beside them, always placing a card of one colour
        on a card of the opposite colour with the next higher rank — a red 6 goes on a black
        7, for example.
    - step: "Move Aces and build foundations."
      detail: >-
        Any Ace can move to an empty foundation pile. From there, each foundation must be
        built up in the same suit: Ace, 2, 3, all the way to King. Completing all four
        foundations wins the game.
    - step: "Use the stock pile."
      detail: >-
        When no more tableau moves are available, flip cards from the stock. Cards are
        always turned three at a time — the classic draw-three style, which is harder than
        a one-card draw and rewards careful sequencing.
    - step: "Free a King for an empty column."
      detail: >-
        An empty tableau column can only be filled by a King (or a sequence starting with a
        King). Emptying a column is powerful because it exposes the cards beneath the King.

  controls:
    - action: "Move a card"
      desktop: "Hold the mouse button on a card, drag it where you want it, then release"
      mobile: "Hold a card, drag it where you want it, then release"
    - action: "Move a card to a foundation"
      desktop: "Drag the card onto a foundation pile at the top"
      mobile: "Drag the card onto a foundation pile at the top"
    - action: "Move a card automatically"
      desktop: "Click a card and it goes to the best legal spot"
      mobile: "Tap a card and it goes to the best legal spot"
    - action: "Draw from the stock"
      desktop: "Click the face-down stock pile to turn three cards over"
      mobile: "Tap the face-down stock pile to turn three cards over"
    - action: "Recycle the deck"
      desktop: "Click the empty stock pile to turn the dealt cards back over"
      mobile: "Tap the empty stock pile to turn the dealt cards back over"
    - action: "Restart the deal"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button in the bar below the table"
      mobile: "Tap the fullscreen button in the bar below the table"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Expose face-down cards first"
      body: >-
        Every face-down card in the tableau is information you cannot see. Before you chase
        a foundation, look for moves that turn over a hidden card — uncovering cards gives
        you more options than moving visible ones ever will.
    - title: "Do not empty the stock too early"
      body: >-
        In draw-three mode the stock cycles, and cards you see now will come back later.
        Avoid burning through the stock just to find one card when there are still useful
        tableau moves available.
    - title: "Keep columns roughly balanced"
      body: >-
        A column with ten cards and a column with two cards behave very differently. Long
        columns trap the cards you need. Distributing cards evenly keeps more options open
        and makes it easier to free a King for an empty space.
    - title: "Build foundations by suit, not by speed"
      body: >-
        Moving a card to a foundation is tempting because it clears the tableau, but once a
        card is on a foundation it cannot come back. Do not put a card up until you are sure
        you will not need it to build a longer sequence below.
    - title: "Alternate colours deliberately"
      body: >-
        The colour alternation rule is the skeleton of the game. Before you move a card,
        check what it unlocks underneath. Moving a red 6 onto a black 7 might expose a card
        you need far more than the 6 itself.
    - title: "Play the Kings with a plan"
      body: >-
        A King is the only card that can fill an empty column, so moving a King usually
        empties the space behind it. Sequence the cards under the King before you move him,
        so the exposed column is useful rather than a dead end.

  features:
    - "Classic Klondike Solitaire played with the draw-three variant"
    - "Runs entirely in your browser with no download or plugin"
    - "A one-click New game button deals a fresh shuffle whenever you like"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Klondike Solitaire free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium tier.
    - q: "How are cards drawn from the stock?"
      a: >-
        Three cards are turned from the stock at a time — the classic and tougher draw-three
        style. When the stock runs out, the cards you have drawn are recycled back into it
        so you can cycle through the deck again.
    - q: "Do I need to download or install anything?"
      a: >-
        No. Klondike Solitaire runs entirely in your web browser. There is nothing to install,
        no plugin and no account to create.
    - q: "Can I play Klondike on my phone?"
      a: >-
        Yes. The game supports touch controls — tap a card and then tap where you want to move
        it. It works in portrait and landscape on iOS and Android browsers.
    - q: "How do I start a new game?"
      a: >-
        Click the New game button at any time to shuffle and deal a fresh hand. The game does
        not save or resume an unfinished deal, so a new game always starts from scratch.
    - q: "How do I win Klondike Solitaire?"
      a: >-
        You win by moving every card onto the four foundation piles, each built from Ace to
        King in a single suit. When all 52 cards are on the foundations, the game is complete.
    - q: "What other card games are on this site?"
      a: >-
        If you enjoy Klondike, try Mahjong Solitaire for a tile-matching twist, or Chess for a
        two-player strategy board game. Both are linked from the card and board category page.

info:
  developer: "Radovan Janjic"
  released: "2017"
  genre:
    - Card
    - Solitaire
    - Strategy
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 10

license:
  license: MIT
  licenseUrl: "https://github.com/rjanjic/js-solitaire/blob/master/LICENSE"
  author: "Radovan Janjic"
  authorUrl: "https://github.com/rjanjic"
  sourceUrl: "https://github.com/rjanjic/js-solitaire"
  assetsLicense: "same as code license"
  attributionRendered: "Klondike Solitaire by Radovan Janjic · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-10-10
---

Klondike Solitaire is a game of slow, quiet decisions. There is no clock and no opponent,
which means the only pressure is the one you create by moving before you have looked at the
whole table. Players who expose hidden cards first and keep their columns balanced win
deals that faster players lose.
