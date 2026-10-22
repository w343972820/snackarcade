/**
 * Regression guard for the defects found in the T04/T05 acceptance pass.
 *
 * Run AFTER a fresh build:
 *   NODE_OPTIONS= ./node_modules/.bin/astro build
 *   NODE_OPTIONS= node tests/qa/regression.mjs
 *
 * Exits non-zero while any defect is still present, so it can be wired into CI.
 * Each check names the file that owns the fix.
 *
 * NOTE ON THE AD GUARD
 * --------------------
 * This guard checks the build that is on disk, and the correct ad output
 * depends on how that build was configured. `dist/ads.txt` is the oracle: it
 * carries a seller line only when PUBLIC_ADSENSE_PUB_ID was set, so it records
 * what shape the build was *asked* to produce. Using it instead of peeking at
 * the page under test is deliberate — a build whose AdSense loader silently
 * disappeared would otherwise look like "no publisher ID configured" and slip
 * through, which is the exact defect this guard exists to catch.
 */
import { readFileSync, existsSync } from 'node:fs';

const DIST = 'dist';
let failed = 0;
const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m, owner) => { failed++; console.log(`  FAIL  ${m}\n        owner: ${owner}`); };

const html = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

/* -- BUG 1: noindex pages must not appear in the sitemap ------------------- */
console.log('\nBUG 1 — sitemap lists noindex URLs');
const sitemap = html(`${DIST}/sitemap-0.xml`);
const smPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const leaked = smPaths.filter((p) => /noindex/i.test(
  (/<meta\s+name="robots"\s+content="([^"]*)"/i.exec(html(`${DIST}${p}index.html`)) ?? [, ''])[1],
));
if (leaked.length === 0) ok(`sitemap has ${smPaths.length} URLs, none noindex`);
else bad(`${leaked.length} noindex URL(s) still in sitemap, e.g. ${leaked.slice(0, 3).join(', ')}`,
  'src/config/noindex-registry.mjs — render phase and sitemap filter resolve different paths');

/* -- BUG 2: empty /blog/ must not be indexable ----------------------------- */
console.log('\nBUG 2 — empty blog index is indexable');
const blog = html(`${DIST}/blog/index.html`);
if (blog === '') ok('/blog/ not built');
else {
  const robots = (/<meta\s+name="robots"\s+content="([^"]*)"/i.exec(blog) ?? [, ''])[1];
  const posts = (blog.match(/class="[^"]*post-card(?![\w-])/g) ?? []).length;
  if (posts === 0 && !/noindex/i.test(robots)) {
    bad(`/blog/ has 0 posts but robots="${robots}"`,
      'src/lib/seo/indexability.ts decide() — case "blog" has no itemCount===0 guard');
  } else ok(`/blog/ posts=${posts} robots="${robots}"`);
}

/* -- BUG 3: homepage "Surprise Me" CTA must not 404 ------------------------ */
console.log('\nBUG 3 — homepage CTA points at a missing route');
const home = html(`${DIST}/index.html`);
const hrefs = [...home.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
const broken = [...new Set(hrefs)].filter(
  (h) => !existsSync(`${DIST}${h}index.html`) && !existsSync(`${DIST}${h.replace(/\/$/, '')}`),
);
if (broken.length === 0) ok(`all ${new Set(hrefs).size} homepage internal links resolve`);
else bad(`broken homepage link(s): ${broken.join(', ')}`,
  'src/content/data/homepage.json — secondaryCta.href, or add the missing route');

/* -- BUG 4: internal build artefact must not ship -------------------------- */
console.log('\nBUG 4 — internal registry file published');
if (existsSync(`${DIST}/.astro/noindex-urls.json`)) {
  bad('dist/.astro/noindex-urls.json is in the deploy output',
    'same root cause as BUG 1 — registry written inside outDir');
} else ok('no .astro artefact in dist');

/* -- Guards that must stay green ------------------------------------------ */
console.log('\nGUARDS — must remain true');
const gameHtml = html(`${DIST}/games/2048/index.html`);
(/<iframe/i.test(gameHtml) ? bad : ok)('no <iframe> before click on /games/2048/');
(/aggregateRating/.test(gameHtml) ? bad : ok)('no aggregateRating in structured data');

/* -- GUARD: the AdSense loader and the ad slots are gated separately -------
 *
 * The old invariant was "ads off means zero ad tokens in the output". That
 * stopped being true when the loader was split from the slots: AdSense will not
 * start a site review until the publisher ID is on the page, and the ID only
 * travels inside the loader, so the loader ships even while ads are off.
 * https://developers.google.com/adsense/platforms/transparent/approvals
 *
 * The invariant now has two forms, picked by the ads.txt oracle described in
 * the file header rather than by inspecting the page under test.
 */
const adsTxtBody = html(`${DIST}/ads.txt`);
const buildHadPublisherId = /^google\.com,\s*pub-\d{16},\s*DIRECT/m.test(adsTxtBody);

const LOADER_TAG = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/g;
/*
 * Not the exact string `class="adsbygoogle"`: AdSlot renders
 * `class="adsbygoogle ad-slot__inner"`, so an exact match would miss every
 * real slot and leave this guard permanently green. Non-global so `.test()`
 * carries no `lastIndex` state.
 */
const SLOT_INS = /\bclass="[^"]*\badsbygoogle\b[^"]*"/;

if (gameHtml === '') {
  ok('ad guard skipped — /games/2048/ was not built');
} else if (buildHadPublisherId) {
  const loaders = (gameHtml.match(LOADER_TAG) ?? []).length;
  const slotContainers = (gameHtml.match(/data-ad-placement=/g) ?? []).length;
  const slotElements = SLOT_INS.test(gameHtml) ? 1 : 0;

  (loaders === 1 ? ok : bad)(
    `exactly 1 AdSense loader on /games/2048/ (found ${loaders})`,
    'src/components/ads/AdsHead.astro — the loader is gated on the publisher ID, not on adsActive()',
  );
  (slotContainers + slotElements === 0 ? ok : bad)(
    `zero ad slots on /games/2048/ while ads are off ` +
      `(found ${slotContainers} data-ad-placement=, ${slotElements} <ins class="adsbygoogle">)`,
    'src/components/ads/AdSlot.astro — slots stay gated on adsActive()',
  );
} else {
  const leaked = /adsbygoogle|pagead2/.test(gameHtml);
  (leaked ? bad : ok)(
    leaked
      ? 'ad tokens present although this build had no publisher ID (ads.txt has no seller line)'
      : 'no ad tokens — this build had no publisher ID, so nothing may emit',
    'src/components/ads/AdsHead.astro — with no publisher ID there is nothing to load',
  );
}

console.log(`\n${failed === 0 ? 'ALL CLEAR' : `${failed} DEFECT(S) STILL PRESENT`}`);
process.exit(failed === 0 ? 0 : 1);
