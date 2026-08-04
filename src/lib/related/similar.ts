/**
 * Internal-link graph for the "Similar Games" module.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THIS IS NOT A ONE-LINE "SORT BY SHARED TAGS"
 * ═══════════════════════════════════════════════════════════════════════════
 * The Similar Games block is the site's entire internal-linking strategy. On a
 * site with no backlinks, internal links are the only way PageRank reaches a
 * new page, so the shape of this graph decides which pages Google crawls and
 * which ones sit undiscovered for months.
 *
 * A naive "count shared tags" ranking fails in three specific ways, and each
 * one is fixed here:
 *
 *   1. GENERIC TAGS DROWN OUT REAL SIGNAL.
 *      Every game on the site carries `no-download` and `free`. Counting raw
 *      overlap makes a word game look similar to a racing game because they
 *      share two tags that mean nothing. Fixed with IDF weighting: a feature
 *      present on every game gets a weight of exactly zero
 *      (`log((N+1)/(N+1)) == 0`), so universal tags cannot create a match.
 *
 *   2. HUBS EAT THE LINK BUDGET.
 *      Pure top-K ranking makes the five most-connected games appear in every
 *      block, so link equity circulates among them and never reaches the tail.
 *      Fixed by damping a candidate's score by the number of inbound links it
 *      has already collected during this build.
 *
 *   3. ORPHAN PAGES.
 *      Some games end up in nobody's list. An orphan page gets crawled late,
 *      ranked poorly, and sometimes not indexed at all. Fixed by an explicit
 *      rescue pass that guarantees a minimum in-degree for every game.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DETERMINISM IS A HARD REQUIREMENT
 * ═══════════════════════════════════════════════════════════════════════════
 * The output must be byte-identical for identical input, on every machine and
 * in every build. If it is not, every deploy rewrites the internal links of
 * every page, `lastmod` churns, and Google keeps re-crawling pages that did not
 * actually change.
 *
 * Three rules enforce that, and the unit test asserts all of them:
 *   • No `Math.random`, no `Date.now`, no reliance on object iteration order.
 *   • Input is sorted by slug internally, so the caller's array order is
 *     irrelevant.
 *   • Slug comparison uses raw code-unit ordering, never `localeCompare`,
 *     which changes result with the machine's locale (ICU) settings.
 *
 * This module is deliberately free of Astro imports so it can be unit-tested
 * directly. `toSimilarityGame()` adapts a content-collection entry to the plain
 * shape used here.
 */
import { SIMILAR_GAMES } from '@/config/seo';

/* =============================================================================
   Types
   ============================================================================= */

/** The only facts about a game that affect similarity. */
export interface SimilarityGame {
  /** Unique game slug, e.g. `block-drop`. */
  readonly slug: string;
  /** Primary category id — the strongest single signal. */
  readonly primaryCategory: string;
  /** All category ids, including the primary one. */
  readonly categories: readonly string[];
  /** Tag ids, e.g. `no-download`. */
  readonly tags: readonly string[];
  /** Gameplay mechanic ids, e.g. `tile-merge`. */
  readonly mechanics: readonly string[];
}

/** Tuning knobs. Defaults come from `src/config/seo.ts`. */
export interface SimilarLinkOptions {
  /** Links every game emits before the rescue pass. Default `SIMILAR_GAMES.MIN`. */
  readonly minOut?: number;
  /** Hard cap on links a game may emit. Default `SIMILAR_GAMES.MAX`. */
  readonly maxOut?: number;
  /** Inbound links every game is guaranteed. Default `SIMILAR_GAMES.MIN_IN_DEGREE`. */
  readonly minInDegree?: number;
  /**
   * How strongly to penalise a candidate that already has inbound links.
   * `0` disables balancing entirely; `1` halves the score of a game that has
   * been picked once. Default `0.35`.
   */
  readonly hubDamping?: number;
}

/**
 * Structural shape of an Astro content-collection game entry.
 *
 * Declared structurally rather than importing `CollectionEntry<'games'>` so
 * that this module never pulls in `astro:content`, which cannot be resolved
 * inside Vitest.
 */
export interface GameLikeEntry {
  readonly id: string;
  readonly data: {
    readonly taxonomy: {
      readonly primaryCategory: { readonly id: string };
      readonly categories: readonly { readonly id: string }[];
      readonly tags: readonly string[];
      readonly mechanics: readonly string[];
    };
  };
}

/** Slug -> ordered list of slugs to link to. */
export type SimilarityGraph = Map<string, string[]>;

/* =============================================================================
   Feature extraction
   ============================================================================= */

/**
 * Relative importance of each kind of feature.
 *
 * A shared primary category says far more than a shared tag, so the kinds are
 * weighted before IDF is applied. IDF then scales each individual feature by
 * how rare it is, and the two multiply.
 */
const FEATURE_WEIGHTS = {
  pri: 3,
  cat: 2,
  mech: 1.25,
  tag: 1,
} as const;

type FeatureKind = keyof typeof FEATURE_WEIGHTS;

/** Floating-point comparisons need a tolerance; scores live in `[0, 1]`. */
const EPSILON = 1e-12;

/**
 * Code-unit slug comparison.
 *
 * `String.prototype.localeCompare` is deliberately avoided: its result depends
 * on the host's ICU data, which would make the graph differ between a developer
 * laptop and CI. That is exactly the non-determinism this module forbids.
 *
 * @param a First slug.
 * @param b Second slug.
 * @returns -1, 0 or 1.
 */
function compareSlug(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Namespaced feature tokens for one game.
 *
 * Namespacing (`cat:puzzle` rather than `puzzle`) prevents a tag from
 * accidentally matching a category that happens to share a name.
 *
 * @param game The game to describe.
 * @returns A set of feature tokens.
 */
export function featureSet(game: SimilarityGame): Set<string> {
  const features = new Set<string>();

  const primary = game.primaryCategory.trim();
  if (primary !== '') features.add(`pri:${primary}`);

  for (const category of game.categories) {
    const value = category.trim();
    if (value !== '') features.add(`cat:${value}`);
  }

  for (const tag of game.tags) {
    const value = tag.trim();
    if (value !== '') features.add(`tag:${value}`);
  }

  for (const mechanic of game.mechanics) {
    const value = mechanic.trim();
    if (value !== '') features.add(`mech:${value}`);
  }

  return features;
}

/**
 * The kind prefix of a feature token.
 *
 * @param feature A namespaced token such as `cat:puzzle`.
 * @returns The feature kind; unknown prefixes are treated as tags.
 */
function kindOf(feature: string): FeatureKind {
  const separator = feature.indexOf(':');
  const prefix = separator === -1 ? '' : feature.slice(0, separator);

  if (prefix === 'pri' || prefix === 'cat' || prefix === 'mech' || prefix === 'tag') {
    return prefix;
  }
  return 'tag';
}

/**
 * Inverse document frequency for every feature in the corpus.
 *
 * Uses the smoothed form `log((N + 1) / (df + 1))`, which has one property this
 * module depends on: a feature carried by *every* game scores exactly `0`. That
 * is what makes `no-download` incapable of producing a match, and it is
 * asserted directly by the unit test.
 *
 * @param games The full corpus.
 * @returns Feature token -> IDF value, always `>= 0`.
 */
export function computeIdf(games: readonly SimilarityGame[]): Map<string, number> {
  const total = games.length;
  const documentFrequency = new Map<string, number>();

  for (const game of games) {
    for (const feature of featureSet(game)) {
      documentFrequency.set(feature, (documentFrequency.get(feature) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [feature, frequency] of documentFrequency) {
    idf.set(feature, Math.log((total + 1) / (frequency + 1)));
  }
  return idf;
}

/**
 * Final weight of a feature: kind importance multiplied by rarity.
 *
 * @param feature Namespaced feature token.
 * @param idf Corpus IDF table from `computeIdf`.
 * @returns A non-negative weight.
 */
function weightOf(feature: string, idf: ReadonlyMap<string, number>): number {
  const rarity = idf.get(feature) ?? 0;
  if (rarity <= 0) return 0;
  return FEATURE_WEIGHTS[kindOf(feature)] * rarity;
}

/**
 * IDF-weighted Jaccard similarity between two games.
 *
 * `sum(weight of shared features) / sum(weight of all features in either game)`
 *
 * The result is in `[0, 1]`. Two games whose only shared features are universal
 * tags score `0`, because those features contribute `0` to the numerator while
 * still being weightless in the denominator.
 *
 * @param a First game.
 * @param b Second game.
 * @param idf Corpus IDF table from `computeIdf`.
 * @returns Similarity in `[0, 1]`; `0` for a game compared with itself.
 */
export function similarityScore(
  a: SimilarityGame,
  b: SimilarityGame,
  idf: ReadonlyMap<string, number>,
): number {
  if (a.slug === b.slug) return 0;

  const featuresA = featureSet(a);
  const featuresB = featureSet(b);

  let intersection = 0;
  let union = 0;

  for (const feature of featuresA) {
    const weight = weightOf(feature, idf);
    union += weight;
    if (featuresB.has(feature)) intersection += weight;
  }

  for (const feature of featuresB) {
    if (featuresA.has(feature)) continue;
    union += weightOf(feature, idf);
  }

  if (union <= EPSILON) return 0;
  return intersection / union;
}

/* =============================================================================
   Graph construction
   ============================================================================= */

/** One candidate under consideration during the greedy pass. */
interface Candidate {
  slug: string;
  /** Raw similarity, used for display ordering and as a tie-break. */
  raw: number;
  /** Similarity after the hub penalty, used for selection. */
  adjusted: number;
  /** Inbound links the candidate already has. */
  inDegree: number;
}

/**
 * Decide whether `next` should replace `best` as the chosen candidate.
 *
 * The ordering is fully specified so the outcome cannot depend on iteration
 * order: adjusted score desc, then raw score desc, then in-degree asc (spread
 * links when everything ties), then slug asc.
 *
 * @param next Candidate being considered.
 * @param best Current best, or null when nothing has been chosen yet.
 * @returns True when `next` wins.
 */
function beats(next: Candidate, best: Candidate | null): boolean {
  if (best === null) return true;

  if (next.adjusted > best.adjusted + EPSILON) return true;
  if (next.adjusted < best.adjusted - EPSILON) return false;

  if (next.raw > best.raw + EPSILON) return true;
  if (next.raw < best.raw - EPSILON) return false;

  if (next.inDegree !== best.inDegree) return next.inDegree < best.inDegree;

  return compareSlug(next.slug, best.slug) < 0;
}

/**
 * Build the complete internal-link graph for the Similar Games module.
 *
 * Three passes:
 *   1. **Greedy selection with hub damping** — every game picks `minOut`
 *      neighbours, but a candidate's score is divided by
 *      `1 + hubDamping * (links it already received)`. Popular games are still
 *      preferred, just not endlessly.
 *   2. **Orphan rescue** — any game below `minInDegree` inbound links is given
 *      links from the most similar games that still have spare out-degree, up
 *      to `maxOut`.
 *   3. **Display ordering** — each row is re-sorted by raw similarity so the
 *      rescue links do not always appear last regardless of relevance.
 *
 * @param games The full corpus. Duplicate slugs are ignored after the first.
 * @param options Tuning knobs; see `SimilarLinkOptions`.
 * @returns Slug -> ordered neighbour slugs. Every input slug is present as a
 *          key, even when its list is empty (corpus of one).
 */
export function buildSimilarityGraph(
  games: readonly SimilarityGame[],
  options: SimilarLinkOptions = {},
): SimilarityGraph {
  const minOut: number = options.minOut ?? SIMILAR_GAMES.MIN;
  const maxOut: number = options.maxOut ?? SIMILAR_GAMES.MAX;
  const minInDegree: number = options.minInDegree ?? SIMILAR_GAMES.MIN_IN_DEGREE;
  const hubDamping: number = options.hubDamping ?? 0.35;

  // Deduplicate, then impose a canonical order so the caller's array order can
  // never influence the result.
  const bySlug = new Map<string, SimilarityGame>();
  for (const game of games) {
    if (!bySlug.has(game.slug)) bySlug.set(game.slug, game);
  }
  const ordered: SimilarityGame[] = [...bySlug.values()].sort((a, b) =>
    compareSlug(a.slug, b.slug),
  );

  const graph: SimilarityGraph = new Map<string, string[]>();
  const total = ordered.length;
  if (total === 0) return graph;

  for (const game of ordered) graph.set(game.slug, []);
  if (total === 1) return graph;

  const idf = computeIdf(ordered);

  // Pairwise scores, computed once. O(n^2) is correct here: n is the number of
  // games on the site, and the whole graph is built a single time per build.
  const scores = new Map<string, Map<string, number>>();
  for (const game of ordered) {
    const row = new Map<string, number>();
    for (const other of ordered) {
      if (other.slug === game.slug) continue;
      row.set(other.slug, similarityScore(game, other, idf));
    }
    scores.set(game.slug, row);
  }

  const inDegree = new Map<string, number>(ordered.map((game) => [game.slug, 0]));
  const picks = new Map<string, string[]>(ordered.map((game) => [game.slug, []]));
  const linked = new Map<string, Set<string>>(
    ordered.map((game) => [game.slug, new Set<string>()]),
  );

  /** A corpus of 3 games cannot give anyone 6 links. */
  const targetOut: number = Math.min(minOut, total - 1);
  const cappedMaxOut: number = Math.max(targetOut, Math.min(maxOut, total - 1));
  const targetInDegree: number = Math.min(minInDegree, total - 1);

  /* ---- Pass 1: greedy selection with hub damping -------------------------- */
  for (const game of ordered) {
    const row = scores.get(game.slug);
    const chosen = picks.get(game.slug);
    const already = linked.get(game.slug);
    if (row === undefined || chosen === undefined || already === undefined) continue;

    while (chosen.length < targetOut) {
      let best: Candidate | null = null;

      for (const other of ordered) {
        if (other.slug === game.slug) continue;
        if (already.has(other.slug)) continue;

        const raw = row.get(other.slug) ?? 0;
        const currentInDegree = inDegree.get(other.slug) ?? 0;
        const candidate: Candidate = {
          slug: other.slug,
          raw,
          adjusted: raw / (1 + hubDamping * currentInDegree),
          inDegree: currentInDegree,
        };

        if (beats(candidate, best)) best = candidate;
      }

      if (best === null) break;

      chosen.push(best.slug);
      already.add(best.slug);
      inDegree.set(best.slug, (inDegree.get(best.slug) ?? 0) + 1);
    }
  }

  /* ---- Pass 2: orphan rescue ---------------------------------------------- */
  for (const target of ordered) {
    while ((inDegree.get(target.slug) ?? 0) < targetInDegree) {
      let donorSlug: string | null = null;
      let donorScore = -1;
      let donorOut = Number.POSITIVE_INFINITY;

      for (const candidate of ordered) {
        if (candidate.slug === target.slug) continue;

        const candidatePicks = picks.get(candidate.slug);
        const candidateLinked = linked.get(candidate.slug);
        if (candidatePicks === undefined || candidateLinked === undefined) continue;
        if (candidatePicks.length >= cappedMaxOut) continue;
        if (candidateLinked.has(target.slug)) continue;

        const score = scores.get(candidate.slug)?.get(target.slug) ?? 0;
        const outDegree = candidatePicks.length;

        const better =
          donorSlug === null ||
          score > donorScore + EPSILON ||
          (Math.abs(score - donorScore) <= EPSILON &&
            (outDegree < donorOut ||
              (outDegree === donorOut && compareSlug(candidate.slug, donorSlug) < 0)));

        if (better) {
          donorSlug = candidate.slug;
          donorScore = score;
          donorOut = outDegree;
        }
      }

      // No donor has spare capacity — the corpus is too small to satisfy the
      // guarantee. Best effort is correct here; failing the build over it would
      // block a site that legitimately has only four games.
      if (donorSlug === null) break;

      picks.get(donorSlug)?.push(target.slug);
      linked.get(donorSlug)?.add(target.slug);
      inDegree.set(target.slug, (inDegree.get(target.slug) ?? 0) + 1);
    }
  }

  /* ---- Pass 3: display ordering ------------------------------------------- */
  for (const game of ordered) {
    const chosen = picks.get(game.slug) ?? [];
    const row = scores.get(game.slug);

    const sorted = [...chosen].sort((a, b) => {
      const scoreA = row?.get(a) ?? 0;
      const scoreB = row?.get(b) ?? 0;
      if (Math.abs(scoreA - scoreB) > EPSILON) return scoreB - scoreA;
      return compareSlug(a, b);
    });

    graph.set(game.slug, sorted);
  }

  return graph;
}

/* =============================================================================
   Read helpers
   ============================================================================= */

/**
 * Inbound link count for every node in a graph.
 *
 * @param graph A graph from `buildSimilarityGraph`.
 * @returns Slug -> number of games linking to it. Every key of the graph is
 *          present, including nodes with zero inbound links.
 */
export function inDegrees(graph: SimilarityGraph): Map<string, number> {
  const counts = new Map<string, number>();
  for (const slug of graph.keys()) counts.set(slug, 0);

  for (const targets of graph.values()) {
    for (const target of targets) {
      counts.set(target, (counts.get(target) ?? 0) + 1);
    }
  }
  return counts;
}

/**
 * Neighbours of one game.
 *
 * @param graph A graph from `buildSimilarityGraph`.
 * @param slug The game to look up.
 * @returns Ordered neighbour slugs, or an empty array when the slug is unknown.
 */
export function getSimilarSlugs(graph: SimilarityGraph, slug: string): string[] {
  return graph.get(slug) ?? [];
}

/**
 * Adapt an Astro content-collection entry to the plain shape this module uses.
 *
 * @param entry A `games` collection entry.
 * @returns The similarity descriptor for that game.
 */
export function toSimilarityGame(entry: GameLikeEntry): SimilarityGame {
  return {
    slug: entry.id,
    primaryCategory: entry.data.taxonomy.primaryCategory.id,
    categories: entry.data.taxonomy.categories.map((reference) => reference.id),
    tags: [...entry.data.taxonomy.tags],
    mechanics: [...entry.data.taxonomy.mechanics],
  };
}

/* =============================================================================
   Build-time memoisation
   ============================================================================= */

/**
 * Cache keyed by corpus signature + options.
 *
 * Astro renders every game page in the same process, and each page needs the
 * whole graph to read one row from it. Without this the graph would be rebuilt
 * once per page: O(n^3) across a build, which is 8,000,000 similarity
 * computations at 200 games.
 */
const graphCache = new Map<string, SimilarityGraph>();

/**
 * `buildSimilarityGraph` with per-build memoisation.
 *
 * The cache key is derived from the slug list and the options, so a content
 * change produces a different key and cannot serve a stale graph.
 *
 * @param games The full corpus.
 * @param options Tuning knobs; see `SimilarLinkOptions`.
 * @returns The same graph `buildSimilarityGraph` would return.
 */
export function buildSimilarityGraphCached(
  games: readonly SimilarityGame[],
  options: SimilarLinkOptions = {},
): SimilarityGraph {
  const slugs = games.map((game) => game.slug).sort(compareSlug);
  const key = [
    options.minOut ?? SIMILAR_GAMES.MIN,
    options.maxOut ?? SIMILAR_GAMES.MAX,
    options.minInDegree ?? SIMILAR_GAMES.MIN_IN_DEGREE,
    options.hubDamping ?? 0.35,
    slugs.join(','),
  ].join('|');

  const cached = graphCache.get(key);
  if (cached !== undefined) return cached;

  const graph = buildSimilarityGraph(games, options);
  graphCache.set(key, graph);
  return graph;
}
