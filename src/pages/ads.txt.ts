/**
 * `/ads.txt` — the IAB authorised-sellers declaration.
 *
 * WHY THIS IS NOT GATED ON `adsConfig.enabled`
 * --------------------------------------------
 * ads.txt is not ad code; it is a text file declaring who is allowed to sell
 * inventory on this domain. Google checks for it during the AdSense review,
 * which happens BEFORE ads are switched on. So it is generated as soon as a
 * publisher ID exists, independently of the master switch. It contains no
 * script, no tracker and no network tag.
 *
 * With no publisher ID configured — the delivered state — the file is a short
 * comment explaining how to make it real. An ads.txt with no seller lines is
 * valid under the IAB spec and tells crawlers nothing is authorised yet.
 */
import type { APIRoute } from 'astro';

import { adsConfig } from '@/config/ads';

/** Google's fixed certification authority id for the AdSense seller entry. */
const GOOGLE_CERT_AUTHORITY = 'f08c47fec0942fa0';

/**
 * Build the file body.
 *
 * @returns The complete ads.txt text.
 */
function buildAdsTxt(): string {
  const header = [
    '# ads.txt — authorised digital sellers for this domain.',
    '# Generated automatically from PUBLIC_ADSENSE_PUB_ID in your .env file.',
    '# Spec: https://iabtechlab.com/ads-txt/',
    '',
  ];

  if (adsConfig.publisherId === '') {
    return [
      ...header,
      '# No publisher ID is configured yet, so no seller is authorised.',
      '#',
      '# To fix this once you have an AdSense account:',
      '#   1. Open the .env file in the project root.',
      '#   2. Add:  PUBLIC_ADSENSE_PUB_ID=ca-pub-0000000000000000',
      '#            (use your own ID, exactly as AdSense shows it)',
      '#   3. Redeploy. This file will then list your account automatically.',
      '',
      '# Do this BEFORE submitting the site for AdSense review — Google looks',
      '# for this file during the review and a missing one delays approval.',
      '',
    ].join('\n');
  }

  // AdSense expects the publisher ID here WITHOUT the leading "ca-".
  const sellerId = adsConfig.publisherId.replace(/^ca-/, '');

  return [
    ...header,
    `google.com, ${sellerId}, DIRECT, ${GOOGLE_CERT_AUTHORITY}`,
    '',
  ].join('\n');
}

export const GET: APIRoute = () =>
  new Response(buildAdsTxt(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
