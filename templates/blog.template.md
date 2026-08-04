---
# =============================================================================
# Blog post template (hand-written)
#
# Copy this file to src/content/blog/{slug}.md and fill in the {{PLACEHOLDERS}}.
# The file name becomes the URL: how-to-play-2048.md → /blog/how-to-play-2048/
#
# Rules the build enforces (validate-content.mjs, fail = build stops):
#   • Body must be at least 600 words of original English.
#   • At least 2 links back into the game catalogue, written as
#     [Play 2048](/games/2048/) — always with the trailing slash.
#   • relatedGameSlugs must point at real games (2048 / block-drop / five-letters).
#   • author must be "SnackArcade Team".
#   • Never use a trademarked game name (Tetris, Wordle, Connect Four, Picross).
#     The build blocks it. Use the site's own names: Block Drop, Five Letters.
#   • seo.title must be 15–60 characters; seo.description 70–158 characters.
# =============================================================================

# Short, specific headline. Keep it different from every other post on the site —
# Google treats near-identical titles across pages as duplicate content.
title: "{{TITLE}}"

seo:
  # 15–60 characters. Google cuts off anything longer. A readable pattern is
  # "{Keyword Phrase} | SnackArcade".
  title: "{{SEO_TITLE}}"
  # 70–158 characters. Say what the reader will learn and why it matters.
  description: "{{SEO_DESCRIPTION}}"

# Slugs of games this post links to. They render as a "Related Games" block.
# Must already exist in src/content/games/. Example: ["2048", "block-drop"]
relatedGameSlugs:
  - {{RELATED_SLUG}}

# Site-wide byline. Do not change to a personal name without updating the
# site-wide convention first (E-E-A-T decision belongs to the site owner).
author: "SnackArcade Team"

# false = publish. True = hide from /blog/ and the sitemap until you finish it.
# Auto-generated files (named auto-*.md) are forced to true by the build.
draft: false

# YYYY-MM-DD. Use the day you finish writing. Bump updatedAt whenever you
# meaningfully edit the post later — the page shows both dates.
publishedAt: {{TODAY}}
updatedAt: {{TODAY}}
---

# {{TITLE}}

{{INTRO_PARAGRAPH — 60–100 words. Open with the reader's question and tell them
what this post answers. Link to the relevant game early:
[Play 2048](/games/2048/) is a good anchor for the first mention.}}

## {{H2_SECTION_1}}

{{3–5 paragraphs per section. Write real guidance a reader can act on:
specific moves, order of operations, what to look for. Generic filler such as
"play carefully" is treated as thin content.}}

## {{H2_SECTION_2}}

{{…}}

## {{H2_SECTION_3}}

{{… — at least one more link to a game page somewhere in the body so the post
has two or more /games/{slug}/ links total.}}

## {{CLOSING_SECTION — "Try It Now" works well}}

{{Close by telling the reader exactly what to do next: which game to open and
what one thing to try. Link the game again.}}
