---
title: "Sudoku"
h1: "Play Sudoku Online — Free Number Puzzle"
draft: false

seo:
  title: "Play Sudoku Free — Number Puzzle | SnackArcade"
  description: "Play Sudoku free in your browser across five difficulty levels. Fill the grid so every row, column and box holds the digits 1 to 9. Full rules and tips."
  targetKeywords:
    - sudoku online
    - play sudoku free
    - sudoku for beginners
    - sudoku difficulty levels
    - how to solve sudoku
  noindexOverride: false

media:
  cover: ../../assets/games/sudoku/cover.png
  coverAlt: "Sudoku cover card with the game title and a decorative block grid"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/sudoku
  entryFile: index.html
  bundleFileCount: 5
  bundleBytes: 38565

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - number-puzzle
    - logic
    - single-player
    - brain-training
    - relaxing
    - daily-puzzle
    - no-download
    - mobile-friendly
    - open-source
  mechanics:
    - number-placement
    - candidate-elimination
    - grid-solving

content:
  intro: >-
    Sudoku is the number puzzle that conquered the world: a 9 by 9 grid where every row,
    every column and every 3 by 3 box must contain the digits 1 to 9 exactly once. The
    puzzle gives you a few starting digits and your job is to fill in the rest using pure
    logic. There is no arithmetic — only deduction — which is why it appeals to everyone
    from students to grandmothers. Play it free in your browser across five difficulty
    levels, with an on-screen number pad, and no download.

  about:
    - >-
      Sudoku became an international phenomenon in the mid-2000s when newspapers discovered
      the Japanese puzzle and its elegant rules. The name is Japanese for "single number",
      but the puzzle itself was popularised in its modern form in the West. Its genius is
      that the rules fit in one sentence while the solving can take anywhere from minutes
      to hours.
    - >-
      Solving Sudoku is a pure exercise in elimination. Every empty cell can only hold a
      digit that is not already present in its row, column and box. Easy puzzles can be
      solved by scanning for cells with a single possible digit; hard ones require keeping
      track of candidates and testing chains of consequences. On this page you enter each
      digit from the on-screen number pad, and any digit that clashes with its row, column
      or box is highlighted in red straight away.
    - >-
      This page uses the sudoku.js puzzle engine by Robert McGuire, released under the MIT
      licence, wrapped in an original interface designed for this site. The engine generates
      and validates puzzles across five difficulty levels, and the interface adds an
      on-screen number pad, a Check button that flags wrong entries and a Solve button that
      reveals the answer. Everything runs in your browser with no download and no account.

  howToPlay:
    - step: "Read the starting grid."
      detail: >-
        The puzzle begins with some digits already filled in. These are the clues — they are
        fixed and cannot be changed, and together they determine a unique solution.
    - step: "Fill a digit into a cell."
      detail: >-
        Click or tap an empty cell and choose a digit. The digit is correct only if it does
        not already appear in that row, column or 3 by 3 box.
    - step: "Check your work as you go."
      detail: >-
        Enter a digit from the number pad and the board flags it straight away if it is wrong.
        You can also press the Check button at any point to validate every digit you have
        filled in so far.
    - step: "Follow the three rules."
      detail: >-
        Every row, every column and every 3 by 3 box must contain each digit from 1 to 9
        exactly once. Satisfy all three and the puzzle is solved.
    - step: "Choose your difficulty."
      detail: >-
        Start with an easy puzzle to learn the flow, then work up through medium, hard,
        very hard and insane as your elimination skills improve.

  controls:
    - action: "Select a cell"
      desktop: "Click a cell"
      mobile: "Tap a cell"
    - action: "Enter a digit"
      desktop: "Press 1 to 9 on the keyboard, or click the number pad"
      mobile: "Tap a digit on the number pad"
    - action: "Check your progress"
      desktop: "Click the Check button to validate your entries"
      mobile: "Tap the Check button to validate your entries"
    - action: "Clear a cell"
      desktop: "Press Backspace, or click the Erase button"
      mobile: "Tap the Erase button"
    - action: "Reveal the solution"
      desktop: "Click the Solve button to show the full answer"
      mobile: "Tap the Solve button to show the full answer"
    - action: "Deal a new puzzle"
      desktop: "Click the New puzzle button"
      mobile: "Tap the New puzzle button"
    - action: "Choose difficulty"
      desktop: "Select Easy, Medium, Hard, Very hard or Insane before starting"
      mobile: "Select Easy, Medium, Hard, Very hard or Insane before starting"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button in the bar below the grid"
      mobile: "Tap the fullscreen button in the bar below the grid"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Scan for single candidates first"
      body: >-
        Start by finding cells with only one possible digit — a digit missing from its row,
        column and box all at once. Filling these easy cells cascades into more singles.
    - title: "Check your work before moving on"
      body: >-
        The Check button validates every digit you have entered and counts any that are
        wrong. Run it whenever a section feels stuck so you never build on a mistake.
    - title: "Check rows, columns and boxes together"
      body: >-
        A digit may fit a row and column but be blocked by its box, or vice versa. Always
        check all three constraints before you commit a digit.
    - title: "Hunt for hidden singles"
      body: >-
        When a digit can only go in one cell of a row, column or box — even if that cell
        has several candidates — it is a hidden single and it is forced. Find these before you
        resort to testing chains.
    - title: "Look for naked pairs"
      body: >-
        If two cells in the same row, column or box both contain the same two candidate
        digits, those two digits cannot appear anywhere else in that unit. Removing them
        from other cells often unlocks the next step.
    - title: "Work from the easiest unit"
      body: >-
        The row, column or box with the most filled digits is the most constrained and the
        easiest to solve. Attack the densest areas first and let them unlock the rest.

  features:
    - "Sudoku across five difficulty levels from easy to insane"
    - "An on-screen number pad with Check and Solve controls"
    - "Error checking that keeps your logic honest"
    - "Runs entirely in your browser with no download or plugin"
    - "Puzzle engine open source under the MIT licence with credit"

  faq:
    - q: "Is Sudoku free to play?"
      a: >-
        Yes, completely. The puzzle engine is open source under the MIT licence and the game
        is free to play here with no payment, no sign-up and no premium version.
    - q: "What are the rules of Sudoku?"
      a: >-
        Fill the 9 by 9 grid so that every row, every column and every 3 by 3 box contains
        the digits 1 to 9 exactly once. The starting digits are fixed and the puzzle has
        exactly one solution.
    - q: "Can I play Sudoku on my phone?"
      a: >-
        Yes. Tap a cell and choose a digit from the on-screen number pad. The game works in
        portrait and landscape on mobile browsers.
    - q: "How do I enter digits?"
      a: >-
        Select a cell, then type 1 to 9 on your keyboard or tap the on-screen number pad.
        Backspace or the Erase button clears a cell, the Check button validates your entries
        and the Solve button reveals the answer.
    - q: "How many difficulty levels are there?"
      a: >-
        There are five: Easy, Medium, Hard, Very hard and Insane. They differ in how many
        starting digits are given and how many advanced techniques are needed.
    - q: "Do I need to be good at maths to play?"
      a: >-
        No. Sudoku uses no arithmetic at all — only the digits 1 to 9 as symbols. The
        challenge is logical elimination, not calculation.
    - q: "What other number and logic puzzles are on this site?"
      a: >-
        If you enjoy Sudoku, 2048 is a faster number puzzle and Nonogram is a pure logic
        grid puzzle, both free in your browser with no download.

info:
  developer: "Robert McGuire"
  released: "2013"
  genre:
    - Puzzle
    - Number
    - Logic
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 15

license:
  license: MIT
  licenseUrl: "https://github.com/robatron/sudoku.js/blob/master/LICENSE"
  author: "Robert McGuire"
  authorUrl: "https://github.com/robatron"
  sourceUrl: "https://github.com/robatron/sudoku.js"
  assetsLicense: "Puzzle engine MIT (sudoku.js); the game interface is original to this site"
  attributionRendered: "Puzzle engine: sudoku.js by Robert McGuire · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-10-10
---

Sudoku is the rare puzzle that gets calmer the better you are at it. Beginners fight the
grid; experts read it like a conversation between rows, columns and boxes. There is no
clock, no opponent and no luck — just the quiet satisfaction of a grid that resolves
itself one certain step at a time.
