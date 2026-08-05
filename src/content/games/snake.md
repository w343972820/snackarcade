---
title: "Snake"
h1: "Play Snake Online — Free Classic Arcade Game"
draft: false

seo:
  title: "Play Snake Free — Classic Arcade Game | SnackArcade"
  description: "Play Snake free in your browser. Guide the snake to eat food, grow longer and avoid crashing into the walls. Full controls, tips and FAQ. No download needed."
  targetKeywords:
    - snake game online
    - play snake free
    - classic snake game
    - snake no download
    - how to play snake
  noindexOverride: false

media:
  cover: ../../assets/games/snake/cover.png
  coverAlt: "Snake game board with a long green snake chasing a red food dot"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/snake
  entryFile: index.html
  bundleFileCount: 5
  bundleBytes: 10489

taxonomy:
  primaryCategory: arcade
  categories:
    - arcade
  tags:
    - classic
    - single-player
    - no-download
    - keyboard-only
    - high-score
    - retro
    - open-source
    - no-signup
  mechanics:
    - movement
    - growth
    - collision

content:
  intro: >-
    Snake is the arcade classic that has survived every technology shift since the 1970s:
    a snake that grows longer with every piece of food it eats, and one rule that decides
    everything — do not crash into the walls, and do not bite your own tail. It is the
    purest possible test of control and foresight, and it runs beautifully in a browser
    tab with no download and no account. The version here keeps the gameplay honest and
    simple: eat, grow, survive, and chase your own high score.

  about:
    - >-
      Snake has been played in one form or another since the earliest arcade machines and
      home computers, and it became a global habit when a version shipped with mobile
      phones in the 1990s. Its appeal is timeless: the rules take five seconds to learn,
      every game is short, and the only opponent is your own nerve as the snake gets longer
      and the space gets tighter.
    - >-
      The game is a test of two things at once. The first is control: the snake never stops
      moving, so every turn is a commitment. The second is planning: as the snake grows, you
      need to leave yourself room to double back, because the fastest route to the food is
      often the one that traps you afterwards. Good players think two turns ahead, not one.
    - >-
      This version is based on an open-source HTML5 implementation by Felipe Freitas,
      released under the MIT licence. It runs entirely in your browser, uses the arrow keys
      on desktop, and offers the same satisfying pick-up-and-play loop as the classic game.
      No download, no sign-up, no waiting — the game starts the moment you press a key.

  howToPlay:
    - step: "Start the game."
      detail: >-
        The snake begins moving as soon as the game starts, usually from the centre of the
        board. Your job is to steer it towards the food that appears one piece at a time.
    - step: "Eat the food to grow."
      detail: >-
        Every piece of food the snake eats makes it one segment longer and adds to your
        score. The more you eat, the longer the snake becomes — and the harder it is to
        manoeuvre.
    - step: "Steer with the arrow keys."
      detail: >-
        Use the arrow keys to change direction. The snake cannot turn back on itself, so
        pressing the opposite direction to your current heading is usually ignored.
    - step: "Avoid the walls and yourself."
      detail: >-
        The game ends when the snake hits the edge of the board or collides with its own
        body. As it grows, its own tail becomes the biggest danger.
    - step: "Beat your high score."
      detail: >-
        Each food you eat adds to your score, and your best score is saved locally so you
        can try to beat it on your next game.

  controls:
    - action: "Move up"
      desktop: "Up arrow key or W"
      mobile: "Swipe up"
    - action: "Move down"
      desktop: "Down arrow key or S"
      mobile: "Swipe down"
    - action: "Move left"
      desktop: "Left arrow key or A"
      mobile: "Swipe left"
    - action: "Move right"
      desktop: "Right arrow key or D"
      mobile: "Swipe right"
    - action: "Pause the game"
      desktop: "Press the Pause button, if available"
      mobile: "Tap the Pause button, if available"
    - action: "Restart the game"
      desktop: "Click the Play button after losing"
      mobile: "Tap the Play button after losing"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Never chase food across the board"
      body: >-
        The fastest route to the food is often the route that traps you. Plan a path that
        leaves room to turn, especially when the snake is short and the board looks empty.
    - title: "Build a safe loop early"
      body: >-
        In the early game, keep the snake moving in wide, predictable loops around the board.
        A looping pattern gives you space to react, while tight zigzags paint you into a
        corner.
    - title: "Give yourself a turning lane"
      body: >-
        A long snake is its own worst enemy. Always keep at least a two-cell gap between the
        head and the nearest part of the body, so you have somewhere to go when the food
        appears behind you.
    - title: "Do not double back on yourself"
      body: >-
        Pressing the direction that would reverse the snake's movement usually does nothing,
        but a failed reverse at the wrong moment sends the head straight into the body.
        Learn to turn in a loop instead of reversing.
    - title: "Stay calm when the tail is close"
      body: >-
        When the snake fills most of the board, slow your thinking, not the snake. Look for
        the largest clear area and steer toward it, letting the tail move out of your way
        as it follows you.
    - title: "Use the whole board, not just the centre"
      body: >-
        The edges are dangerous but also useful. Sweeping the outer lanes early lets you
        collect food with long, predictable runs and keeps the centre clear for emergency
        turns later.

  features:
    - "Classic Snake gameplay with a growing snake and rising score"
    - "Runs entirely in your browser with no download or plugin"
    - "Keyboard controls on desktop and touch swipes on mobile"
    - "Best score saved locally in your browser"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Snake free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I control the snake?"
      a: >-
        Use the arrow keys on a desktop keyboard to steer, or swipe in the direction you want
        the snake to move on a touchscreen. The snake cannot reverse directly into itself.
    - q: "What happens when the snake hits a wall?"
      a: >-
        The game ends. Hitting the edge of the board or colliding with your own body ends the
        run and shows your final score.
    - q: "Can I play Snake on my phone?"
      a: >-
        Yes. The game supports touch controls — swipe in any direction to steer. It works in
        portrait and landscape on mobile browsers.
    - q: "Is my high score saved?"
      a: >-
        Your best score is saved in your browser's local storage, so closing the tab does not
        wipe it. Clearing your browser data or switching devices will reset it.
    - q: "How do I get a high score in Snake?"
      a: >-
        Eat food to grow the snake and add to your score, while keeping enough room to
        manoeuvre. The tips above cover the safe-loop and turning-lane habits that keep games
        alive longer.

info:
  developer: "Felipe Freitas"
  released: "2019"
  genre:
    - Arcade
    - Retro
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 5

license:
  license: MIT
  licenseUrl: "https://github.com/FelipeFreitas96/HTML5-Snake/blob/master/LICENSE"
  author: "Felipe Freitas"
  authorUrl: "https://github.com/FelipeFreitas96"
  sourceUrl: "https://github.com/FelipeFreitas96/HTML5-Snake"
  assetsLicense: "same as code license"
  attributionRendered: "Snake, based on HTML5-Snake by Felipe Freitas · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-05
updatedAt: 2026-08-05
---

Snake is the game that proves a great arcade game needs almost nothing: a square, a moving
line and a target. Every session is short, every death is your own doing, and every new
high score is a small triumph of patience over reflexes. It is the perfect one-minute
challenge that somehow always lasts ten.
