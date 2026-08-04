/**
 * QA item 1 & 2 — first-viewport ad safety on game detail pages.
 *
 * Ads are OFF in the committed config, so the shipped dist proves nothing about
 * placement. This script runs against a build made with PUBLIC_ADS_ENABLED=true
 * so the ad containers actually exist and their DOM position can be measured.
 *
 * Checks per game page:
 *   1. Ordered landmarks: header -> breadcrumb -> h1 -> meta bar -> game area.
 *   2. No ad container appears before the game area.
 *   3. The first ad after the game area carries the 150px guard.
 *   4. Ad count per page <= adsConfig.maxPerPage (3).
 */
import { readFileSync } from 'node:fs';

const SLUGS = ['2048', 'block-drop', 'five-letters'];
const DIST = process.argv[2] ?? 'dist-adson';
const GAP_MIN = 150;

let failures = 0;
const fail = (m) => { failures++; console.log(`  FAIL ${m}`); };
const pass = (m) => console.log(`  PASS ${m}`);

for (const slug of SLUGS) {
  console.log(`\n=== /games/${slug}/ ===`);
  const html = readFileSync(`${DIST}/games/${slug}/index.html`, 'utf8');

  // --- Landmark positions (character offsets in source order) ---
  const at = (re) => { const m = re.exec(html); return m ? m.index : -1; };

  const marks = {
    header:     at(/<header[^>]*>/i),
    breadcrumb: at(/class="[^"]*game-page__crumbs/i),
    h1:         at(/<h1[^>]*>/i),
    metaBar:    at(/class="[^"]*game-meta(?![_-])/i),
    gameArea:   at(/id="game"|class="[^"]*game-player/i),
  };
  console.log('  offsets:', JSON.stringify(marks));

  const order = ['header', 'breadcrumb', 'h1', 'metaBar', 'gameArea'];
  for (const k of order) if (marks[k] < 0) fail(`landmark "${k}" not found`);

  for (let i = 1; i < order.length; i++) {
    const [prev, cur] = [order[i - 1], order[i]];
    if (marks[prev] >= 0 && marks[cur] >= 0) {
      if (marks[prev] < marks[cur]) pass(`${prev} before ${cur}`);
      else fail(`DOM ORDER: ${prev}(${marks[prev]}) must precede ${cur}(${marks[cur]})`);
    }
  }

  // --- Ad containers, in document order ---
  const ads = [...html.matchAll(/<aside[^>]*class="[^"]*ad-slot[^"]*"[^>]*>/gi)]
    .map((m) => ({
      index: m.index,
      tag: m[0],
      placement: (/data-ad-placement="([^"]+)"/.exec(m[0]) ?? [, '?'])[1],
      guarded: /game-ad-guard/.test(m[0]),
      gap: Number((/--game-ad-gap:(\d+)px/.exec(m[0]) ?? [, '0'])[1]),
    }));

  console.log(`  ads found: ${ads.length} -> ${ads.map((a) => a.placement).join(', ') || '(none)'}`);
  if (ads.length === 0) fail('no ad containers in ads-ON build — cannot verify placement');

  // 2. Nothing above the game area.
  const above = ads.filter((a) => marks.gameArea >= 0 && a.index < marks.gameArea);
  if (above.length === 0) pass('no ad container before the game area');
  else fail(`${above.length} ad(s) ABOVE game area: ${above.map((a) => a.placement).join(', ')}`);

  // 3. First ad after the game area must carry the guard.
  const first = ads.find((a) => a.index > marks.gameArea);
  if (!first) fail('no ad after the game area');
  else if (first.guarded && first.gap >= GAP_MIN) {
    pass(`first ad "${first.placement}" guarded with ${first.gap}px (>= ${GAP_MIN})`);
  } else {
    fail(`first ad "${first.placement}" guard=${first.guarded} gap=${first.gap}px (< ${GAP_MIN})`);
  }

  // 4. Ad count cap.
  if (ads.length <= 3) pass(`ad count ${ads.length} <= maxPerPage 3`);
  else fail(`ad count ${ads.length} exceeds maxPerPage 3`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
