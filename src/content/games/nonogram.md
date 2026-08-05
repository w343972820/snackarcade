---
title: "Nonogram"
h1: "Play Nonogram Online — Free Picture Logic Puzzle"
draft: false

seo:
  title: "Play Nonogram Free — Picture Logic Puzzle | SnackArcade"
  description: "Play Nonogram free in your browser. Use the number clues along each row and column to reveal a hidden picture. Full rules, solving tips and FAQ. No download."
  targetKeywords:
    - nonogram online
    - play nonogram free
    - nonogram puzzles
    - how to solve nonogram
    - picture logic puzzle
  noindexOverride: false

media:
  cover: ../../assets/games/nonogram/cover.png
  coverAlt: "Nonogram grid with row and column number clues and a partially revealed picture"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/nonogram
  entryFile: index.html
  bundleFileCount: 5
  bundleBytes: 30041

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - logic
    - relaxing
    - single-player
    - brain-training
    - no-download
    - mobile-friendly
    - open-source
    - no-signup
  mechanics:
    - line-solving
    - deduction
    - grid-painting

content:
  intro: >-
    Nonogram is a picture logic puzzle that hides an image inside a grid of numbers. Each
    row and column carries clues that tell you exactly how many cells to fill in, in what
    order — and your job is to deduce which cells are filled and which stay empty. There
    is no guessing involved: every square can be worked out from the clues alone. Solve
    the grid and the hidden picture is revealed. Play it free in your browser with puzzles
    at several difficulty levels and no download.

  about:
    - >-
      The nonogram was invented in the late 1980s, first in Japan and independently in
      Sweden, and became a worldwide puzzle craze under several names. The idea is elegant:
      a row with the clue "3 1" means there is a block of three filled cells, then at least
      one empty cell, then a block of one filled cell — in that exact order.
    - >-
      Solving a nonogram is pure deduction. You cannot see the picture while you work, only
      the numbers, and the numbers fully determine the answer. Every row you solve gives
      you information that constrains the columns, and every column you solve does the same
      for the rows. The picture at the end is the reward for a chain of logical steps.
    - >-
      This version is an open-source implementation by HandsomeOne, released under the MIT
      licence, and includes a puzzle generator so you always have fresh puzzles at easy,
      medium and hard difficulty. It runs entirely in your browser with no account and no
      download, and the controls work equally well with a mouse or on a touchscreen.

  howToPlay:
    - step: "Read the row clues."
      detail: >-
        The numbers at the start of each row and above each column describe the blocks of
        filled cells in that line, in order. A clue of "2 1" means a block of two, then a
        block of one, separated by at least one empty cell.
    - step: "Mark filled cells."
      detail: >-
        Click or tap a cell to fill it in. When you are sure a cell must be empty, mark it
        with an X instead — knowing where cells are not filled is just as important as
        knowing where they are.
    - step: "Work across rows and columns."
      detail: >-
        Solve one line at a time, using what you learn from rows to constrain columns and
        vice versa. Each solved line makes the rest of the grid easier.
    - step: "Reveal the picture."
      detail: >-
        When every row and column satisfies its clues, the filled cells form the hidden
        picture and the puzzle is solved.
    - step: "Choose a difficulty."
      detail: >-
        Start with an easy puzzle to learn the rhythm, then move to medium and hard grids
        as your deduction speed improves.

  controls:
    - action: "Fill a cell"
      desktop: "Click a cell"
      mobile: "Tap a cell"
    - action: "Mark a cell as empty"
      desktop: "Right-click a cell, or click with the X tool selected"
      mobile: "Use the X tool, then tap a cell"
    - action: "Clear a cell"
      desktop: "Click a filled cell with the erase tool"
      mobile: "Use the erase tool, then tap a cell"
    - action: "Switch tools"
      desktop: "Click the fill, X or erase tool button"
      mobile: "Tap the fill, X or erase tool button"
    - action: "Undo last action"
      desktop: "Click the Undo button"
      mobile: "Tap the Undo button"
    - action: "Restart the puzzle"
      desktop: "Click the Restart button"
      mobile: "Tap the Restart button"
    - action: "Choose difficulty"
      desktop: "Select Easy, Medium or Hard before starting"
      mobile: "Select Easy, Medium or Hard before starting"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the grid"
      mobile: "Tap the fullscreen button above the grid"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Start with the longest clue"
      body: >-
        In every row and column, the longest block is the most constrained. A row of ten
        cells with a clue of "7" has very few possible positions, and you can usually fill
        in the overlapping cells immediately.
    - title: "Use the overlap rule"
      body: >-
        For any block, count how many cells it must occupy from each end. If the block is
        longer than half the line, some cells are guaranteed filled no matter where it
        sits — fill those in first.
    - title: "Mark empties as you go"
      body: >-
        Every cell you prove empty is a constraint removed. Marking Xs early keeps your
        working memory clear and makes the next deduction easier to see.
    - title: "Work the edges inward"
      body: >-
        Cells at the edges of a row are easier to pin down than cells in the middle. Solve
        the outer lines first, then use the columns they constrain to push inward.
    - title: "Re-read a line after every breakthrough"
      body: >-
        Solving one row often unlocks several columns. After a big deduction, scan the
        lines it touches again — new information usually makes old lines solvable.
    - title: "Never guess"
      body: >-
        Nonograms are always solvable by logic alone. If you feel stuck, you have missed a
        deduction, not reached a fork in the road. Look for a line with only a few
        possibilities and test them.

  features:
    - "Picture logic puzzles with a built-in generator at three difficulties"
    - "Runs entirely in your browser with no download or plugin"
    - "Fill, mark-empty and erase tools plus undo"
    - "Deduction puzzles with no guessing required"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Nonogram free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no sign-up and no premium version.
    - q: "What do the numbers on a nonogram mean?"
      a: >-
        The numbers tell you the blocks of filled cells in that row or column, in order. For
        example, "2 1" means a block of two filled cells followed by a block of one, with at
        least one empty cell between them.
    - q: "Do I need to guess in a nonogram?"
      a: >-
        No. Every puzzle is solvable by logic alone. If you feel forced to guess, you have
        missed a deduction — try a line with only a couple of possible arrangements.
    - q: "Can I play Nonogram on my phone?"
      a: >-
        Yes. Tap a cell to fill it, and switch tools for marking empty cells. The game works
        in portrait and landscape on mobile browsers.
    - q: "Are there different difficulty levels?"
      a: >-
        Yes. The game includes easy, medium and hard puzzles, which change the size of the
        grid and the complexity of the clues.
    - q: "What is the picture at the end?"
      a: >-
        Each puzzle hides a small picture that appears when you solve the grid correctly.
        The picture is the reward for completing the logical chain.
    - q: "What other logic puzzles are on this site?"
      a: >-
        If you enjoy deduction, Sudoku and Minesweeper are both pure logic puzzles on the
        same category page, free in your browser with no download.

info:
  developer: "HandsomeOne"
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
  avgSessionMinutes: 12

license:
  license: MIT
  licenseUrl: "https://github.com/HandsomeOne/Nonogram/blob/master/LICENSE.md"
  author: "HandsomeOne"
  authorUrl: "https://github.com/HandsomeOne"
  sourceUrl: "https://github.com/HandsomeOne/Nonogram"
  assetsLicense: "same as code license"
  attributionRendered: "Nonogram by HandsomeOne · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Nonogram is proof that a puzzle needs no randomness to be endlessly replayable. Every
grid is a chain of small, certain deductions that build on each other, and the picture at
the end is your reward for trusting the logic instead of your gut.
