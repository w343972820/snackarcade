---
title: "Maze"
h1: "Play Maze Online — Free Logic Puzzle Game"
draft: false

seo:
  title: "Play Maze Free — Logic Puzzle Game | SnackArcade"
  description: "Play Maze free in your browser. Beat the 20-second clock: collect every counter, then reach the exit of a randomly generated maze."
  targetKeywords:
    - maze game online
    - play maze free
    - maze puzzle browser
    - maze game no download
    - how to play maze
  noindexOverride: false

media:
  cover: ../../assets/games/maze/cover.png
  coverAlt: "Maze game with a winding corridor of walls and a start marker"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/maze
  entryFile: index.html
  bundleFileCount: 8
  bundleBytes: 77493

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - logic
    - single-player
    - no-download
    - mobile-friendly
    - quick-session
    - classic
    - open-source
    - no-signup
  mechanics:
    - navigation
    - pathfinding
    - maze-generation

content:
  intro: >-
    Finding the way through a maze is the oldest puzzle there is, but this version adds a clock
    and a scavenger hunt. You start with 20 seconds on the timer, and reaching the exit is not
    enough on its own — you also have to collect every counter scattered along the corridors.
    Gold counters sit on the solution path and green ones are scattered at random, and each green
    one is worth five extra seconds. That turns every junction into a real decision between the
    short route and the rich one. Every maze is generated fresh, so no two runs are the same.
    Play it free in your browser with no download and no account.

  about:
    - >-
      Mazes are among the oldest puzzles in human history, carved into stone thousands of
      years ago and solved for fun ever since. The appeal is timeless: a maze is a problem
      you can see in full, and the solution is a path you find by looking and thinking
      rather than by luck.
    - >-
      The game generates a random maze every time, so each run is a new challenge. Every maze
      is built as what programmers call a perfect maze — there is exactly one route between any
      two points and no loops anywhere. That is why the old wall-following trick works here,
      but read it carefully: it only walks you to the exit. It will not collect a single
      counter on the way, and without every counter, the exit does not count.
    - >-
      This version is based on an open-source maze game by Drew Silcock, released under the MIT
      licence, and it runs entirely in your browser. On desktop you steer with the arrow keys or
      W A S D; on a phone you tap the top, bottom, left or right of the screen. Three sizes sit
      on the menu — 10×10, 15×15 and 20×20 — and there is a hidden 50×50 monster for anyone who
      finds the key. No download and no sign-up.

  howToPlay:
    - step: "Look at the maze before you move."
      detail: >-
        The maze is drawn as a grid of walls and corridors, with you at the top-left and the pink
        exit square at the bottom-right. The clock does not start until your first move, so this
        look costs you nothing.
    - step: "Move with the arrow keys or WASD."
      detail: >-
        Use the arrow keys, or W A S D, to walk the corridors. You cannot pass through walls, so
        every turn is a choice about which passage to follow. On a touchscreen, tap the top,
        bottom, left or right of the screen instead.
    - step: "Pick up every counter."
      detail: >-
        Small circles sit in the corridors — gold ones on the solution path, green ones scattered
        at random. You have to collect all of them before the exit will open. Every green counter
        adds five seconds to the clock, so they are worth going out of your way for.
    - step: "Watch the clock."
      detail: >-
        You begin with 20 seconds and it starts ticking on your first move. The tally in the
        corner shows how many counters you still need, and the timer turns orange under 10
        seconds and red at 5, so you always know how much margin you have left.
    - step: "Reach the exit."
      detail: >-
        Once the board is clear of counters, walk to the pink square at the bottom-right to
        finish. The game tells you how many seconds you had left over.
    - step: "Play again or pick a new size."
      detail: >-
        On the win or lose screen, press Enter or tap the screen to go back to the menu, where
        you can choose a different size or ask for a brand-new maze.

  controls:
    - action: "Move up"
      desktop: "Up arrow key or W"
      mobile: "Tap the top of the screen"
    - action: "Move down"
      desktop: "Down arrow key or S"
      mobile: "Tap the bottom of the screen"
    - action: "Move left"
      desktop: "Left arrow key or A"
      mobile: "Tap the left of the screen"
    - action: "Move right"
      desktop: "Right arrow key or D"
      mobile: "Tap the right of the screen"
    - action: "Choose a difficulty"
      desktop: "Click a difficulty box, or press E, M or H"
      mobile: "Tap a difficulty box"
    - action: "Pause or open the in-game menu"
      desktop: "Escape key"
      mobile: "Tap the pause button in the bottom-left corner"
    - action: "Continue after pausing"
      desktop: "Escape again, or press C"
      mobile: "Tap Continue in the menu"
    - action: "Restart the same maze"
      desktop: "Escape, then press R"
      mobile: "Open the menu, then tap Restart"
    - action: "Return to the difficulty menu"
      desktop: "Escape, then press Q"
      mobile: "Open the menu, then tap Quit"
    - action: "Play again after winning or losing"
      desktop: "Enter key"
      mobile: "Tap the screen"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the maze"
      mobile: "Tap the fullscreen button above the maze"
    - action: "Exit fullscreen"
      desktop: "Escape key, or the fullscreen button"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Study the layout before moving"
      body: >-
        A maze is a puzzle you can see in full, and the clock stays frozen until your first
        keypress. Use those free seconds to trace the corridors with your eyes and pick a first
        direction before you take a single step.
    - title: "Treat wall-following as a safety net, not a plan"
      body: >-
        Keeping one hand on a wall and walking will always bring you to the exit of a maze like
        this one. That makes it a reliable rescue when you are lost — but it collects nothing, so
        it cannot win a round on its own.
    - title: "Detour for every green counter you can"
      body: >-
        A green counter is worth five seconds, and five seconds is a long time on a 20-second
        clock. On a tight maze, going a little out of your way for one usually pays for itself
        twice over in saved panic.
    - title: "Work outward from the start"
      body: >-
        Read the maze as a branching tree from the start point. Exploring one branch at a time —
        rather than jumping between distant corridors — builds a mental map you can act on
        quickly when the timer is running down.
    - title: "Decide early when the clock is short"
      body: >-
        With a few seconds left, do not waste them reading the board. Pick one target — the exit
        or the nearest counter — and commit, because a hesitant move costs the same second as a
        confident one.
    - title: "Learn to read dead ends"
      body: >-
        Corridors that narrow into a wall are dead ends. Spotting them early lets you avoid
        entire useless branches, which matters far more here than in an untimed maze.

  features:
    - "Randomly generated mazes — a new puzzle every game"
    - "A 20-second countdown you extend by collecting green counters"
    - "Every counter must be collected before the exit opens"
    - "Four maze sizes, including a hidden 50×50 monster"
    - "Keyboard controls on desktop and tap-to-move touch controls on mobile"
    - "Runs entirely in your browser — no download and no sign-up"

  faq:
    - q: "Is Maze free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I control the player?"
      a: >-
        Use the arrow keys or W A S D on a desktop keyboard, or tap the top, bottom, left or
        right of the screen on a touchscreen.
    - q: "Is there a time limit?"
      a: >-
        Yes. You start each maze with 20 seconds, and the clock begins on your first move.
        Collecting a green counter adds five seconds, so a long run depends on how many you
        pick up on the way.
    - q: "Is every maze different?"
      a: >-
        Yes. Each maze is generated fresh when you start it, so no two games are the same
        and the puzzle never runs out of layouts.
    - q: "Is there a guaranteed way to solve a maze?"
      a: >-
        Not in this version. Keeping one hand on a wall will always lead you to the exit, but
        you also have to collect every counter before the exit opens, so there is no single
        trick that finishes a round for you.
    - q: "Can I play Maze on my phone?"
      a: >-
        Yes. Tap the top, bottom, left or right of the screen to move in that direction, and
        use the pause button in the bottom-left corner to open the menu. It works in portrait
        and landscape.
    - q: "What happens when I reach the exit?"
      a: >-
        Reaching the exit finishes the maze only if you have collected every counter. The game
        then shows how many seconds you had left to spare, and pressing Enter or tapping the
        screen takes you back to the menu for another maze.

info:
  developer: "Drew Silcock"
  released: "2015"
  genre:
    - Puzzle
    - Logic
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 5

license:
  license: MIT
  licenseUrl: "https://github.com/drewsilcock/maze.js/blob/master/LICENSE"
  author: "Drew Silcock"
  authorUrl: "https://github.com/drewsilcock"
  sourceUrl: "https://github.com/drewsilcock/maze.js"
  assetsLicense: "same as code license"
  attributionRendered: "Maze by Drew Silcock · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-05
updatedAt: 2026-10-10
---

Maze is proof that a puzzle needs no enemy and no score to be absorbing — just you, a wall of
corridors, and twenty seconds that always feel shorter than they should. The answer is always
there. The question is whether you have time to find it.
