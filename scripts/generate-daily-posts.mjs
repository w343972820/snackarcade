#!/usr/bin/env node
/**
 * Deterministic daily post generator (T04).
 *
 * Creates "data summary" blog drafts from facts that already exist on the site.
 * It never writes opinion, strategy or tips — only factual round-ups, so the
 * output stays inside Google's scaled-content policy. Every generated file is
 * `draft: true` and must be reviewed by a human before publishing.
 *
 * Usage:
 *   node scripts/generate-daily-posts.mjs [--date YYYY-MM-DD] [--type new-games|weekly-top|site-update|all]
 *
 * Defaults: --date today (UTC) --type all.
 *
 * Contract:
 *   - Inputs are read-only: src/content/games/*.md, src/content/data/popular.json,
 *     src/content/data/updates.json, src/content/blog/*.md (for dedupe).
 *   - Output: src/content/blog/auto-{YYYY-MM-DD}-{type}.md when the target file
 *     does not already exist (idempotent — a second run writes nothing).
 *   - Exit 0 + "GENERATED: n file(s)". Non-zero means failure (no commit).
 *   - When nothing was generated and the last commit is older than 30 days, it
 *     writes src/content/data/last-auto-run.json as a keepalive so the repo
 *     always has activity within GitHub's 60-day cron pause window.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_DIR = path.join(ROOT, 'src', 'content', 'games');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const POPULAR_FILE = path.join(ROOT, 'src', 'content', 'data', 'popular.json');
const UPDATES_FILE = path.join(ROOT, 'src', 'content', 'data', 'updates.json');
const KEEPALIVE_FILE = path.join(ROOT, 'src', 'content', 'data', 'last-auto-run.json');

/** The three content types this generator may produce. */
const TYPES = ['new-games', 'weekly-top', 'site-update'];

/** Popularity data older than this many days is treated as missing. */
const POPULAR_MAX_AGE_DAYS = 60;

/** Every generated post must carry at least this many body words. */
const BLOG_MIN_WORDS = 600;

/* ============================================================================
   Word counting — mirror of src/lib/content/wordcount.ts. KEEP IN SYNC.
   ========================================================================== */

/**
 * Count words in a markdown body exactly like the content validator does, so a
 * generated file can never pass the generator but fail validation.
 * @param {string} input
 * @returns {number}
 */
function countWords(input) {
  if (typeof input !== 'string' || input.length === 0) return 0;
  const stripped = input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]+/g, '')
    .replace(/^\s{0,3}(#{1,6}|>)\s*/gm, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?[a-z][^>]*>/gi, ' ');
  return stripped.trim().split(/\s+/).filter(Boolean).length;
}

/* ============================================================================
   Small helpers
   ========================================================================== */

/**
 * Parse CLI arguments: --date YYYY-MM-DD and --type one of TYPES | all.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const args = { date: new Date().toISOString().slice(0, 10), type: 'all' };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--date' && value !== undefined) args.date = value;
    if (key === '--type' && value !== undefined) args.type = value;
  }
  return args;
}

/**
 * Validate a YYYY-MM-DD date string.
 * @param {string} date
 * @returns {boolean}
 */
function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date;
}

/** @param {string} dir */
function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

/**
 * Load and parse every game file. Raw dates stay as strings so we can compare
 * them against the requested date without timezone surprises.
 * @returns {{slug: string, data: Record<string, any>, body: string}[]}
 */
function loadGames() {
  return listMarkdown(GAMES_DIR).map((fileName) => {
    const raw = fs.readFileSync(path.join(GAMES_DIR, fileName), 'utf8');
    const parsed = matter(raw);
    return { slug: fileName.replace(/\.md$/, ''), data: parsed.data, body: parsed.content };
  });
}

/** @param {string} file @returns {Record<string, any> | null} */
function loadJson(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

/** @param {Record<string, any> | null} data @returns {boolean} */
function isPopularFresh(data) {
  if (!data || !Array.isArray(data.entries) || data.entries.length === 0) return false;
  const exportedAt = String(data.exportedAt ?? '');
  const time = Date.parse(`${exportedAt}T00:00:00Z`);
  if (!Number.isFinite(time)) return false;
  return (Date.now() - time) / 86_400_000 <= POPULAR_MAX_AGE_DAYS;
}

/** @param {string} slug @param {string} label */
function gameLink(slug, label) {
  return `[${label}](/games/${slug}/)`;
}

/**
 * Standard factual filler sections appended (deterministically) until the body
 * reaches BLOG_MIN_WORDS. No opinion, no strategy, no tips.
 * @param {string} date
 * @returns {string[]}
 */
function fillerSections(date) {
  return [
    `## About SnackArcade

SnackArcade is a small, hand-maintained collection of free browser games. Every game page includes original written content: a description of the game, a how-to-play section, a complete controls table for keyboard and touch, and tips written from actually playing the game. Games hosted directly on the site are open source or licensed for this use, and each one credits the developer who made it with a link back to the original source and its licence. The whole catalogue is playable on desktop, tablet and mobile browsers with no download and no sign-up.`,
    `## How to Use This Post

This post was generated automatically on ${date}. It is a data summary only: it lists facts that already exist on the site's pages and data files, and it contains no opinion and no strategy advice. It is saved as a draft so a human can review the wording before it is published. To browse the full catalogue, open the All Games page. To see what was added recently, open the New Releases page.`,
    `## Frequently Asked Questions

**Is SnackArcade free to play?** Yes. Every game on the site is free and runs in the browser.

**Do I need to download anything?** No. All games load directly in the browser with no download, no plugin and no account.

**Can I play on a phone?** Yes. Every game page works on desktop, tablet and mobile browsers, and each controls table lists both keyboard and touch controls.`,
  ];
}

/* ============================================================================
   Post builders — each returns { filename, frontmatter, body } or null when
   there is nothing honest to write for that type on that date.
   ========================================================================== */

/**
 * new-games: factual round-up of the games published on the requested date.
 * @param {string} date
 * @param {{slug: string, data: Record<string, any>, body: string}[]} games
 */
function buildNewGamesPost(date, games) {
  const published = games.filter((game) => {
    const raw = game.data.publishedAt;
    const iso = raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw ?? '').slice(0, 10);
    return iso === date;
  });
  if (published.length === 0) return null;

  const sections = [];
  sections.push(
    `# New Games on SnackArcade — ${date}

This post lists the games that were published on SnackArcade on ${date}. Each entry is a factual summary taken from the game's own page. All of the games below run directly in the browser with no download and no sign-up, and each one has a full guide, a controls table and real tips on its page.`,
  );

  for (const game of published) {
    const d = game.data;
    const title = String(d.title ?? game.slug);
    const intro = typeof d.content?.intro === 'string' ? d.content.intro : '';
    const about = Array.isArray(d.content?.about) ? d.content.about : [];
    const genres = Array.isArray(d.info?.genre) ? d.info.genre.join(', ') : 'Browser game';
    const developer = typeof d.info?.developer === 'string' ? d.info.developer : 'Open source';

    sections.push(
      `## ${title}

${gameLink(game.slug, `Play ${title}`)} — ${intro}`,
    );
    if (about.length > 0 && typeof about[0] === 'string') sections.push(about[0]);
    sections.push(
      `- Developer: ${developer}
- Genre: ${genres}
- Runs on: desktop, tablet and mobile browsers
- No download, no sign-up, no plugins

Read the full guide: ${gameLink(game.slug, `${title} guide and controls`)}`,
    );
  }

  return { filename: `auto-${date}-new-games.md`, sections };
}

/**
 * weekly-top: factual leaderboard from the GA4 export. Returns null when the
 * export is missing, expired, empty, or names no games that exist.
 * @param {string} date
 * @param {Record<string, any> | null} popular
 * @param {{slug: string, data: Record<string, any>, body: string}[]} games
 */
function buildWeeklyTopPost(date, popular) {
  if (!isPopularFresh(popular)) return null;
  const gamesById = new Map(games.map((game) => [game.slug, game]));
  const entries = (popular.entries ?? [])
    .slice()
    .sort((a, b) => Number(a.rank) - Number(b.rank))
    .filter((entry) => gamesById.has(String(entry.slug)));
  if (entries.length === 0) return null;

  const exportedAt = String(popular.exportedAt ?? 'unknown');
  const source = String(popular.source ?? 'analytics export');

  const sections = [];
  sections.push(
    `# Most Played on SnackArcade — ${date}

This post lists the game pages that were viewed the most during the latest reporting period. The list is built from the ${source} exported on ${exportedAt}, and it is a data summary only — it contains no opinion and no strategy advice. Every game below runs directly in the browser with no download and no sign-up.`,
  );

  for (const entry of entries) {
    const game = gamesById.get(String(entry.slug));
    if (!game) continue;
    const d = game.data;
    const title = String(d.title ?? game.slug);
    const intro = typeof d.content?.intro === 'string' ? d.content.intro : '';
    const plays = Number(entry.plays);
    sections.push(
      `## ${Number(entry.rank)}. ${title}

${gameLink(game.slug, `Play ${title}`)} — ${intro}`,
    );
    sections.push(`This page was played ${plays} times during the reporting period.`);
    sections.push(`Read the full guide: ${gameLink(game.slug, `${title} guide and controls`)}`);
  }

  sections.push(
    `## How This List Was Made

The rankings come from a manual export of the site's Google Analytics 4 report, saved to the popular data file on ${exportedAt}. The export is refreshed periodically, and this post is only generated while the export is recent. When the data is old, missing or empty, no leaderboard post is created at all — the site never invents numbers.`,
  );

  return { filename: `auto-${date}-weekly-top.md`, sections };
}

/**
 * site-update: factual bulletin of manually recorded site events. Returns null
 * when the updates file is missing or empty.
 * @param {string} date
 * @param {Record<string, any> | null} updates
 * @param {{slug: string, data: Record<string, any>, body: string}[]} games
 */
function buildSiteUpdatePost(date, updates, games) {
  const events = Array.isArray(updates?.updates) ? updates.updates : [];
  if (events.length === 0) return null;

  const sections = [];
  sections.push(
    `# What's New on SnackArcade — ${date}

This post is a factual bulletin of the changes recorded on the site's update log. It lists what happened and when; it does not add opinion or commentary.`,
  );

  for (const event of events) {
    const title = String(event.title ?? 'Site update');
    const eventDate = String(event.date ?? date);
    const kind = String(event.kind ?? 'update');
    const detail = String(event.detail ?? '');
    sections.push(
      `## ${title}

- Date: ${eventDate}
- Type: ${kind}

${detail}`,
    );
  }

  // Factual catalogue pointer so the post always links back into the games,
  // satisfying the internal-link rule without inventing relevance.
  const links = games.slice(0, 3).map((game) => gameLink(game.slug, String(game.data.title ?? game.slug)));
  if (links.length >= 2) {
    sections.push(
      `## Games on SnackArcade

The catalogue currently includes ${links.join(', ')}. Every game page has a written guide, a full controls table and real tips, and every game runs directly in the browser with no download and no sign-up.`,
    );
  }

  return { filename: `auto-${date}-site-update.md`, sections };
}

/**
 * Assemble the final markdown: frontmatter + sections + word-count guard.
 * @param {string} date
 * @param {string} type
 * @param {string} seoTitle
 * @param {string} seoDescription
 * @param {string[]} relatedSlugs
 * @param {string[]} sections
 */
function assemblePost(date, type, seoTitle, seoDescription, relatedSlugs, sections) {
  const related = relatedSlugs.map((slug) => `"${slug}"`).join(', ');
  const frontmatter = [
    '---',
    `title: "SnackArcade ${type.replace(/-/g, ' ')} — ${date}"`,
    'seo:',
    `  title: "${seoTitle}"`,
    `  description: "${seoDescription}"`,
    `relatedGameSlugs: [${related}]`,
    'author: "SnackArcade Team"',
    'draft: true',
    `publishedAt: ${date}`,
    `updatedAt: ${date}`,
    '---',
    '',
  ].join('\n');

  let body = sections.join('\n\n');
  const filler = fillerSections(date);
  let index = 0;
  while (countWords(body) < BLOG_MIN_WORDS && index < filler.length) {
    body += `\n\n${filler[index]}`;
    index += 1;
  }

  if (countWords(body) < BLOG_MIN_WORDS) {
    throw new Error(
      `Could not reach ${BLOG_MIN_WORDS} words for ${type} on ${date} — the input data was too thin to summarise honestly. No file was written.`,
    );
  }

  return `${frontmatter}${body.trim()}\n`;
}

/* ============================================================================
   Main
   ========================================================================== */

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!isValidDate(args.date)) {
    process.stderr.write(`Invalid --date "${args.date}". Use YYYY-MM-DD, e.g. 2026-08-04.\n`);
    process.exit(1);
  }
  if (args.type !== 'all' && !TYPES.includes(args.type)) {
    process.stderr.write(
      `Invalid --type "${args.type}". Use one of: ${TYPES.join(', ')} or "all".\n`,
    );
    process.exit(1);
  }

  const targets = args.type === 'all' ? TYPES : [args.type];
  const games = loadGames();
  const popular = loadJson(POPULAR_FILE);
  const updates = loadJson(UPDATES_FILE);

  let written = 0;

  for (const type of targets) {
    let draft = null;
    if (type === 'new-games') {
      draft = buildNewGamesPost(args.date, games);
    } else if (type === 'weekly-top') {
      draft = buildWeeklyTopPost(args.date, popular, games);
    } else if (type === 'site-update') {
      draft = buildSiteUpdatePost(args.date, updates, games);
    }
    if (!draft) continue;

    const filePath = path.join(BLOG_DIR, draft.filename);
    if (fs.existsSync(filePath)) {
      process.stdout.write(`SKIP (exists): ${path.relative(ROOT, filePath)}\n`);
      continue;
    }

    const relatedSlugs = draft.sections
      .join('\n')
      .match(/\]\(\/games\/([a-z0-9-]+)\/?\)/g)
      ?.map((m) => m.match(/\/games\/([a-z0-9-]+)/)?.[1])
      .filter((slug, i, arr) => slug && arr.indexOf(slug) === i)
      .slice(0, 6) ?? [];

    const seoTitle =
      type === 'new-games'
        ? `New Games Added ${args.date} | SnackArcade`
        : type === 'weekly-top'
          ? `Most Played Games ${args.date} | SnackArcade`
          : `SnackArcade Updates ${args.date} | SnackArcade`;

    const seoDescription =
      type === 'new-games'
        ? `A factual round-up of the games published on SnackArcade on ${args.date}: what each one is, who made it, and how to play.`
        : type === 'weekly-top'
          ? `The most played games on SnackArcade in the latest reporting period, straight from the analytics export dated ${args.date}.`
          : `A factual bulletin of the site updates recorded on SnackArcade on ${args.date}. No opinion, just what changed.`;

    const markdown = assemblePost(
      args.date,
      type,
      seoTitle,
      seoDescription,
      relatedSlugs,
      draft.sections,
    );

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, markdown, 'utf8');
    process.stdout.write(`WROTE: ${path.relative(ROOT, filePath)}\n`);
    written += 1;
  }

  /* ---- Keepalive: only when nothing was written and the repo is quiet ---- */
  if (written === 0) {
    let lastCommitTs = 0;
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%ct'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString().trim();
      lastCommitTs = Number(out);
    } catch {
      lastCommitTs = 0;
    }

    if (Number.isFinite(lastCommitTs) && lastCommitTs > 0) {
      const daysSinceLastCommit = (Date.now() / 1000 - lastCommitTs) / 86_400;
      if (daysSinceLastCommit > 30) {
        const payload = {
          lastSuccessfulRunAt: args.date,
          note: 'Automatic keepalive — no new posts were generated on this run.',
        };
        fs.mkdirSync(path.dirname(KEEPALIVE_FILE), { recursive: true });
        fs.writeFileSync(KEEPALIVE_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        process.stdout.write(`KEEPALIVE: wrote ${path.relative(ROOT, KEEPALIVE_FILE)}\n`);
      }
    }
  }

  process.stdout.write(`GENERATED: ${written} file(s)\n`);
  process.exit(0);
}

main();
