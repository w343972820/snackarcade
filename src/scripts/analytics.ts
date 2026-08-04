/**
 * Inline script sources for consent and analytics.
 *
 * Same reasoning as `ads-loader.ts`: these are build-time functions returning
 * JavaScript source text, so nothing is emitted unless the component that calls
 * them actually renders. With no GA4 id and ads switched off, the delivered
 * site ships zero third-party JavaScript.
 */
import { analyticsConfig, CONSENT_DENIED_REGIONS } from '@/config/analytics';

/**
 * Consent Mode v2 defaults.
 *
 * This MUST be the first script in the document. Google's rule is that consent
 * defaults have to be set before gtag.js or the AdSense tag runs; if they load
 * first, the visitor is counted as consented and the site is out of compliance
 * in the EEA, the UK and Switzerland.
 *
 * Everything is denied in those regions and granted elsewhere. `security_storage`
 * is always granted — it covers fraud prevention, which consent cannot waive.
 *
 * @returns JavaScript source, ready to inline.
 */
export function buildConsentBootstrapScript(): string {
  const regions = JSON.stringify(CONSENT_DENIED_REGIONS);

  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  personalization_storage:'denied',
  security_storage:'granted',
  region:${regions},
  wait_for_update:500
});
gtag('consent','default',{
  ad_storage:'granted',
  ad_user_data:'granted',
  ad_personalization:'granted',
  analytics_storage:'granted',
  functionality_storage:'granted',
  personalization_storage:'granted',
  security_storage:'granted'
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);`;
}

/**
 * GA4 bootstrap, loaded once the browser is idle.
 *
 * Deferring to `requestIdleCallback` keeps gtag.js off the critical path. It
 * costs a small number of very-short sessions in the report and buys measurable
 * LCP and INP, which is the right trade for a site that lives on search traffic.
 *
 * @returns JavaScript source, ready to inline.
 */
export function buildAnalyticsScript(): string {
  const id = analyticsConfig.measurementId;
  const immediate = analyticsConfig.loadStrategy === 'immediate';

  const body = `(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', '${id}', { anonymize_ip: true });
})()`;

  if (immediate) {
    return `${body};`;
  }

  return `if ('requestIdleCallback' in window) { requestIdleCallback(function(){ ${body}; }, { timeout: 4000 }); }
else { window.addEventListener('load', function(){ setTimeout(function(){ ${body}; }, 1200); }); }`;
}

/**
 * Small helper exposed to game pages so they can report custom events without
 * knowing whether analytics is switched on.
 *
 * When analytics is off this returns an empty string and nothing is emitted.
 *
 * @returns JavaScript source, ready to inline, or '' when analytics is off.
 */
export function buildEventHelperScript(): string {
  if (!analyticsConfig.enabled) return '';

  return `window.saTrack = function(name, params){
  if (typeof gtag !== 'function') return;
  try { gtag('event', name, params || {}); } catch (e) {}
};`;
}
