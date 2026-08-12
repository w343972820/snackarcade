---
title: "15-Puzzle"
h1: "Play 15-Puzzle Online — Free, No Download"
draft: false

seo:
  title: "Play 15-Puzzle Online Free — Sliding Puzzle | SnackArcade"
  description: "Play the 15-Puzzle sliding puzzle free in your browser. Slide numbered tiles into the empty space to order them 1 to 15. Controls, tips, FAQ. No download."
  targetKeywords:
    - 15 puzzle
    - play 15 puzzle online
    - 15 puzzle game
    - 15 puzzle no download
    - sliding puzzle game
    - how to solve 15 puzzle
  noindexOverride: false

media:
  cover: ../../assets/games/15-puzzle/cover.png
  coverAlt: "15-Puzzle board with numbered sliding tiles and an empty space on a four by four grid"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/15-puzzle
  entryFile: index.html
  bundleFileCount: 4
  bundleBytes: 7227

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - number-puzzle
    - logic
    - classic
    - brain-training
    - single-player
    - no-download
    - mobile-friendly
    - open-source
  mechanics:
    - tile-sliding
    - grid-solving
    - spatial-reasoning

content:
  intro: >-
    15-Puzzle is the sliding number puzzle that has been driving people quietly
    mad since the 1880s. Fifteen numbered tiles sit on a 4×4 board with one
    empty space, and your only move is to slide a tile into that space. Arrange
    the tiles in order from 1 to 15, left to right, top to bottom, and the
    puzzle is solved. It sounds simple, but the one-empty-space rule means every
    move undoes something else, and that tension is the whole game. Free in your
    browser, no download, and no timer — just you and fifteen stubborn tiles.

  about:
    - >-
      The 15-Puzzle was invented around 1880 — credit usually goes to Noyes
      Chapman, a postmaster in Canastota, New York — and it became the first
      true puzzle craze in American history. In 1891 the legendary puzzle
      designer Sam Loyd offered a $1,000 prize for solving a version with the 14
      and 15 tiles swapped. Thousands tried. Nobody ever collected, because that
      particular arrangement is mathematically impossible to solve.
    - >-
      The rules fit in one sentence: slide tiles into the empty space until the
      numbers run 1 to 15 in order, left to right, top to bottom. What makes it
      hard is that the empty space gives you exactly one degree of freedom.
      Every move that fixes a tile usually disturbs one you already placed, so
      solving means building and protecting structure rather than blindly
      nudging tiles toward their spots.
    - >-
      This version is a clean, dependency-free JavaScript implementation by
      Arnis Ritiņš, released under the MIT license. It shuffles the board by
      making 100 random legal moves from the solved position, which guarantees
      every puzzle it serves you is solvable — a real mercy, because half of all
      random 15-Puzzle arrangements are dead ends. There is no timer and no move
      counter, just the board, a Scramble button and a Solve button.

  howToPlay:
    - step: "Look at the target order."
      detail: >-
        The finished board runs 1 to 4 across the top row, 5 to 8 on the second
        row, 9 to 12 on the third row, and 13, 14, 15 with the empty space on
        the bottom row. That is the picture you are working toward.
    - step: "Move a tile into the empty space."
      detail: >-
        Click or tap any numbered tile that sits directly next to the gap — up,
        down, left or right. The tile slides into the empty space, and the gap
        moves to where that tile was.
    - step: "Repeat, one move at a time."
      detail: >-
        You can never pick up a tile or swap two tiles directly. The empty space
        is your only tool, so every solution is a path you walk with that one
        gap, one click at a time.
    - step: "Finish the last row."
      detail: >-
        The puzzle is solved when the numbers run 1 to 15 in order and the empty
        space sits in the bottom-right corner. A confirmation message then asks
        whether you want to scramble a fresh board.
    - step: "Scramble for a new challenge."
      detail: >-
        Click Scramble to shuffle the board with 100 random legal moves, or
        Solve to reset it to the finished position and start over. Every
        scrambled board is guaranteed solvable.

  controls:
    - action: "Move a tile into the empty space"
      desktop: "Click the tile next to the gap"
      mobile: "Tap the tile next to the gap"
    - action: "Move a tile up"
      desktop: "Click the tile directly below the gap"
      mobile: "Tap the tile directly below the gap"
    - action: "Move a tile down"
      desktop: "Click the tile directly above the gap"
      mobile: "Tap the tile directly above the gap"
    - action: "Move a tile left"
      desktop: "Click the tile directly right of the gap"
      mobile: "Tap the tile directly right of the gap"
    - action: "Move a tile right"
      desktop: "Click the tile directly left of the gap"
      mobile: "Tap the tile directly left of the gap"
    - action: "Move with arrow keys"
      desktop: "Not available — this build is click and touch only"
      mobile: "Not available — use taps"
    - action: "Scramble into a new puzzle"
      desktop: "Click the Scramble button"
      mobile: "Tap the Scramble button"
    - action: "Reset to the solved board"
      desktop: "Click the Solve button"
      mobile: "Tap the Solve button"
    - action: "Undo the last move"
      desktop: "Not available — use Solve to start over, or plan more carefully"
      mobile: "Not available"
    - action: "Fullscreen"
      desktop: "Use your browser's zoom or fullscreen controls"
      mobile: "Use your browser's zoom or fullscreen controls"

  tips:
    - title: "Solve the top row first"
      body: >-
        Start with 1, 2, 3, 4 across the top, left to right. Once a row is
        complete, never touch those tiles again — treat them as fixed furniture.
        Most solvers lock in the first two rows before working on the bottom
        half.
    - title: "Think of the gap as your mover"
      body: >-
        The empty space is not a hole to fill; it is the hand that does all the
        work. Every move slides a tile into it, so plan where you want the gap
        to go next, not just which tile to click.
    - title: "Rotate three tiles to reposition one"
      body: >-
        When a tile is close to its spot but blocked, loop three tiles around
        the gap in a small circle. This classic trick slides one tile into place
        while the other two come back to their own starting positions.
    - title: "Leave the bottom two rows for last"
      body: >-
        Solving the first two rows locks in half the board. For the final rows,
        place 13 first, then work 14 and 15 together as a pair rather than one
        at a time — finishing the last row tile by tile is how solvers get stuck.
    - title: "Move the gap along a path, not randomly"
      body: >-
        Beginners click whichever tile happens to sit near the gap. Strong
        players move the gap along deliberate routes — around a tile, under a
        tile — so each click advances a plan instead of rearranging the mess.
    - title: "If you get stuck, Scramble and start fresh"
      body: >-
        There is no penalty for a new board. Because this version shuffles with
        100 legal moves, every scramble is solvable, so starting over is a
        strategy, not a surrender.

  features:
    - "Classic 15-Puzzle on a 4×4 board with fifteen numbered tiles"
    - "Runs entirely in your browser with no download or plugin"
    - "Guaranteed solvable — every shuffle uses 100 random legal moves"
    - "No timer and no move counter, so you can solve at your own pace"
    - "Works with mouse clicks on desktop and taps on phones and tablets"
    - "Open source under the MIT licence with credit to the original developer"

  faq:
    - q: "What is the 15-Puzzle?"
      a: >-
        The 15-Puzzle is a 4×4 sliding puzzle with fifteen numbered tiles and
        one empty space. The goal is to slide the tiles so the numbers run 1 to
        15 in order, with the empty space in the bottom-right corner.
    - q: "Is every 15-Puzzle arrangement solvable?"
      a: >-
        No. Only half of all arrangements can be solved — the rest are
        mathematically impossible, a quirk known as the parity of the puzzle.
        This version avoids the trap by shuffling with 100 random legal moves
        from the solved board, so every puzzle it gives you is solvable.
    - q: "What is the parity rule in the 15-Puzzle?"
      a: >-
        The parity rule says a board is solvable only when the number of
        inversions and the row position of the empty space match in a specific
        way. The famous 14-15 puzzle, which offered a $1,000 prize in 1891, is
        unsolvable precisely because it breaks this rule.
    - q: "How should I use the empty space?"
      a: >-
        Treat the empty space as your mover, not a hole to fill. Every move
        slides a tile into it, so you control the board by controlling where the
        gap goes. Move the gap next to a tile, then slide the tile in.
    - q: "Is there a timer or a move counter?"
      a: >-
        No. This version has no timer and no move counter — you solve at your
        own pace with no pressure. That makes it a genuinely relaxing puzzle
        rather than a speed test.
    - q: "Is the 15-Puzzle free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free
        to play here with no payment, no sign-up and no premium version.
    - q: "Can I play the 15-Puzzle on my phone?"
      a: >-
        Yes. Tap a tile next to the empty space and it slides into the gap. The
        game works in portrait and landscape on mobile browsers.

info:
  developer: "Arnis Ritiņš"
  released: "2015"
  genre:
    - Puzzle
    - Number
    - Sliding
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 8

license:
  license: MIT
  licenseUrl: "https://github.com/arnisritins/15-Puzzle/blob/master/LICENSE"
  author: "Arnis Ritiņš"
  authorUrl: "https://github.com/arnisritins"
  sourceUrl: "https://github.com/arnisritins/15-Puzzle"
  assetsLicense: "Same as code license — plain HTML/CSS/JavaScript with no third-party assets"
  attributionRendered: "15-Puzzle by Arnis Ritiņš · MIT License"
  verifiedAt: 2026-08-12

ratings:
  count: 0

publishedAt: 2026-08-12
updatedAt: 2026-08-12
---

Fifteen tiles and one empty space have been quietly ruining afternoons since the 1880s,
and the formula still works because it never needed more. The 15-Puzzle rewards patience
over speed — there is no clock, so the only pressure in the room is the one you bring.
Solve the top row, protect what you have built, and let the empty space do the walking.
The rest is just the most satisfying kind of stubbornness.
