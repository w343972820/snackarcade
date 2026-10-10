---
title: "Flip Jumper"
h1: "Play Flip Jumper Online — Free Layer-Flipping Platformer"
draft: false

seo:
  title: "Play Flip Jumper — Free Layer-Flip Platformer | SnackArcade"
  description: "Flip between two layers of platforms, run and jump past the spikes, and reach the star in each of the 25 levels. Free in your browser, keyboard or touch."
  targetKeywords:
    - flip jumper
    - layer flipping platformer
    - free platform game online
    - play platformer no download
    - two layer jumping game
  noindexOverride: false

media:
  cover: ../../assets/games/flip-jumper/cover.png
  coverAlt: "Flip Jumper cover art with the game title in brand orange on a dark slate background"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/flip-jumper
  entryFile: index.html
  bundleFileCount: 22
  bundleBytes: 76708

taxonomy:
  primaryCategory: arcade
  categories:
    - arcade
    - action
  tags:
    - no-download
    - single-player
    - mobile-friendly
    - offline-capable
    - open-source
    - retro
    - no-signup
    - family-friendly
  mechanics:
    - layer-flipping
    - running-jumping
    - gravity
    - level-progression
    - precision-platforming

content:
  intro: >-
    Flip Jumper is a platformer with a twist that fits on one key: the level has two
    complete sets of platforms, an ON layer and an OFF layer, and you can only stand on
    one of them at a time. Press the flip key and every solid platform turns to a ghost
    while the ghosts turn solid underneath your feet. Twenty-five hand-built levels ask
    you to run, jump, flip mid-air and reach the pulsing star without touching the spikes
    in between. It is free, it runs entirely in your browser, and it needs no download and
    no account.

  about:
    - >-
      The whole game hangs on one idea, and it never runs out of uses for it. Each level
      is drawn twice — once on the ON layer, once on the OFF layer — and the layer you are
      not standing on is faded to a ten percent ghost. A platform that blocks your path
      right now might be a doorway the moment you flip, and a gap you are falling through
      can turn solid under your feet if your timing is right. Reading the level means
      reading both layers at once.
    - >-
      Death is free, which is what makes the game so moreish. Spikes point up, down, left
      and right, so the ceiling is as dangerous as the floor, and each level can be
      restarted instantly as many times as you like. The only thing you lose is the number
      in the HUD — the game counts your deaths, and finishing all twenty-five levels with a
      low count is the real high score. Levels are short, so a run is always one more try
      away.
    - >-
      Flip Jumper is a self-hosted copy of an open-source game released under the MIT
      licence, and it is a genuine piece of code golf: the entire game ships in a folder
      of about thirteen kilobytes of code. Every graphic is inline SVG rather than a canvas
      or an image file, every sound effect and the background music are synthesised live
      with the Web Audio API, and nothing in the game talks to the network. It also runs
      offline once the page has loaded.

  howToPlay:
    - step: "Read the two layers."
      detail: >-
        At the start of a level only one set of platforms is solid. The other set is drawn
        faintly as a ghost, so you can always see what is waiting on the other side.
    - step: "Run and jump to the star."
      detail: >-
        Move left and right, hop between platforms, and reach the pulsing star somewhere in
        the level. Touching it clears the level and moves you straight on to the next one.
    - step: "Flip the layers."
      detail: >-
        Press Space, or tap the Flip button, to swap which layer is solid. The layer you
        were standing on becomes a ghost and the ghost layer becomes solid — often in the
        middle of a jump.
    - step: "Mind the spikes."
      detail: >-
        Spikes are attached to the layer they belong to and they point in all four
        directions. Touching an active spike restarts the level, and falling off the bottom
        of the screen does the same.
    - step: "Restart as often as you like."
      detail: >-
        There are no lives and no penalty for dying. The HUD counts your deaths so you can
        chase a clean run, and the level restarts the moment you touch something sharp.
    - step: "Build your own level."
      detail: >-
        The editor on the title menu lets you place platforms and spikes, switch layers and
        play what you just made. Press G to test it and Escape to go back to the menu.

  controls:
    - action: "Move left"
      desktop: "A or the Left arrow key"
      mobile: "Tap the left arrow button"
    - action: "Move right"
      desktop: "D or the Right arrow key"
      mobile: "Tap the right arrow button"
    - action: "Jump"
      desktop: "W or the Up arrow key"
      mobile: "Tap the Jump button"
    - action: "Flip the layer"
      desktop: "Space bar"
      mobile: "Tap the Flip button (the half-filled circle)"
    - action: "Start the game"
      desktop: "Arrow keys to pick START GAME, then Enter"
      mobile: "Tap the Jump button on the title screen"
    - action: "Choose a menu item"
      desktop: "Up and Down arrows"
      mobile: "The left and right buttons move the selection"
    - action: "See the controls screen"
      desktop: "Pick CONTROLS on the title menu"
      mobile: "Pick CONTROLS on the title menu"
    - action: "Open the level editor"
      desktop: "Pick EDITOR on the title menu"
      mobile: "Desktop or laptop only — the editor needs a mouse"
    - action: "Restart a level"
      desktop: "Just die — the level resets itself instantly"
      mobile: "Just die — the level resets itself instantly"
    - action: "Play with a gamepad"
      desktop: "D-pad to move, A to jump, the second button to flip"
      mobile: "A Bluetooth gamepad works the same way"
    - action: "Read the HUD"
      desktop: "The star is your level, the face counts your deaths"
      mobile: "The star is your level, the face counts your deaths"
    - action: "Back to the title screen"
      desktop: "Escape, once a level was opened from a link"
      mobile: "Open the game from the page rather than a link"

  tips:
    - title: "Flip before you land, not after"
      body: >-
        The layer switch is instant, so flipping in mid-air is a landing move: aim for the
        spot where a ghost platform will be, flip while you are above it, and it catches
        you. Trying to flip after you have already fallen past it is always too late.
    - title: "Learn to read the ghost layer"
      body: >-
        The faint platforms are not decoration — they are the route. Before you move, trace
        the ghost layer with your eyes and decide where you would have to flip to use it.
        Most levels are solved by planning the flips, not by fast reflexes.
    - title: "Use the ceiling"
      body: >-
        Spikes hang downwards and platforms cap your jump, so the space above you matters
        as much as the floor. Flipping to a layer whose platform is overhead can trap you,
        while flipping to one with a clear ceiling gives you the full jump height.
    - title: "Chain flips for height"
      body: >-
        Jump, flip and jump again in one motion to climb further than a single layer allows.
        The jump only fires when you are standing on something, so a solid landing is worth
        more than a long arc through the air.
    - title: "Do not rush the spikes"
      body: >-
        Spikes belong to a layer, which means a wall of spikes can be defused rather than
        dodged. If the safe route looks impossible, check whether the spikes are on the
        layer you are standing on — flipping may simply remove them.
    - title: "Chase a clean death count"
      body: >-
        Levels end in a second or two, and the game never punishes a death, so the only
        score you can improve is the number in the HUD. Treat a low death count as your
        personal best and replay the early levels to keep it tidy.

  features:
    - "Twenty-five hand-built levels built around a two-layer flip mechanic"
    - "Instant restarts with a death counter instead of lives"
    - "Keyboard, gamepad and on-screen touch controls on the same input state"
    - "A level editor with layer switching, spikes and instant play-testing"
    - "Inline SVG graphics and Web Audio sound, with zero external requests"
    - "Free and open source under the MIT licence, with credit to the authors"

  faq:
    - q: "Is Flip Jumper free to play?"
      a: >-
        Yes. It is free to play here with no payment, no sign-up and no premium version, and
        it is open source under the MIT licence with the original authors credited on this
        page and in the game folder.
    - q: "How do I flip the layers?"
      a: >-
        Press the Space bar on a keyboard, or tap the half-filled circle button on a touch
        screen. The flip is instant: whatever you were standing on becomes a ghost and the
        ghost layer becomes solid.
    - q: "How many levels are there?"
      a: >-
        Twenty-five. They are hand-built rather than generated, and each one introduces its
        own arrangement of platforms and spikes, so the difficulty climbs steadily to the
        end.
    - q: "Can I play Flip Jumper on my phone?"
      a: >-
        Yes. The game now has on-screen buttons for left, right, jump and flip, and they
        drive exactly the same input as the keyboard. The level editor is desktop only
        because it needs a mouse, but every level is playable by touch.
    - q: "Does it work with a gamepad?"
      a: >-
        Yes. A connected gamepad is read directly: the D-pad moves, the first face button
        jumps and the second button flips the layer. A Bluetooth pad paired to a phone works
        the same way.
    - q: "Does the game save my progress?"
      a: >-
        There is no save file and no progress stored in your browser. Levels are short, the
        death counter resets when you reload, and finishing level twenty-five shows a
        congratulations screen and returns you to the menu.
    - q: "Can I make my own levels?"
      a: >-
        Yes. The EDITOR option on the title screen places platforms and spikes, switches
        layers, and lets you play-test what you have built with a single key. It is the same
        level format the shipped levels use.

info:
  developer: "Daniel Marino and Brad Dunbar"
  released: "2018"
  genre:
    - Platformer
    - Arcade
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 12

license:
  license: MIT
  licenseUrl: "https://github.com/js13kGames/onoff/blob/gh-pages/LICENSE"
  author: "Daniel Marino and Brad Dunbar"
  authorUrl: "https://github.com/starzonmyarmz"
  sourceUrl: "https://github.com/js13kGames/onoff"
  assetsLicense: "same as code license"
  attributionRendered: "Flip Jumper, based on ONOFF by Daniel Marino and Brad Dunbar · MIT License"
  verifiedAt: 2026-08-27

ratings:
  count: 0

publishedAt: 2026-10-10
updatedAt: 2026-10-10
---

Flip Jumper takes the oldest move in platforming — the jump — and asks a question almost no
platformer asks: which floor are you standing on? Every stage is really two stages drawn on
top of each other, and the flip key swaps which one is real. What looks like a dead end
becomes a bridge, and what looks like a bridge becomes a drop.

That single mechanic is squeezed for everything it is worth across twenty-five short levels.
Spikes hang from ceilings and grow from walls as readily as they sit on the ground, so the
safe route is rarely the obvious one, and the HUD's death counter is the only score you can
improve. If you like the idea of a platformer that rewards reading a room rather than
memorising a sprint, start here — and if you would rather solve a maze with your eyes than
your feet, [play Maze](/games/maze/) next, or for something purely reflex-driven try
[Brick Breaker](/games/brick-breaker/) or [Paddle Ball](/games/paddle-ball/).

The whole game is small enough to read in an afternoon: it began life as a js13kGames entry,
which is a competition to fit a complete game into thirteen kilobytes, so there is no engine,
no framework and no asset pipeline. That is also why the graphics are drawn as inline SVG
shapes and the music is generated by the browser's own audio synthesis, and why the game
still plays fine at the end of a train journey with no signal at all.
