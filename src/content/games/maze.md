---
title: "Maze"
h1: "Play Maze Online — Free Logic Puzzle Game"
draft: false

seo:
  title: "Play Maze Free — Logic Puzzle Game | SnackArcade"
  description: "Play Maze free in your browser. Navigate a randomly generated maze from start to finish as fast as you can. Full controls, tips and FAQ. No download needed."
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
    - keyboard-only
    - relaxing
    - classic
    - open-source
    - no-signup
  mechanics:
    - navigation
    - pathfinding
    - maze-generation

content:
  intro: >-
    Maze is the classic puzzle of finding your way through a labyrinth of walls, from the
    start to the finish, with nothing but your sense of direction. Every maze in this game
    is generated fresh, so no two runs are the same. It is a quiet, thoughtful game — no
    timer screaming at you, no enemies chasing you — just a wall of corridors and the
    question of which way to turn next. Play it free in your browser with no download and
    no account.

  about:
    - >-
      Mazes are among the oldest puzzles in human history, carved into stone thousands of
      years ago and solved for fun ever since. The appeal is timeless: a maze is a problem
      you can see in full, and the solution is a path you find by looking and thinking
      rather than by luck.
    - >-
      The game generates a random maze every time, so each run is a new challenge. Some
      mazes are open and easy to read; others twist back on themselves and reward a careful
      method. The most reliable technique is the wall-following rule — keep one hand on a
      wall and walk — which always finds the exit of a simply connected maze.
    - >-
      This version is based on an open-source maze game by Drew Silcock, released under the
      MIT licence. It runs entirely in your browser and uses the arrow keys on desktop, so
      you can start solving the moment the maze appears. No download, no sign-up and no
      pressure to hurry.

  howToPlay:
    - step: "Look at the maze."
      detail: >-
        The maze is drawn as a grid of walls and corridors. Find the start point and the
        finish point before you move — a quick look at the layout saves a lot of wandering.
    - step: "Move with the arrow keys."
      detail: >-
        Use the arrow keys to move through the corridors. You cannot pass through walls, so
        every turn is a choice about which passage to follow.
    - step: "Find the exit."
      detail: >-
        Reach the finish point to complete the maze. Your time is recorded so you can try to
        beat it on the next maze.
    - step: "Use the wall-following trick."
      detail: >-
        Keep one hand on a wall and keep walking. In a maze with no loops, this rule
        guarantees you reach the exit without retracing your steps in circles.
    - step: "Generate a new maze."
      detail: >-
        When you finish, generate another maze for a brand-new challenge. Every maze is
        randomly built, so the game never repeats.

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
    - action: "Generate a new maze"
      desktop: "Click the New Maze button"
      mobile: "Tap the New Maze button"
    - action: "Restart the current maze"
      desktop: "Click the Restart button"
      mobile: "Tap the Restart button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the maze"
      mobile: "Tap the fullscreen button above the maze"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Study the layout before moving"
      body: >-
        A maze is a puzzle you can see in full. Take a few seconds to trace the corridors
        with your eyes and find the general direction of the exit before you take a single
        step.
    - title: "Follow one wall"
      body: >-
        The classic wall-following rule never fails on a simply connected maze: keep a hand
        on one wall and keep walking. It may not be the shortest route, but it always reaches
        the exit.
    - title: "Avoid retracing your steps"
      body: >-
        If you keep returning to the same junction, you are going in circles. Pick a new
        direction at the junction and mark the dead end in your memory.
    - title: "Work outward from the start"
      body: >-
        Read the maze as a branching tree from the start point. Exploring one branch at a
        time — rather than jumping between corridors — builds a clear mental map.
    - title: "Do not rush"
      body: >-
        There is no timer, so speed is optional. A slow, methodical run beats a frantic one,
        and you will finish faster by thinking than by dashing.
    - title: "Learn to read dead ends"
      body: >-
        Corridors that narrow into a wall are dead ends. Spotting them early lets you avoid
        entire useless branches and keeps you moving toward the exit.

  features:
    - "Randomly generated mazes — a new puzzle every game"
    - "Runs entirely in your browser with no download or plugin"
    - "Keyboard controls on desktop and touch swipes on mobile"
    - "No timer — play at your own pace"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Maze free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I control the player?"
      a: >-
        Use the arrow keys on a desktop keyboard to move through the corridors, or swipe in
        the direction you want to go on a touchscreen.
    - q: "Is every maze different?"
      a: >-
        Yes. Each maze is generated randomly when you start, so no two games are the same
        and the puzzle never runs out of layouts.
    - q: "Can I play Maze on my phone?"
      a: >-
        Yes. Swipe in any direction to move through the corridors. The game works in
        portrait and landscape on mobile browsers.
    - q: "Is there a guaranteed way to solve a maze?"
      a: >-
        Yes — the wall-following rule. Keep one hand on a wall and keep walking, and you will
        always reach the exit of a maze with no loops.
    - q: "What happens when I reach the exit?"
      a: >-
        Completing the maze records your time and you can generate a fresh maze to play
        again, trying to beat your best time.

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
updatedAt: 2026-08-05
---

Maze is proof that a puzzle needs no enemy, no clock and no score to be absorbing. It is
just you, a wall of corridors, and the quiet satisfaction of finding the way out. The
answer is always there — you only have to look.
