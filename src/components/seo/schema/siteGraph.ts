/**
 * Site-level structured data: Organization, WebSite and the SearchAction.
 *
 * Emitted once, on the homepage only. Repeating Organization markup on every
 * page adds bytes to every response without adding anything Google uses.
 */
import { SITE } from '@/config/site';

export type JsonLdObject = Record<string, unknown>;

/**
 * The Organization node for this site.
 *
 * `sameAs` is omitted entirely when there are no social profiles — an empty
 * array is noise that some validators flag.
 */
export function organizationSchema(): JsonLdObject {
  const organization: JsonLdObject = {
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: `${SITE.url}/`,
    description: SITE.description,
    email: SITE.email,
    foundingDate: String(SITE.foundingYear),
  };

  if (SITE.sameAs.length > 0) {
    organization.sameAs = [...SITE.sameAs];
  }

  return organization;
}

/**
 * The WebSite node, including the sitelinks search box action.
 *
 * @param includeSearchAction Set false if the site search page is removed.
 */
export function webSiteSchema(includeSearchAction: boolean = true): JsonLdObject {
  const website: JsonLdObject = {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    description: SITE.description,
    inLanguage: SITE.locale,
    publisher: { '@id': `${SITE.url}/#organization` },
  };

  if (includeSearchAction) {
    website.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return website;
}

/**
 * Both site-level nodes together, for the homepage.
 *
 * @param includeSearchAction Whether to advertise the site search box.
 */
export function siteGraph(includeSearchAction: boolean = true): JsonLdObject[] {
  return [organizationSchema(), webSiteSchema(includeSearchAction)];
}
