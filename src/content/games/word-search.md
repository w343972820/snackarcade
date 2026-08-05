---
title: "Word Search"
h1: "Play Word Search Online — Free Word Puzzle"
draft: false

seo:
  title: "Play Word Search Free — Word Puzzle | SnackArcade"
  description: "Play Word Search free in your browser. Find and highlight every hidden word in the letter grid. Full rules, search tips and FAQ. No download needed."
  targetKeywords:
    - word search game
    - word search online free
    - find the words puzzle
    - word search browser
    - how to play word search
  noindexOverride: false

media:
  cover: ../../assets/games/word-search/cover.png
  coverAlt: "Word Search letter grid with several words highlighted in different directions"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/word-search
  entryFile: index.html
  bundleFileCount: 12
  bundleBytes: 50106

taxonomy:
  primaryCategory: word
  categories:
    - word
  tags:
    - single-player
    - no-download
    - mobile-friendly
    - relaxing
    - brain-training
    - family-friendly
    - open-source
    - no-signup
  mechanics:
    - word-finding
    - scanning
    - pattern-recognition

content:
  intro: >-
    Word Search is the classic letter-grid puzzle where a list of words is hidden in a
    jumble of letters — horizontally, vertically or diagonally, forwards or backwards. Your
    job is to find them all and highlight each one. It is a calm, satisfying word game that
    trains scanning and pattern recognition, and it is enjoyed by everyone from children
    learning to spell to adults unwinding after work. Play it free in your browser with no
    download and no account.

  about:
    - >-
      Word search puzzles have appeared in newspapers, classrooms and puzzle books for
      decades because they are simple to explain and quietly addictive. The grid hides every
      word from the list, and finding each one is a small victory of pattern recognition.
      Because the words can run in any direction, the same grid can be solved at many
      difficulty levels.
    - >-
      The skill in word search is visual scanning. Good solvers do not read the grid letter
      by letter — they look for the first letter of a target word, then check the
      surrounding letters for the rest of the word in every direction. The more you practise,
      the faster your eyes learn to spot those starting letters.
    - >-
      This version is based on an open-source word search game by Li Zhi Neng, released
      under the MIT licence. It runs entirely in your browser with mouse controls on desktop
      and touch controls on mobile, and it generates fresh puzzles so the game never runs
      out. No download, no sign-up and no waiting.

  howToPlay:
    - step: "Read the word list."
      detail: >-
        The words you need to find are listed next to the grid. Each word appears exactly
        once somewhere in the letters.
    - step: "Scan for the first letter."
      detail: >-
        Look for the first letter of a target word anywhere in the grid. Once you spot it,
        check the letters around it in every direction — across, down, diagonally, forwards
        or backwards.
    - step: "Highlight a found word."
      detail: >-
        When you find a word, select its first and last letters to highlight it. A correct
        find marks the word off the list.
    - step: "Find every word."
      detail: >-
        Keep scanning until every word on the list is highlighted. The puzzle is complete
        when the whole list is crossed off.
    - step: "Start a new puzzle."
      detail: >-
        Generate a fresh grid for a new challenge. Every puzzle is different, so the game
        stays fresh each time.

  controls:
    - action: "Highlight a word"
      desktop: "Click the first letter, then click the last letter"
      mobile: "Tap the first letter, then tap the last letter"
    - action: "Drag to highlight"
      desktop: "Alternatively, drag across the word from start to end"
      mobile: "Alternatively, drag across the word from start to end"
    - action: "See the word list"
      desktop: "The target words are shown beside the grid"
      mobile: "The target words are shown beside the grid"
    - action: "See how many words remain"
      desktop: "The unchecked words show what is left to find"
      mobile: "The unchecked words show what is left to find"
    - action: "Restart the current puzzle"
      desktop: "Click the Restart button"
      mobile: "Tap the Restart button"
    - action: "Generate a new puzzle"
      desktop: "Click the New Puzzle button"
      mobile: "Tap the New Puzzle button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the grid"
      mobile: "Tap the fullscreen button above the grid"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Start with the longest words"
      body: >-
        Long words have fewer possible starting positions, so they are the easiest to find.
        Clearing them early also removes a big chunk of the grid from the search.
    - title: "Look for the first letter everywhere"
      body: >-
        Do not read the grid like text. Let your eyes jump across the board looking for the
        first letter of your target word, then check the surrounding letters in all eight
        directions.
    - title: "Check backwards as well as forwards"
      body: >-
        Words can run right to left and bottom to top. If you cannot find a word reading
        forward, search for its first letter and check the reverse direction too.
    - title: "Work one word at a time"
      body: >-
        Trying to find all the words at once scrambles your focus. Pick one word, find it,
        highlight it, then move to the next. The grid gets easier as the list empties.
    - title: "Use the corners of the grid"
      body: >-
        Words near the edges and corners have fewer possible orientations, which makes them
        easier to spot. Scan the borders first to clear the grid quickly.
    - title: "Take a breath when you are stuck"
      body: >-
        Word search is about calm scanning, not speed. If you cannot find a word, look away
        for a few seconds and come back — your pattern recognition resets and the word often
        jumps out.

  features:
    - "Classic word search with freshly generated puzzles"
    - "Runs entirely in your browser with no download or plugin"
    - "Mouse controls on desktop and touch controls on mobile"
    - "Relaxing, no-timer gameplay for all ages"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Word Search free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I highlight a word?"
      a: >-
        Click or tap the first letter of the word, then click or tap the last letter. The
        word is highlighted and marked off the list if you found it correctly.
    - q: "In which directions can words run?"
      a: >-
        Words can run horizontally, vertically or diagonally, and forwards or backwards. Any
        straight line of letters can hide a word.
    - q: "Can I play Word Search on my phone?"
      a: >-
        Yes. Tap the first letter and tap the last letter to highlight a word. The game works
        in portrait and landscape on mobile browsers.
    - q: "Are the puzzles always different?"
      a: >-
        Yes. Each puzzle is generated fresh, so the grid and word list change every time you
        start a new game.
    - q: "Is Word Search good for children?"
      a: >-
        Yes. Word search is a popular classroom activity that builds spelling and pattern
        recognition, and this version is family-friendly with no timers or fail states.

info:
  developer: "Li Zhi Neng"
  released: "2013"
  genre:
    - Word
    - Puzzle
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 8

license:
  license: MIT
  licenseUrl: "https://github.com/lizhineng/word-search-game/blob/master/LICENSE"
  author: "Li Zhi Neng"
  authorUrl: "https://github.com/lizhineng"
  sourceUrl: "https://github.com/lizhineng/word-search-game"
  assetsLicense: "same as code license"
  attributionRendered: "Word Search, based on an open-source game by Li Zhi Neng · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-06
updatedAt: 2026-08-06
---

Word Search is the quietest puzzle on the site and one of the most satisfying. There is no
clock, no score to lose and no way to fail — just a grid of letters and the calm pleasure
of spotting a word that was hiding in plain sight.
