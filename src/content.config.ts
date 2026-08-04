/**
 * Content Collections schema — the technical guarantee behind "the site owner
 * can add a game on their own six months from now".
 *
 * Every rule here fails the BUILD, not the live site. The build error is the
 * only teacher the site owner has, so each message names the field, states the
 * requirement, and says what to do about it.
 *
 * Note: `astro/zod` (Zod v4) is bundled with Astro. Do not install the
 * standalone `zod` package — two copies cause type conflicts.
 */
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

import { countWords, countGameBodyWords } from '@/lib/content/wordcount';
import { WORD_COUNT_FLOORS } from '@/config/seo';

/* =============================================================================
   Licences — the legal boundary of the project.

   Only licences that permit commercial use with attribution are allowed.
   Anything with a NonCommercial or NoDerivatives clause, and every copyleft
   licence in the GPL family, is rejected. `scripts/validate-content.mjs` runs
   the same check earlier with an even friendlier message.
   ============================================================================= */
export const ALLOWED_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'CC-BY-4.0',
  'Unlicense',
  'ISC',
  'Zlib',
  'platform-licensed',
  'author-permission',
] as const;

/* =============================================================================
   Small reusable pieces
   ============================================================================= */

const controlRow = z.object({
  action: z
    .string()
    .min(2, 'Each controls row needs an "action" (what the player is doing), e.g. "Move left".'),
  desktop: z
    .string()
    .min(1, 'Each controls row needs a "desktop" value, e.g. "Left arrow key or A".'),
  mobile: z
    .string()
    .min(1, 'Each controls row needs a "mobile" value, e.g. "Swipe left". Write "Not available" if there is no touch equivalent.'),
});

const howToStep = z.object({
  step: z
    .string()
    .min(3, 'Each how-to-play step needs a short bold heading in "step", e.g. "Make your first move."'),
  detail: z
    .string()
    .min(20, 'Each how-to-play step needs a "detail" of at least 20 characters explaining the step.'),
});

const tip = z.object({
  title: z.string().min(4, 'Each tip needs a "title" of at least 4 characters.'),
  body: z
    .string()
    .min(30, 'Each tip needs a "body" of at least 30 characters. Write advice specific to THIS game — generic filler across many pages looks like spam to Google.'),
});

const faqItem = z.object({
  q: z
    .string()
    .min(8, 'Each FAQ entry needs a question ("q") of at least 8 characters.')
    .max(160, 'FAQ questions must be 160 characters or fewer. Split a long question into two.'),
  a: z
    .string()
    .min(30, 'Each FAQ entry needs an answer ("a") of at least 30 characters.'),
});

const licenseInfo = z.object({
  license: z.enum(ALLOWED_LICENSES, {
    message:
      `"license" must be one of: ${ALLOWED_LICENSES.join(', ')}. ` +
      'Licences with NonCommercial (NC), NoDerivatives (ND), GPL or AGPL terms cannot be used on a site that shows ads. ' +
      'If you have written permission from the author instead, use "author-permission" and fill in permissionEmail.',
  }),
  licenseUrl: z
    .string()
    .url('"license.licenseUrl" must be a full URL starting with https:// — link directly to the LICENSE file in the original repository.')
    .optional(),
  author: z
    .string()
    .min(2, '"license.author" is required — credit the person or team who made the game.'),
  authorUrl: z
    .string()
    .url('"license.authorUrl" must be a full URL starting with https://')
    .optional(),
  sourceUrl: z
    .string()
    .url('"license.sourceUrl" must be a full URL starting with https:// — link to the original repository or download page.')
    .optional(),
  assetsLicense: z
    .string()
    .min(2, '"license.assetsLicense" describes the licence covering images and sounds. Write "same as code license" when they share one.')
    .default('same as code license'),
  permissionEmail: z.string().optional(),
  attributionRendered: z
    .string()
    .min(8, '"license.attributionRendered" is the credit line shown on the page, e.g. "2048 by Gabriele Cirulli · MIT License".'),
  verifiedAt: z.coerce.date({
    message: '"license.verifiedAt" must be a date like 2026-08-04 — the day you last checked the licence yourself.',
  }),
});

/* =============================================================================
   games
   ============================================================================= */

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: ({ image }) =>
    z
      .object({
        /* --- Identity --- */
        title: z
          .string()
          .min(2, '"title" is required — the short display name, e.g. "2048".')
          .max(60, '"title" must be 60 characters or fewer. This is the short name, not the page headline.'),
        h1: z
          .string()
          .min(8, '"h1" is the visible page headline, e.g. "Play 2048 Online — Free, No Download".')
          .max(90, '"h1" must be 90 characters or fewer.'),
        draft: z.boolean().default(false),

        /* --- SEO --- */
        seo: z.object({
          title: z
            .string()
            .min(30, '"seo.title" must be at least 30 characters — short titles waste search result space.')
            .max(60, '"seo.title" must be 60 characters or fewer, otherwise Google cuts it off mid-sentence.'),
          description: z
            .string()
            .min(120, '"seo.description" must be at least 120 characters. Aim for 140–155.')
            .max(158, '"seo.description" must be 158 characters or fewer, otherwise Google truncates it.'),
          targetKeywords: z
            .array(z.string())
            .min(1, '"seo.targetKeywords" needs at least 1 keyword — the search phrase this page should win.')
            .max(8, '"seo.targetKeywords" allows at most 8 keywords. Targeting more than 8 means targeting none.'),
          canonicalOverride: z
            .string()
            .url('"seo.canonicalOverride" must be a full URL. Leave it out unless you know you need it.')
            .optional(),
          ogImageOverride: z.string().optional(),
          noindexOverride: z.boolean().default(false),
        }),

        /* --- Media --- */
        media: z.object({
          cover: image(),
          coverAlt: z
            .string()
            .min(10, '"media.coverAlt" describes the cover image for screen readers and image search. At least 10 characters, e.g. "2048 gameplay screenshot".'),
          screenshots: z
            .array(image())
            .max(4, '"media.screenshots" allows at most 4 images — each extra image costs deploy budget.')
            .default([]),
          aspectRatio: z
            .tuple([z.number(), z.number()])
            .default([16, 9]),
        }),

        /* --- Where the playable game comes from --- */
        source: z.discriminatedUnion('sourceType', [
          z.object({
            sourceType: z.literal('self_hosted'),
            bundlePath: z
              .string()
              .min(1, '"source.bundlePath" must point at the folder under games-src/, e.g. "games-src/2048".'),
            entryFile: z.string().default('index.html'),
            bundleFileCount: z
              .number()
              .int()
              .positive('"source.bundleFileCount" is filled in automatically by `npm run new:game`. Do not set it to 0 by hand.'),
            bundleBytes: z
              .number()
              .int()
              .positive('"source.bundleBytes" is filled in automatically by `npm run new:game`. Do not set it to 0 by hand.'),
          }),
          z.object({
            sourceType: z.literal('iframe'),
            provider: z.enum(['gamedistribution', 'gamepix', 'other'], {
              message: '"source.provider" must be one of: gamedistribution, gamepix, other.',
            }),
            embedUrl: z
              .string()
              .url('"source.embedUrl" must be the full https:// embed URL supplied by the platform.'),
          }),
        ]),

        /* --- Taxonomy --- */
        taxonomy: z.object({
          primaryCategory: reference('categories'),
          categories: z
            .array(reference('categories'))
            .min(1, '"taxonomy.categories" needs at least 1 category, and it must include the primaryCategory.')
            .max(3, '"taxonomy.categories" allows at most 3. A game in every category ranks for none.'),
          tags: z
            .array(z.string())
            .min(2, '"taxonomy.tags" needs at least 2 tags. Tags must already exist in src/content/data/tags.json.')
            .max(10, '"taxonomy.tags" allows at most 10 tags.'),
          mechanics: z
            .array(z.string())
            .max(8, '"taxonomy.mechanics" allows at most 8 entries.')
            .default([]),
        }),

        /* --- The written content modules --- */
        content: z.object({
          intro: z
            .string()
            .refine(
              (value) => countWords(value) >= 60,
              (value) =>
                ({
                  message: `"content.intro" needs at least 60 words, currently ${countWords(value)}. This is the opening paragraph a reader sees under the game — make it specific to this game.`,
                }) as { message: string },
            ),
          about: z
            .array(
              z
                .string()
                .min(80, 'Each "content.about" paragraph must be at least 80 characters. Very short paragraphs read as filler.'),
            )
            .min(2, '"content.about" needs 2–4 paragraphs describing what the game is and why it is worth playing. Add another paragraph.')
            .max(4, '"content.about" allows at most 4 paragraphs.'),
          howToPlay: z
            .array(howToStep)
            .min(3, '"content.howToPlay" needs 3–6 steps. This section targets "how to play X" searches, so it matters.')
            .max(6, '"content.howToPlay" allows at most 6 steps.'),
          controls: z
            .array(controlRow)
            .min(8, '"content.controls" needs 8–15 rows. List every key and touch gesture, including fullscreen and restart. This table is what wins the "X controls" searches.')
            .max(15, '"content.controls" allows at most 15 rows.'),
          tips: z
            .array(tip)
            .min(5, '"content.tips" needs 5–8 tips. Write tips that only make sense for THIS game — reusing the same tips across pages is treated as doorway-page spam.')
            .max(8, '"content.tips" allows at most 8 tips.'),
          features: z
            .array(z.string().min(10, 'Each "content.features" entry must be at least 10 characters.'))
            .max(6, '"content.features" allows at most 6 entries.')
            .default([]),
          faq: z
            .array(faqItem)
            .min(5, '"content.faq" needs 5–7 question-and-answer pairs, each with a "question"-style "q" field and an "a" field. These generate the FAQ structured data.')
            .max(7, '"content.faq" allows at most 7 entries.'),
        }),

        /* --- Game Info table --- */
        info: z.object({
          developer: z.string().min(2, '"info.developer" is required — who made the game.'),
          released: z.string().min(4, '"info.released" is required, e.g. "2014" or "March 2014".'),
          genre: z
            .array(z.string())
            .min(1, '"info.genre" needs at least 1 genre, e.g. ["Puzzle", "Number"].')
            .max(4, '"info.genre" allows at most 4 genres.'),
          players: z.enum(['SinglePlayer', 'MultiPlayer', 'CoOp'], {
            message: '"info.players" must be exactly one of: SinglePlayer, MultiPlayer, CoOp (note the capital letters, no spaces).',
          }),
          technology: z.string().default('HTML5 / JavaScript'),
          platform: z.array(z.string()).default(['Desktop', 'Tablet', 'Mobile browser']),
          avgSessionMinutes: z
            .number()
            .int()
            .min(1, '"info.avgSessionMinutes" must be at least 1.')
            .max(120, '"info.avgSessionMinutes" must be 120 or less.'),
        }),

        /* --- Licence --- */
        license: licenseInfo,

        /* --- Ratings ---
           Publishing a rating you do not actually have is structured-data
           fraud and Google penalises it site-wide. Keep count at 0 until real
           user ratings exist. */
        ratings: z
          .object({
            count: z.number().int().min(0).default(0),
            value: z
              .number()
              .min(1, '"ratings.value" must be between 1 and 5.')
              .max(5, '"ratings.value" must be between 1 and 5.')
              .optional(),
          })
          .default({ count: 0 })
          .refine((r) => r.count === 0 || r.value !== undefined, {
            message:
              '"ratings.count" is greater than 0 but "ratings.value" is missing. Either set both to real numbers, or set count back to 0.',
          })
          .refine((r) => r.count > 0 || r.value === undefined, {
            message:
              '"ratings.value" is set while "ratings.count" is 0. Publishing a star rating with no real ratings behind it is structured-data fraud and Google penalises the whole site for it. Remove "value", or set "count" to the real number of ratings.',
          }),

        publishedAt: z.coerce.date({
          message: '"publishedAt" must be a date like 2026-09-01.',
        }),
        updatedAt: z.coerce.date({
          message: '"updatedAt" must be a date like 2026-09-01. Bump it whenever you meaningfully edit the page.',
        }),
      })

      /* ---- Cross-field rules ---- */
      .refine(
        (game) => {
          const total = countGameBodyWords(game.content);
          const floor =
            game.source.sourceType === 'iframe'
              ? WORD_COUNT_FLOORS.GAME_IFRAME
              : WORD_COUNT_FLOORS.GAME_SELF_HOSTED;
          return total >= floor;
        },
        (game) => {
          const total = countGameBodyWords(game.content);
          const floor =
            game.source.sourceType === 'iframe'
              ? WORD_COUNT_FLOORS.GAME_IFRAME
              : WORD_COUNT_FLOORS.GAME_SELF_HOSTED;
          return {
            message:
              `This page has ${total} words of original text but needs at least ${floor}. ` +
              `Add roughly ${floor - total} more, ideally in "content.tips" or "content.about" — ` +
              'those sections carry the most search value. Thin pages are the most common reason AdSense rejects a site.',
          } as { message: string };
        },
      )
      .refine(
        (game) => game.license.license !== 'author-permission' || Boolean(game.license.permissionEmail),
        {
          message:
            '"license.license" is "author-permission", so "license.permissionEmail" is required. Record the email address the author granted permission from — it is your only evidence if the permission is ever questioned.',
        },
      )
      .refine(
        (game) =>
          game.source.sourceType !== 'self_hosted' ||
          (Boolean(game.license.sourceUrl) && Boolean(game.license.licenseUrl)),
        {
          message:
            'A self-hosted game must have both "license.sourceUrl" and "license.licenseUrl". You are redistributing someone else\'s code, so the page has to link to where it came from and to the licence that allows it.',
        },
      )
      .refine(
        (game) => game.taxonomy.categories.some((cat) => cat.id === game.taxonomy.primaryCategory.id),
        {
          message:
            '"taxonomy.primaryCategory" must also appear in "taxonomy.categories". Add it to the list.',
        },
      ),
});

/* =============================================================================
   categories
   ============================================================================= */

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    name: z.string().min(2, '"name" is the display name of the category, e.g. "Puzzle & Logic".'),
    h1Template: z
      .string()
      .default('Free {name} Games — Play {count} {name} Games Online'),
    seo: z.object({
      titleTemplate: z
        .string()
        .min(10, '"seo.titleTemplate" is required. Available placeholders: {count} {name} {year} {site}'),
      descriptionTemplate: z
        .string()
        .min(10, '"seo.descriptionTemplate" is required. Available placeholders: {count} {name} {year} {month} {site}'),
    }),
    faq: z
      .array(faqItem)
      .min(3, '"faq" needs 3–5 question-and-answer pairs on a category page.')
      .max(5, '"faq" allows at most 5 entries on a category page.'),
    order: z.number().int(),
    relatedCategories: z.array(z.string()).default([]),
    icon: z.string().optional(),
  }),
});

/* =============================================================================
   tags
   ============================================================================= */

const tags = defineCollection({
  loader: file('./src/content/data/tags.json'),
  schema: z.object({
    id: z.string().min(1, 'Every tag needs an "id" — the URL slug, lowercase with hyphens.'),
    name: z.string().min(2, 'Every tag needs a display "name".'),
    description: z
      .string()
      .min(40, 'Every tag needs a "description" of at least 40 characters. It is the only original text on the tag page, and without it the page is thin.'),
    forceNoindex: z.boolean().default(false),
  }),
});

/* =============================================================================
   pages — About / Privacy / Terms / Contact / DMCA
   ============================================================================= */

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(2, '"title" is required.'),
    seo: z.object({
      title: z
        .string()
        .min(15, '"seo.title" must be at least 15 characters.')
        .max(60, '"seo.title" must be 60 characters or fewer.'),
      description: z
        .string()
        .min(70, '"seo.description" must be at least 70 characters.')
        .max(158, '"seo.description" must be 158 characters or fewer.'),
    }),
    updatedAt: z.coerce.date({ message: '"updatedAt" must be a date like 2026-08-04.' }),
    /** Legal pages are indexable but should not be promoted in listings. */
    showInFooter: z.boolean().default(true),
  }),
});

/* =============================================================================
   collections and blog — routes exist from T05 onward; the schemas are defined
   now so content can be written at any time without a code change.
   ============================================================================= */

const gameCollections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collections' }),
  schema: z.object({
    title: z.string().min(4, '"title" is required.'),
    seo: z.object({
      title: z.string().min(15).max(60),
      description: z.string().min(70).max(158),
    }),
    gameSlugs: z
      .array(z.string())
      .min(1, '"gameSlugs" needs at least 1 game. Collections with fewer than 10 games are automatically set to noindex.'),
    year: z.number().int().optional(),
    order: z.number().int().default(0),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(4, '"title" is required.'),
    seo: z.object({
      title: z.string().min(15).max(60),
      description: z.string().min(70).max(158),
    }),
    relatedGameSlugs: z.array(z.string()).default([]),
    author: z.string().default('SnackArcade'),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = {
  games,
  categories,
  tags,
  pages,
  collections: gameCollections,
  blog,
};
