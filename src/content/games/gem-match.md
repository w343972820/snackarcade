---
title: "Gem Match"
h1: "Play Gem Match Online — Free Match-3 Puzzle"
draft: false

seo:
  title: "Play Gem Match Free — Match-3 Puzzle | SnackArcade"
  description: "Play Gem Match free in your browser. Swap adjacent gems to line up three or more and score chain reactions. Full controls, tips and FAQ. No download."
  targetKeywords:
    - gem match game
    - match 3 game online
    - gem puzzle free
    - match three game
    - how to play gem match
  noindexOverride: false

media:
  cover: ../../assets/games/gem-match/cover.png
  coverAlt: "Gem Match board with a grid of colourful gems and a highlighted match of three"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/gem-match
  entryFile: index.html
  bundleFileCount: 4
  bundleBytes: 46012

taxonomy:
  primaryCategory: puzzle
  categories:
    - puzzle
  tags:
    - logic
    - single-player
    - no-download
    - mobile-friendly
    - high-score
    - brain-training
    - open-source
    - no-signup
  mechanics:
    - swapping
    - matching
    - chain-reactions

content:
  intro: >-
    Gem Match is the match-3 puzzle in its cleanest form: a board full of colourful gems,
    and one move you are allowed to make — swap two adjacent gems to line up three or more
    of the same colour. Every match clears the gems and scores points, new gems fall from
    the top, and chain reactions can send your score soaring. The rules are obvious in ten
    seconds, the puzzle depth lasts for hours, and it runs free in your browser with no
    download and no account.

  about:
    - >-
      The match-3 format became the most popular casual puzzle genre in the world because it
      is instantly readable: swap, match, clear, repeat. Underneath that simple loop is a
      real puzzle. Every swap is a decision about the whole board, because a single match
      can cascade into a chain reaction that clears far more than three gems.
    - >-
      The skill in Gem Match is not speed — it is planning. You want to line up matches that
      leave the board in a good state, not just any match you can see. Setting up a cascade
      means placing two gems so that a third arrives to complete the match, and the best
      players read the falling gems a few moves ahead.
    - >-
      This version is based on an open-source match-3 game by rembound, released under the
      MIT licence. It runs entirely in your browser with mouse controls on desktop and touch
      controls on mobile, and it is as close to the classic match-3 loop as a browser game
      can be. No download, no sign-up and no waiting.

  howToPlay:
    - step: "Look for a match."
      detail: >-
        Scan the board for three or more gems of the same colour sitting in a line —
        horizontally or vertically. These are the matches you can complete.
    - step: "Swap two adjacent gems."
      detail: >-
        Select a gem and swap it with a neighbour. If the swap creates a match of three or
        more, the matched gems clear; if not, the swap is reversed.
    - step: "Clear matched gems."
      detail: >-
        Every matched group disappears from the board and adds to your score. Gems above the
        cleared space fall down to fill the gaps.
    - step: "Trigger chain reactions."
      detail: >-
        When gems fall into new positions, they can create fresh matches automatically.
        These cascades clear more gems and multiply your score.
    - step: "Keep the board alive."
      detail: >-
        The game continues as long as matches are available. When no match is possible, the
        board reshuffles or the round ends, depending on the mode you chose.

  controls:
    - action: "Select a gem"
      desktop: "Click a gem"
      mobile: "Tap a gem"
    - action: "Swap with a neighbour"
      desktop: "Click the adjacent gem to swap with"
      mobile: "Tap the adjacent gem to swap with"
    - action: "See possible matches"
      desktop: "Look for three of the same colour in a line"
      mobile: "Look for three of the same colour in a line"
    - action: "See your score"
      desktop: "The score is shown next to the board"
      mobile: "The score is shown next to the board"
    - action: "Undo last swap"
      desktop: "Click the Undo button, if available"
      mobile: "Tap the Undo button, if available"
    - action: "Restart the board"
      desktop: "Click the Restart button"
      mobile: "Tap the Restart button"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Plan the cascade, not the match"
      body: >-
        A single three-match is worth little. Look for swaps that will make the falling gems
        complete another match automatically — those cascades are where the real score lives.
    - title: "Scan the bottom rows first"
      body: >-
        Matches in the lower rows affect the whole board above them, because every cleared
        gem makes the columns above fall. Solving from the bottom up creates the most
        cascades.
    - title: "Do not waste a good board position"
      body: >-
        If a gem is one swap away from completing a match, leave it until you can make that
        swap count. Rushing to clear any visible match can destroy a cascade you were about
        to set up.
    - title: "Watch the board after every fall"
      body: >-
        Gems landing from above often create new matches on their own. After each move, look
        for the cascades already in motion before you plan your next swap.
    - title: "Clear the gems you cannot use"
      body: >-
        Gems that sit on the edge and never match are dead weight. Removing them early keeps
        the board flexible and opens up space for better swaps.
    - title: "Keep the board balanced"
      body: >-
        Avoid piling one colour in a single corner. A balanced board gives you matches in
        every direction, while a lopsided board leaves you hunting for a single swap.

  features:
    - "Classic match-3 gameplay with cascading chain reactions"
    - "Runs entirely in your browser with no download or plugin"
    - "Mouse controls on desktop and touch controls on mobile"
    - "Quick sessions that fit a short break"
    - "Open source under the MIT licence with credit to the developer"

  faq:
    - q: "Is Gem Match free to play?"
      a: >-
        Yes, completely. The game is open source under the MIT licence and free to play here
        with no payment, no trial and no premium version.
    - q: "How do I make a match?"
      a: >-
        Swap two adjacent gems so that three or more of the same colour line up horizontally
        or vertically. The matched gems then clear and score points.
    - q: "What happens when I swap but no match forms?"
      a: >-
        The swap is reversed and the board stays the same, so you can keep trying without
        losing anything. Only a successful match changes the board.
    - q: "Can I play Gem Match on my phone?"
      a: >-
        Yes. Tap a gem and tap an adjacent gem to swap. The game works in portrait and
        landscape on mobile browsers.
    - q: "What is a chain reaction?"
      a: >-
        When cleared gems are replaced by gems falling from above, the new gems can form
        another match automatically. These cascades clear extra gems and multiply your score.
    - q: "How do I get a high score?"
      a: >-
        Set up cascades by solving from the bottom rows and planning swaps so that falling
        gems create additional matches. Chain reactions are the fastest way to a high score.

info:
  developer: "Rembound (Remy)"
  released: "2015"
  genre:
    - Puzzle
    - Match-3
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 7

license:
  license: MIT
  licenseUrl: "https://github.com/rembound/Match-3-Game-HTML5/blob/master/LICENSE"
  author: "Rembound (Remy)"
  authorUrl: "https://github.com/rembound"
  sourceUrl: "https://github.com/rembound/Match-3-Game-HTML5"
  assetsLicense: "same as code license"
  attributionRendered: "Gem Match, based on an open-source match-3 game by rembound · MIT License"
  verifiedAt: 2026-08-05

ratings:
  count: 0

publishedAt: 2026-08-05
updatedAt: 2026-08-05
---

Gem Match is a puzzle that rewards the player who thinks one move ahead of the falling
gems. The board is always telling you where the next match is hiding — the skill is
learning to see the chain reaction before it happens.
