---
title: "Minesweeper"
h1: "Play Minesweeper Online — Free Logic Puzzle"
draft: false

seo:
  title: "Play Minesweeper Free — No Guessing Mode | SnackArcade"
  description: "Play Minesweeper free in your browser. Every board is solvable by logic alone — no guessing required. Full rules, pattern tips and FAQ. No download."
  targetKeywords:
    - minesweeper online
    - play minesweeper free
    - minesweeper no guessing
    - minesweeper logic patterns
    - how to play minesweeper
  noindexOverride: false

media:
  cover: ../../assets/games/minesweeper/cover.png
  coverAlt: "Minesweeper grid with revealed numbers, flags and an unexploded minefield"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/minesweeper
  entryFile: index.html
  bundleFileCount: 9
  bundleBytes: 409542

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - logic
    - classic
    - single-player
    - retro
    - brain-training
    - no-download
    - mobile-friendly
    - open-source
    - no-signup
  mechanics:
    - number-clues
    - flagging
    - deduction

content:
  intro: >-
    Minesweeper is the classic logic game where every number on the board is a clue to
    where the mines are hidden. Click a square and it either reveals a number telling you
    how many mines touch it, or it is empty, or — in the classic version — it is a mine and
    the game is over. This version has a twist that serious players have wanted for years:
    every board is guaranteed solvable by pure logic, so you never have to guess. Play it
    free in your browser with no download and no account.

  about:
    - >-
      Minesweeper has been part of computing culture since the 1960s and became a global
      habit when it shipped with Windows in 1990. The rules are simple: a grid hides a
      fixed number of mines, and each revealed square shows how many of its eight
      neighbours contain a mine. Flag the mines, clear everything else, and you win.
    - >-
      The skill in Minesweeper is reading the numbers as a system of equations. A "1"
      touching exactly one unknown square tells you that square is a mine. A "1" touching
      two unknown squares next to another "1" touching the same two tells you neither is.
      The classic game sometimes forces a coin-flip guess, which is why this version's
      guarantee matters: the generator here produces only boards where every mine can be
      located by logic alone.
    - >-
      This version is based on Kaboom, an open-source implementation by Paweł Marczewski
      released under the MIT licence. It runs entirely in your browser, supports the
      standard grid sizes, and its "cruel but fair" generator means every loss is your own
      reasoning error — never a bad roll of the dice.

  howToPlay:
    - step: "Reveal a square."
      detail: >-
        Click a square to reveal what is underneath. A number tells you how many mines
        surround it; an empty square reveals its neighbours automatically; a mine ends the
        game.
    - step: "Read the numbers."
      detail: >-
        Each number counts the mines in the eight squares around it. A 1 means exactly one
        mine, a 2 means exactly two, and so on up to 8.
    - step: "Flag suspected mines."
      detail: >-
        Right-click a square (or use the flag tool on touch) to mark it as a mine. Flagging
        keeps your reasoning visible and prevents you from clicking a square you know is
        dangerous.
    - step: "Clear the safe squares."
      detail: >-
        Once a square's surrounding mines are flagged, you can safely reveal the remaining
        neighbours around it. The game is won when every non-mine square is revealed.
    - step: "Win without guessing."
      detail: >-
        On this site every board is solvable by logic alone. If you are stuck, you have
        missed a deduction — no move ever needs to be a gamble.

  controls:
    - action: "Reveal a square"
      desktop: "Left-click a square"
      mobile: "Tap a square"
    - action: "Flag a mine"
      desktop: "Right-click a square"
      mobile: "Switch to the flag tool, then tap a square"
    - action: "Chord (reveal neighbours)"
      desktop: "Click a revealed number whose mines are all flagged"
      mobile: "Tap a revealed number whose mines are all flagged"
    - action: "Switch tools"
      desktop: "Click the reveal or flag tool button"
      mobile: "Tap the reveal or flag tool button"
    - action: "Restart the game"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Choose grid size"
      desktop: "Select Small, Medium or Large before starting"
      mobile: "Select Small, Medium or Large before starting"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the grid"
      mobile: "Tap the fullscreen button above the grid"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Start from the empty openings"
      body: >-
        The first reveal opens a large empty area on most boards. Work outward from empty
        squares, because a revealed number surrounded by empty squares is almost always
        solvable immediately.
    - title: "Learn the 1-2-1 pattern"
      body: >-
        When a 1 and a 2 sit next to each other in a row with three unknown squares below
        them, the two squares under the 2 are mines and the squares under the 1s are safe.
        This one pattern solves a huge share of boards.
    - title: "Learn the 1-2-2-1 pattern"
      body: >-
        The sequence 1-2-2-1 over a row of unknown squares means the middle two are mines
        and the outer two are safe. Spotting these repeated patterns turns fast scanning
        into fast solving.
    - title: "Treat flags as the answer, not the goal"
      body: >-
        Flag every mine you are certain about — but remember that flagging is not the win
        condition. The goal is revealing all safe squares, and a wrong flag is as bad as a
        wrong reveal.
    - title: "Work from known numbers inward"
      body: >-
        When you solve one cluster of numbers, its edge becomes a new set of known clues.
        Keep expanding from confirmed territory instead of jumping to an unexplored corner
        of the grid.
    - title: "When stuck, re-check the boundaries"
      body: >-
        A square at the edge of the board has fewer neighbours, which makes its clues easier
        to read. If the middle of the board feels stuck, solve the border first — it
        usually unlocks the interior.

  features:
    - "Classic Minesweeper where every board is solvable by logic alone"
    - "No guessing mode — a unique guarantee most minesweeper sites do not offer"
    - "Runs entirely in your browser with no download or plugin"
    - "Multiple grid sizes for easy, medium and expert play"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Minesweeper free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no sign-up and no premium version.
    - q: "What makes this Minesweeper different?"
      a: >-
        Every board on this page is generated so that it can be solved by pure logic, with
        no guessing. In classic minesweeper, players sometimes reach a coin-flip position;
        here that never happens.
    - q: "How do the numbers work?"
      a: >-
        Each revealed number tells you how many mines are in the eight squares around it.
        A 1 means exactly one mine touches that square, a 2 means two, and so on.
    - q: "Can I play Minesweeper on my phone?"
      a: >-
        Yes. Tap to reveal and switch to the flag tool to mark mines. The game works in
        portrait and landscape on mobile browsers.
    - q: "How do I flag a mine?"
      a: >-
        On desktop, right-click a square to flag it. On touch devices, switch to the flag
        tool and then tap the square. Flagging keeps your reasoning visible.
    - q: "What does the chord move do?"
      a: >-
        Clicking a revealed number whose surrounding mines are all flagged reveals the
        remaining safe neighbours in one action. It is the fastest way to clear large areas.
    - q: "What other logic puzzles are on this site?"
      a: >-
        If you enjoy deduction, Nonogram and Sudoku are both pure logic puzzles on the same
        category page, free in your browser with no download.

info:
  developer: "Paweł Marczewski"
  released: "2019"
  genre:
    - Puzzle
    - Logic
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 8

license:
  license: MIT
  licenseUrl: "https://github.com/pwmarcz/kaboom/blob/master/LICENSE"
  author: "Paweł Marczewski"
  authorUrl: "https://github.com/pwmarcz"
  sourceUrl: "https://github.com/pwmarcz/kaboom"
  assetsLicense: "same as code license"
  attributionRendered: "Based on Kaboom by Paweł Marczewski · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Minesweeper turns a grid of hidden mines into a system of logical equations, and this
version respects that promise completely: every board can be solved without a single
guess. Lose and it is your deduction that failed, not the generator — which is exactly
what makes the game fair and endlessly replayable.
