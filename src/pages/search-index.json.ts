/**
 * Search index endpoint.  Output: /search-index.json
 *
 * A small, self-contained JSON document the client loads once and searches
 * entirely in the browser with MiniSearch. No server, no query param, no extra
 * route — which keeps the site 100% static and zero-cost to host.
 *
 * Kept out of the sitemap automatically: it lives under no indexable route and
 * the search page that consumes it is marked noindex.
 */
import type { APIRoute } from 'astro';

import { getPublishedGames } from '@/lib/content/games';
import { gamePath } from '@/lib/utils/url';

export const GET: APIRoute = async () => {
  const games = await getPublishedGames();

  const records = games.map((game) => ({
    slug: game.id,
    title: game.data.title,
    description: game.data.seo.description,
    keywords: [...game.data.taxonomy.tags, ...game.data.info.genre].join(' '),
    url: gamePath(game.id),
    categories: game.data.taxonomy.categories.map((ref) => ref.id),
  }));

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: records.length,
    records,
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
