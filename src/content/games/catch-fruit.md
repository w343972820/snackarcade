---
title: "Catch Fruit"
h1: "Play Catch Fruit Online — Free Arcade Game"
draft: false

seo:
  title: "Play Catch Fruit Free — Arcade Game | SnackArcade"
  description: "Play Catch Fruit free in your browser. Move the basket to catch falling fruit — the faster it drops, the more points it scores. Full controls, tips and FAQ."
  targetKeywords:
    - catch fruit game
    - fruit catch online
    - catch falling fruit free
    - basket catch game
    - how to play catch fruit
  noindexOverride: false

media:
  cover: ../../assets/games/catch-fruit/cover.png
  coverAlt: "Catch Fruit game with a basket at the bottom and pieces of fruit falling from above"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/catch-fruit
  entryFile: index.html
  bundleFileCount: 18
  bundleBytes: 6725967

taxonomy:
  primaryCategory: arcade
  categories:
    - arcade
  tags:
    - single-player
    - high-score
    - quick-session
    - no-download
    - mobile-friendly
    - family-friendly
    - open-source
    - no-signup
  mechanics:
    - catching
    - timing

content:
  intro: >-
    Catch Fruit is the arcade game of moving a basket and catching fruit as it falls from
    the sky. Every piece you catch scores points, every one you miss costs you, and each
    piece falls at its own random pace — the faster a fruit drops, the more points it is
    worth. It is one of the most instantly readable
    games ever made — move, catch, score — and it is loved by children and adults alike.
    Play it free in your browser with no download and no account.

  about:
    - >-
      The catch-the-falling-objects game has been a casual favourite for decades, because it
      turns a simple motor skill — moving something to catch something — into a tense test
      of timing. The rules are obvious from the first second, and judging how fast each
      fruit falls does the rest.
    - >-
      The challenge is anticipation. Fruit falls from different parts of the sky at
      different speeds, and your basket is the only thing between the fruit and the ground.
      The skill is reading where each piece will land and moving there in time, while
      pieces keep arriving from every direction, forcing you to choose which are worth
      chasing.
    - >-
      This version is based on an open-source HTML5 fruit catcher by Jeevan Kumar Raj,
      released under the MIT licence. It runs entirely in your browser with mouse controls
      on desktop and touch controls on mobile, and offers the same satisfying catch-and-score
      loop as the classic game. No download, no sign-up and no waiting.

  howToPlay:
    - step: "Move the basket."
      detail: >-
        Use your mouse or finger to slide the basket left and right along the bottom of the
        playfield. The basket follows your input.
    - step: "Catch the falling fruit."
      detail: >-
        Position the basket beneath a falling piece of fruit to catch it. Every fruit you
        catch adds to your score.
    - step: "Avoid the misses."
      detail: >-
        Every fruit that reaches the ground without being caught counts as a miss against
        you. Miss ten and the run is over — it is the only way the game ends.
    - step: "Prioritise the valuable fruit."
      detail: >-
        Fruit have different base values — a banana 5, an apple 10, an orange 15, a pineapple
        20 and a melon 25. When two pieces are equally reachable, take the more valuable one;
        the speed multiplier is applied on top of that.
    - step: "Score more with faster fruit."
      detail: >-
        Each piece of fruit falls at its own random speed, and its points are multiplied by
        how fast it falls — so a fast piece is worth more than a slow one. Watch how quickly
        each fruit drops and go for the fastest, highest-value pieces.

  controls:
    - action: "Move basket left"
      desktop: "Move the mouse left"
      mobile: "Drag left"
    - action: "Move basket right"
      desktop: "Move the mouse right"
      mobile: "Drag right"
    - action: "Move with the keyboard"
      desktop: "Left and right arrow keys, if supported"
      mobile: "Not available — use drag"
    - action: "Restart the game"
      desktop: "Press Enter after losing"
      mobile: "Not available — the game is restarted with Enter on a keyboard"
    - action: "See your score"
      desktop: "The score and hi score are shown at the top"
      mobile: "The score and hi score are shown at the top"
    - action: "See how many you have missed"
      desktop: "The fruit-missed counter is at the top; ten misses end the run"
      mobile: "The fruit-missed counter is at the top; ten misses end the run"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button in the bar below the game"
      mobile: "Tap the fullscreen button in the bar below the game"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Track the fruit, not the cursor"
      body: >-
        Your eyes should watch the falling fruit, while your hand moves the basket by feel.
        Chasing the cursor instead of the fruit leaves you one step behind every time.
    - title: "Position for the lowest fruit"
      body: >-
        When several pieces are falling at once, go for the one closest to the ground first —
        it needs the most urgent response. The higher fruit gives you time to get back.
    - title: "Keep the basket near the centre"
      body: >-
        The centre of the playfield is the best average position because most fruit falls
        through the middle. Returning to the centre after each catch covers the most ground.
    - title: "Do not chase every piece"
      body: >-
        When several pieces fall at once, some fruit is simply too far away. Let it fall
        and keep your basket ready for the next one — one missed piece is cheaper than a
        scramble that misses three.
    - title: "Guard your final misses"
      body: >-
        The run ends the moment you miss your tenth piece, and that counter never resets, so
        a loose patch late in a game can undo everything. Only chase a far-away piece when
        you can comfortably get back in time.
    - title: "Scan the whole playfield"
      body: >-
        Fruit drops from random positions all across the sky, with no fixed spawn pattern to
        memorise, so keep your eyes moving over the whole playfield and stay ready to drift
        toward whichever piece is about to land.

  features:
    - "Classic catch-the-falling-fruit gameplay"
    - "Runs entirely in your browser with no download or plugin"
    - "Mouse controls on desktop and touch controls on mobile"
    - "Speed-based scoring — the faster a fruit falls, the more it is worth"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Catch Fruit free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I control the basket?"
      a: >-
        Move your mouse on desktop or drag your finger on a touchscreen to slide the basket
        left and right along the bottom of the playfield.
    - q: "What happens when I miss a piece of fruit?"
      a: >-
        A piece of fruit that reaches the ground without being caught counts as a miss. Ten
        misses end the game, so the missed-fruit counter at the top is the number to watch.
    - q: "How does scoring work?"
      a: >-
        Each fruit has a base value — a banana is worth 5, an apple 10, an orange 15, a
        pineapple 20 and a melon 25 — and that value is multiplied by how fast the fruit is
        falling. So the fastest, most valuable fruit on screen is worth the most points.
    - q: "Can I play Catch Fruit on my phone?"
      a: >-
        Yes. Drag your finger to move the basket. The game works in portrait and landscape on
        mobile browsers.
    - q: "Is Catch Fruit suitable for children?"
      a: >-
        Yes. The game is simple, family-friendly and has no violent content — just catching
        falling fruit and chasing a high score.

info:
  developer: "Jeevan Kumar Raj"
  released: "2020"
  genre:
    - Arcade
    - Casual
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 5

license:
  license: MIT
  licenseUrl: "https://github.com/Jeevan-kumar-Raj/FruitCatcher/blob/master/LICENSE"
  author: "Jeevan Kumar Raj"
  authorUrl: "https://github.com/Jeevan-kumar-Raj"
  sourceUrl: "https://github.com/Jeevan-kumar-Raj/FruitCatcher"
  assetsLicense: "same as code license"
  attributionRendered: "Catch Fruit, based on an open-source game by Jeevan Kumar Raj · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-07
updatedAt: 2026-10-10
---

Catch Fruit is a game with one idea, perfectly executed: move the basket, catch the fruit,
beat your best. There is no story to follow, no inventory to manage and no tutorial to sit
through — just a falling challenge where the fastest fruit scores the most, and your
reflexes are the only thing standing between you and a new high score.
