/**
 * `/robots.txt`
 *
 * Two jobs only:
 *   1. Point crawlers at the sitemap index.
 *   2. Keep them out of paths that produce infinite or duplicate URLs.
 *
 * Thin pages are NOT handled here. Disallowing a page in robots.txt stops
 * Google reading it, which also stops it seeing the `noindex` tag — the page
 * can then stay in the index as a URL-only entry forever. Indexability is
 * decided in `src/lib/seo/indexability.ts` and expressed with meta robots.
 */
import type { APIRoute } from 'astro';

import { SITE, USING_PLACEHOLDER_DOMAIN } from '@/config/site';
import { getGameOrigin } from '@/lib/utils/gameUrl';

/**
 * Paths crawlers should never spend budget on.
 * `/play/` holds the raw playable bundles; the page that should rank is the
 * article at `/games/{slug}/`, and letting the bare bundle compete with it is
 * a duplicate-content own goal.
 */
const DISALLOWED: readonly string[] = [
  '/search/',
  '/play/',
  '/api/',
  '/*?*',
];

/**
 * Build the robots.txt body.
 *
 * @returns The complete file text.
 */
function buildRobotsTxt(): string {
  const lines: string[] = [];

  lines.push('# robots.txt for ' + SITE.name);
  lines.push('');
  lines.push('User-agent: *');
  for (const path of DISALLOWED) {
    lines.push(`Disallow: ${path}`);
  }
  lines.push('Allow: /');
  lines.push('');

  // Google's AdSense crawler must be able to read every page it may serve ads
  // on, including ones blocked above, or the ads on them go blank.
  lines.push('User-agent: Mediapartners-Google');
  lines.push('Allow: /');
  lines.push('');

  lines.push('User-agent: AdsBot-Google');
  lines.push('Allow: /');
  lines.push('');

  const gameOrigin = getGameOrigin();
  if (gameOrigin !== null) {
    lines.push(`# Playable game bundles are served from ${gameOrigin}`);
    lines.push('');
  }

  lines.push(`Sitemap: ${SITE.url}/sitemap-index.xml`);
  lines.push('');

  if (USING_PLACEHOLDER_DOMAIN) {
    lines.push('# NOTE: PUBLIC_SITE_URL is still the default placeholder domain.');
    lines.push('# Set it in .env before going live, or this Sitemap line is wrong.');
    lines.push('');
  }

  return lines.join('\n');
}

export const GET: APIRoute = () =>
  new Response(buildRobotsTxt(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
