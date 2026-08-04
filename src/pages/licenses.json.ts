/**
 * Public licence manifest.  Output: /licenses.json
 *
 * Every self-hosted game must credit its original developer and link to the
 * licence that permits this use. This endpoint publishes that ledger as machine
 * readable JSON, independent of the HTML /licenses/ page. It is generated from
 * the content collection's licence fields — the same source the build validates
 * against — so the two can never disagree.
 */
import type { APIRoute } from 'astro';

import { getPublishedGames } from '@/lib/content/games';

export const GET: APIRoute = async () => {
  const games = await getPublishedGames();

  const records = games.map((game) => ({
    slug: game.id,
    title: game.data.title,
    license: game.data.license.license,
    author: game.data.license.author,
    authorUrl: game.data.license.authorUrl ?? null,
    licenseUrl: game.data.license.licenseUrl ?? null,
    sourceUrl: game.data.license.sourceUrl ?? null,
    attribution: game.data.license.attributionRendered,
    verifiedAt: game.data.license.verifiedAt.toISOString().slice(0, 10),
  }));

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: records.length,
    games: records,
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
