/**
 * Regression guard for the defects found in the T04/T05 acceptance pass.
 *
 * Run AFTER a fresh build:
 *   NODE_OPTIONS= ./node_modules/.bin/astro build
 *   NODE_OPTIONS= node tests/qa/regression.mjs
 *
 * Exits non-zero while any defect is still present, so it can be wired into CI.
 * Each check names the file that owns the fix.
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
(/adsbygoogle|pagead2/.test(gameHtml) ? bad : ok)('no ad tokens while ads are off');

console.log(`\n${failed === 0 ? 'ALL CLEAR' : `${failed} DEFECT(S) STILL PRESENT`}`);
process.exit(failed === 0 ? 0 : 1);
