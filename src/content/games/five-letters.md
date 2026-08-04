---
title: "Five Letters"
h1: "Play Five Letters Online — Free Word Guessing Game"
draft: false

seo:
  title: "Play Five Letters Free — Word Guessing Game | SnackArcade"
  description: "Play Five Letters free in your browser. Guess the hidden five-letter word in six tries using colour clues. Full rules, strategy tips and FAQ. No download."
  targetKeywords:
    - five letter word game
    - word guessing game
    - guess the word game free
    - five letters online
    - how to play five letters
  noindexOverride: false

media:
  cover: ../../assets/games/five-letters/cover.png
  coverAlt: "Five Letters word game grid with green and yellow letter tiles"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/five-letters
  entryFile: index.html
  bundleFileCount: 6
  bundleBytes: 379531

taxonomy:
  primaryCategory: word
  categories:
    - word
    - puzzle
  tags:
    - word-guessing
    - logic
    - daily-puzzle
    - no-download
    - single-player
    - mobile-friendly
    - open-source
    - brain-training
  mechanics:
    - deduction
    - letter-elimination
    - colour-feedback

content:
  intro: >-
    Five Letters gives you six attempts to work out a hidden five-letter word. Type any
    real word, press Enter, and each letter turns green, yellow or grey — green means
    right letter in the right place, yellow means right letter in the wrong place, grey
    means the letter is not in the word at all. That is the entire rule set. Everything
    else about this game is you, sitting there, refusing to accept that you have wasted
    three guesses on words starting with S.

  about:
    - >-
      Five Letters is an open-source word game written by Web Dev Simplified and released
      under the MIT licence. It is a clean, self-contained implementation of the guess-the-word
      format, with its own word list bundled locally so the game works even if your connection
      drops after the page has loaded. It is an independent community project and is not
      affiliated with any commercial word game.
    - >-
      The appeal is that it is a pure information game. There is no vocabulary flex involved
      — the answer is almost always a common word — and there is no time pressure. What the
      game actually measures is whether you use your guesses to gather information or to
      chase hunches. Those are very different strategies and they produce very different
      average scores.
    - >-
      A game takes two to five minutes and there is exactly one puzzle available at a time,
      which is part of why the format works. You cannot grind it. You get your six attempts,
      you either find the word or you do not, and the result stays with you slightly longer
      than it reasonably should.

  howToPlay:
    - step: "Type any five-letter word."
      detail: >-
        Use your keyboard or the on-screen keyboard below the grid. Your first guess does not
        need to be clever, but it should contain five different letters.
    - step: "Press Enter to submit."
      detail: >-
        The word must be in the game's dictionary. If it is not recognised the grid shakes and
        the guess is rejected without costing you an attempt.
    - step: "Read the colours."
      detail: >-
        Green means that letter is in the word and in exactly that position. Yellow means the
        letter is in the word but somewhere else. Grey means it is not in the word at all.
    - step: "Use what you learned."
      detail: >-
        Every colour is a constraint on the answer. Your next guess should respect all of them
        — keep green letters where they are and move yellow letters somewhere new.
    - step: "Solve it within six guesses."
      detail: >-
        Turn every tile green before you run out of rows. If you fail, the game reveals the
        answer so at least you find out what you were missing.

  controls:
    - action: "Type a letter"
      desktop: "Any letter key A to Z"
      mobile: "Tap a letter on the on-screen keyboard"
    - action: "Delete last letter"
      desktop: "Backspace key"
      mobile: "Tap the backspace key on the on-screen keyboard"
    - action: "Submit your guess"
      desktop: "Enter key"
      mobile: "Tap the Enter key on the on-screen keyboard"
    - action: "See which letters are ruled out"
      desktop: "Read the colour of each key on the on-screen keyboard"
      mobile: "Read the colour of each key on the on-screen keyboard"
    - action: "Start a new word"
      desktop: "Reload the page"
      mobile: "Reload the page"
    - action: "Reveal the answer"
      desktop: "Use your final guess — the answer is shown if you lose"
      mobile: "Use your final guess — the answer is shown if you lose"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Spend your first guess on five different letters"
      body: >-
        A word with a repeated letter wastes a slot. Openers such as CRANE, SLATE or AUDIO test
        five separate letters at once and will usually return at least one colour, which is the
        whole purpose of guess number one.
    - title: "Cover vowels early, but not all of them"
      body: >-
        Two vowels in your first guess is the sweet spot. Three or more crowds out the consonants
        that actually separate candidate words, and English has far more consonant patterns to
        eliminate than vowel patterns.
    - title: "Yellow means move it, not remove it"
      body: >-
        The most common mistake is putting a yellow letter back in the same position out of habit.
        A yellow tile has already told you that position is wrong, so re-testing it throws away
        one fifth of your next guess for no information at all.
    - title: "When stuck, guess a word you know is wrong"
      body: >-
        If you have four green letters and five possible endings, do not guess them one at a time.
        Play a word that tests several of those candidate letters simultaneously, even though it
        cannot be the answer. One sacrificed guess beats three failed ones.
    - title: "Watch for double letters late"
      body: >-
        Words such as ABBEY, SPOON and TRUSS break the assumption that all five letters differ.
        If you have eliminated most of the alphabet and nothing fits, a repeated letter is very
        often the reason your candidate list looks empty.
    - title: "Read the keyboard, not just the grid"
      body: >-
        The on-screen keyboard greys out letters you have already ruled out. Glancing at it before
        each guess prevents the single most frustrating way to lose a game, which is submitting a
        word containing a letter you personally eliminated two turns ago.

  features:
    - "Six attempts to find the hidden five-letter word"
    - "Colour feedback on every letter after each guess"
    - "On-screen keyboard that tracks which letters are ruled out"
    - "Word list bundled locally so play continues without a connection"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Five Letters free to play?"
      a: >-
        Yes. Five Letters is open source under the MIT licence and free to play here with no
        payment, no sign-up and no premium tier of any kind.
    - q: "How many guesses do I get?"
      a: >-
        Six. Each guess must be a real five-letter word from the game's dictionary, and invalid
        words are rejected without using up one of your attempts.
    - q: "What do the colours mean?"
      a: >-
        Green means the letter is correct and in the right position. Yellow means the letter is in
        the word but in a different position. Grey means the letter does not appear in the word.
    - q: "Can I play Five Letters on my phone?"
      a: >-
        Yes. The game includes a full on-screen keyboard, so no physical keyboard is needed and it
        works normally in portrait mode on both iOS and Android.
    - q: "Why was my word rejected?"
      a: >-
        The guess must appear in the game's bundled dictionary of common English words. Proper
        nouns, abbreviations and very obscure words are not included, so a valid English word can
        still be refused.
    - q: "Is there a new word every day?"
      a: >-
        The game selects a word for the current puzzle and reloading the page starts a new one, so
        you are not limited to a single attempt per day.
    - q: "Is this the same as other word guessing games?"
      a: >-
        It uses the same widely-used six-guess colour-feedback format but it is an independent
        open-source implementation with its own word list, and it is not affiliated with or endorsed
        by any commercial word game.

info:
  developer: "Web Dev Simplified"
  released: "2022"
  genre:
    - Word
    - Puzzle
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 4

license:
  license: MIT
  licenseUrl: "https://github.com/WebDevSimplified/wordle-clone/blob/main/LICENSE"
  author: "Web Dev Simplified (Kyle Cook)"
  authorUrl: "https://github.com/WebDevSimplified"
  sourceUrl: "https://github.com/WebDevSimplified/wordle-clone"
  assetsLicense: "same as code license"
  attributionRendered: "Five Letters, based on an open-source game by Web Dev Simplified · MIT License"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Five Letters is the rare game where thinking longer genuinely helps. There is no clock and no
penalty for staring at the grid, so the players who do best are simply the ones who check their
next guess against every clue already on the board before pressing Enter.
