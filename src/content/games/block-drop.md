---
title: "Block Drop"
h1: "Play Block Drop Online — Free Falling Block Puzzle"
draft: false

seo:
  title: "Play Block Drop Free — Falling Block Puzzle | SnackArcade"
  description: "Play Block Drop free in your browser. Rotate and stack falling blocks to clear full lines. Full controls, strategy tips and FAQ. No download needed."
  targetKeywords:
    - block drop game
    - falling block puzzle
    - free block stacking game
    - block puzzle no download
    - how to play block drop
  noindexOverride: false

media:
  cover: ../../assets/games/block-drop/cover.png
  coverAlt: "Block Drop playfield with coloured falling blocks stacked into rows"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/block-drop
  entryFile: index.html
  bundleFileCount: 8
  bundleBytes: 21117

taxonomy:
  primaryCategory: arcade
  categories:
    - arcade
    - puzzle
  tags:
    - falling-blocks
    - high-score
    - retro
    - no-download
    - single-player
    - keyboard-only
    - open-source
    - endless
  mechanics:
    - rotation
    - line-clearing
    - stacking

content:
  intro: >-
    Block Drop is the falling-block puzzle in its purest form: a ten-by-twenty well,
    seven block shapes, and one job — fit them together so tightly that a row fills
    completely and disappears. Nothing is hidden from you. Every piece is visible,
    every rule is obvious within ten seconds, and every single loss is entirely your
    own fault. The whole game weighs less than a photograph and starts the instant
    you press Play.

  about:
    - >-
      Block Drop is an open-source falling-block game written by Dionysis Zindros and
      released under the MIT licence. It runs on a plain HTML5 canvas with no engine,
      no framework and no external assets beyond a single sound effect, which is why
      it loads instantly even on a weak connection. This is a community-made original
      implementation, not an official release of any commercial product.
    - >-
      The playfield is ten columns wide and twenty rows deep. Seven shapes drop one at
      a time and you can move them left and right, rotate them, push them down faster
      or slam them straight to the bottom. Fill a horizontal row completely and it
      clears, everything above it falls one row, and you get the space back. The drop
      speed never lets up, so the game is a slow negotiation between the board you want
      and the board you are actually being given.
    - >-
      What makes it hard is not reflexes but debt. Every awkward piece you bury creates
      a hole that cannot be cleared until you remove everything sitting on top of it.
      Beginners lose because the stack gets tall. Experienced players lose because the
      stack gets tall for a reason they created nine pieces ago and never repaid.

  howToPlay:
    - step: "Press Play to start."
      detail: >-
        The board is empty and the first shape appears at the top of the well. There is
        no menu, no difficulty select and no tutorial to sit through first.
    - step: "Move the falling shape."
      detail: >-
        Use the left and right arrow keys to slide the piece across the well, or drag
        sideways with your finger on a touchscreen. Move it before it lands, not after.
    - step: "Rotate it to fit."
      detail: >-
        Press the up arrow key, or tap the board on touch, to turn the shape ninety
        degrees. Rotation is blocked if the new orientation would overlap something.
    - step: "Drop it into place."
      detail: >-
        Hold the down arrow to lower the piece faster, or press the space bar to send it
        straight down and lock it immediately. A flick downwards does the same on touch.
    - step: "Clear complete rows."
      detail: >-
        When a horizontal row is filled from wall to wall it vanishes and everything
        above drops down by one. Clearing rows is the only way to buy back space.
    - step: "Keep the stack low."
      detail: >-
        The game ends when a new shape has no room to enter at the top of the well. Every
        decision you make is really a decision about how tall your stack will be.

  controls:
    - action: "Move left"
      desktop: "Left arrow key"
      mobile: "Drag left across the board"
    - action: "Move right"
      desktop: "Right arrow key"
      mobile: "Drag right across the board"
    - action: "Rotate piece"
      desktop: "Up arrow key"
      mobile: "Tap the board"
    - action: "Soft drop (fall faster)"
      desktop: "Hold the down arrow key"
      mobile: "Drag slowly downwards"
    - action: "Hard drop (instant lock)"
      desktop: "Space bar"
      mobile: "Flick downwards quickly"
    - action: "Start a game"
      desktop: "Click the Play button"
      mobile: "Tap the Play button"
    - action: "Restart after losing"
      desktop: "Click the Play button again"
      mobile: "Tap the Play button again"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Keep the stack flat, not pretty"
      body: >-
        A flat surface accepts every one of the seven shapes. A jagged surface with peaks
        and valleys accepts maybe two of them. Flatness is not an aesthetic preference here,
        it is the single measure of how many of your next pieces will have somewhere to go.
    - title: "Never bury a hole"
      body: >-
        Covering an empty cell costs you every row above it until you dig back down. If you
        are choosing between an awkward surface and a covered hole, always take the awkward
        surface — it is a problem you can still solve on the next piece.
    - title: "Keep one column open, but only one"
      body: >-
        Leaving a single well on the far right gives the long straight piece somewhere useful
        to land and sets up big multi-row clears. Leaving two open columns just means you are
        building two towers instead of one, and neither of them will come down.
    - title: "Use hard drop only when you are certain"
      body: >-
        The space bar locks the piece instantly with no chance to adjust. It is the fastest
        way to play and the fastest way to lose. Use it for pieces going somewhere obvious,
        and let awkward pieces fall naturally so you can still slide them at the last moment.
    - title: "Rotate before you move, not after"
      body: >-
        Decide the final orientation while the piece is still near the top where there is
        room to turn. Rotating a piece that has already descended into a narrow gap usually
        fails silently, and you lose the row you were aiming for.
    - title: "Clear two rows at a time once you are comfortable"
      body: >-
        Single-row clears keep you alive but never get you ahead. Once you can hold a flat
        stack reliably, start setting up double clears — they remove twice the debt for the
        same number of pieces and are the fastest route to a higher score.

  features:
    - "Loads in under a second — the entire game is around 21 KB"
    - "Playable with keyboard on desktop and touch gestures on mobile"
    - "No download, no plugin and no account required"
    - "Open source under the MIT licence with full credit to the developer"
    - "Original community-made game, not a re-release of any commercial title"

  faq:
    - q: "Is Block Drop free to play?"
      a: >-
        Yes, entirely. Block Drop is an open-source game released under the MIT licence and
        it is free to play here with no payment, no trial and no premium version.
    - q: "Do I need to download anything to play?"
      a: >-
        No. Block Drop runs directly in your browser on an HTML5 canvas. There is nothing to
        install, no plugin to enable and no account to create before you play.
    - q: "Can I play Block Drop on a phone?"
      a: >-
        Yes. Drag sideways to move the falling block, tap to rotate it, and flick downwards to
        drop it instantly. The full gesture list is in the controls table above.
    - q: "How do I clear a line in Block Drop?"
      a: >-
        Fill an entire horizontal row from the left wall to the right wall with no gaps. The
        row then disappears and every block above it falls down by one row.
    - q: "Is my high score saved between sessions?"
      a: >-
        Your score is shown during play but is not stored between visits, so closing the tab
        starts you fresh. Nothing about your play is uploaded anywhere.
    - q: "Is Block Drop the same as other falling block games?"
      a: >-
        It follows the same well-known falling-block format but it is an independent
        open-source implementation written from scratch by its developer, and it is not
        affiliated with, endorsed by or derived from any commercial product.

info:
  developer: "Dionysis Zindros"
  released: "2012"
  genre:
    - Arcade
    - Puzzle
  players: SinglePlayer
  technology: "HTML5 Canvas / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 8

license:
  license: MIT
  licenseUrl: "https://github.com/dionyziz/canvas-tetris/blob/master/LICENSE.md"
  author: "Dionysis Zindros"
  authorUrl: "https://github.com/dionyziz"
  sourceUrl: "https://github.com/dionyziz/canvas-tetris"
  assetsLicense: "same as code license"
  attributionRendered: "Block Drop, based on an open-source game by Dionysis Zindros · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Block Drop is the game to open when you have eight minutes and no interest in reading a
tutorial. It asks one question over and over — where does this piece go — and the honest
answer is that you already know. The difficulty comes entirely from how quickly you have
to commit to it.
