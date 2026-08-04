---
# =============================================================================
# Game page template
#
# `npm run new:game` copies this file and fills in the {{PLACEHOLDERS}} for you.
# You can also copy it by hand — just replace every {{...}} before building.
#
# Rules worth knowing before you start:
#   • Every text section below has a minimum length. The build tells you exactly
#     what is short and by how much, so you cannot accidentally publish a thin
#     page that AdSense would reject.
#   • Never use a trademarked game name (Tetris, Wordle, Connect Four, Picross).
#     The build blocks it. Use your own name instead.
#   • Leave `ratings` alone until you genuinely collect ratings from visitors.
# =============================================================================

# Short display name, e.g. "2048". Max 60 characters.
title: "{{TITLE}}"

# The visible headline at the top of the page. 8–90 characters.
# Pattern that works well: Play {Game} Online — Free, No Download
h1: "Play {{TITLE}} Online — Free, No Download"

# Set to true to hide the page from the built site while you finish writing it.
draft: true

seo:
  # 30–60 characters. Google cuts off anything longer.
  title: "Play {{TITLE}} Online Free — No Download | SnackArcade"
  # 120–158 characters. Aim for 140–155.
  description: "{{SEO_DESCRIPTION}}"
  # 1–8 search phrases this page should win.
  targetKeywords:
    - "{{KEYWORD_1}}"
    - "{{KEYWORD_2}}"
  noindexOverride: false

media:
  # Run `npm run gen:covers` to create this automatically if you have no screenshot.
  cover: ../../assets/games/{{SLUG}}/cover.png
  # At least 10 characters. Describe what is actually in the image.
  coverAlt: "{{TITLE}} gameplay screenshot"
  aspectRatio: [16, 9]

source:
  # self_hosted = the game files live in this project under games-src/
  # iframe      = the game is embedded from a partner platform
  sourceType: self_hosted
  bundlePath: games-src/{{SLUG}}
  entryFile: index.html
  # These two are filled in by `npm run new:game`. If you change the game files
  # later, the build tells you the new numbers to put here.
  bundleFileCount: {{BUNDLE_FILE_COUNT}}
  bundleBytes: {{BUNDLE_BYTES}}

taxonomy:
  # Must be one of the files in src/content/categories/
  primaryCategory: {{PRIMARY_CATEGORY}}
  categories:
    - {{PRIMARY_CATEGORY}}
  # 2–10 tags, all of which must already exist in src/content/data/tags.json
  tags:
    - no-download
    - single-player
  mechanics: []

content:
  # At least 60 words. This is the first paragraph a visitor reads.
  intro: >-
    {{INTRO}}

  # 2–4 paragraphs, each at least 80 characters.
  about:
    - >-
      {{ABOUT_1}}
    - >-
      {{ABOUT_2}}

  # 3–6 steps. This section wins the "how to play X" searches.
  howToPlay:
    - step: "{{STEP_1_TITLE}}"
      detail: >-
        {{STEP_1_DETAIL}}
    - step: "{{STEP_2_TITLE}}"
      detail: >-
        {{STEP_2_DETAIL}}
    - step: "{{STEP_3_TITLE}}"
      detail: >-
        {{STEP_3_DETAIL}}

  # 8–15 rows. List every key and gesture, including fullscreen and restart.
  # Write "Not available" in the mobile column if there is no touch equivalent.
  controls:
    - action: "{{ACTION_1}}"
      desktop: "{{DESKTOP_1}}"
      mobile: "{{MOBILE_1}}"
    - action: "{{ACTION_2}}"
      desktop: "{{DESKTOP_2}}"
      mobile: "{{MOBILE_2}}"
    - action: "{{ACTION_3}}"
      desktop: "{{DESKTOP_3}}"
      mobile: "{{MOBILE_3}}"
    - action: "{{ACTION_4}}"
      desktop: "{{DESKTOP_4}}"
      mobile: "{{MOBILE_4}}"
    - action: "{{ACTION_5}}"
      desktop: "{{DESKTOP_5}}"
      mobile: "{{MOBILE_5}}"
    - action: "{{ACTION_6}}"
      desktop: "{{DESKTOP_6}}"
      mobile: "{{MOBILE_6}}"
    - action: "{{ACTION_7}}"
      desktop: "{{DESKTOP_7}}"
      mobile: "{{MOBILE_7}}"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"

  # 5–8 tips, each body at least 30 characters. Write advice that only makes
  # sense for THIS game — reusing tips across pages is treated as spam.
  tips:
    - title: "{{TIP_1_TITLE}}"
      body: >-
        {{TIP_1_BODY}}
    - title: "{{TIP_2_TITLE}}"
      body: >-
        {{TIP_2_BODY}}
    - title: "{{TIP_3_TITLE}}"
      body: >-
        {{TIP_3_BODY}}
    - title: "{{TIP_4_TITLE}}"
      body: >-
        {{TIP_4_BODY}}
    - title: "{{TIP_5_TITLE}}"
      body: >-
        {{TIP_5_BODY}}

  features:
    - "Runs entirely in your browser with no download or plugin"
    - "Free to play with no account required"

  # 5–7 questions. These generate the FAQ structured data Google shows in search.
  faq:
    - q: "Is {{TITLE}} free to play?"
      a: >-
        {{FAQ_1_ANSWER}}
    - q: "Do I need to download or install anything?"
      a: >-
        No. {{TITLE}} runs entirely in your web browser. There is nothing to install, no
        plugin to enable and no account to create before you play.
    - q: "Can I play {{TITLE}} on my phone?"
      a: >-
        {{FAQ_3_ANSWER}}
    - q: "Is my progress saved?"
      a: >-
        {{FAQ_4_ANSWER}}
    - q: "{{FAQ_5_QUESTION}}"
      a: >-
        {{FAQ_5_ANSWER}}

info:
  developer: "{{DEVELOPER}}"
  released: "{{RELEASED}}"
  genre:
    - "{{GENRE}}"
  # Exactly one of: SinglePlayer, MultiPlayer, CoOp
  players: SinglePlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 5

license:
  # Allowed: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, CC0-1.0, CC-BY-4.0,
  #          Unlicense, ISC, Zlib, platform-licensed, author-permission
  # NEVER: GPL, AGPL, or anything with NC or ND in the name.
  license: MIT
  licenseUrl: "{{LICENSE_URL}}"
  author: "{{DEVELOPER}}"
  authorUrl: "{{AUTHOR_URL}}"
  sourceUrl: "{{SOURCE_URL}}"
  assetsLicense: "same as code license"
  attributionRendered: "{{TITLE}} by {{DEVELOPER}} · MIT License"
  # The day you personally opened the LICENSE file and read it.
  verifiedAt: {{TODAY}}

# Leave count at 0 until real visitors have rated the game. Publishing a star
# rating you do not have is structured-data fraud and Google penalises the whole
# site for it, not just this page.
ratings:
  count: 0

publishedAt: {{TODAY}}
updatedAt: {{TODAY}}
---

{{CLOSING_PARAGRAPH}}
