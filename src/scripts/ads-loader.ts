/**
 * Inline script sources for the ad layer.
 *
 * WHY THESE ARE STRINGS AND NOT REAL CLIENT MODULES
 * -------------------------------------------------
 * Constraint: when ads are switched off the build output must contain zero ad
 * code. A normal Astro `<script>` block is collected and bundled by Vite based
 * on the component graph, which means an ad component that is imported but
 * never rendered can still contribute bytes to a page bundle. That would be an
 * invisible, silent violation.
 *
 * Emitting the JavaScript as an `is:inline` string removes the question
 * entirely: the text only exists in the HTML if the component actually rendered
 * it. It also saves a request, and these scripts are a few hundred bytes.
 *
 * Everything here runs at BUILD time on the server and returns source text.
 */
import { adsConfig } from '@/config/ads';

/**
 * Lazy loader shared by every AdSense slot on a page.
 *
 * Each slot renders an `<ins class="adsbygoogle">` with `data-ad-pending`.
 * This observer pushes a slot into the AdSense queue only when it comes within
 * `lazyRootMargin` of the viewport, then stops watching it. Slots already in
 * view on load are filled immediately, so above-the-fold revenue is unaffected.
 *
 * @returns JavaScript source, ready to inline.
 */
export function buildAdSenseLoaderScript(): string {
  const rootMargin = adsConfig.lazyRootMargin;

  return `(function(){
  var pending = document.querySelectorAll('ins.adsbygoogle[data-ad-pending]');
  if (pending.length === 0) return;
  function fill(el){
    if (el.getAttribute('data-ad-pending') === null) return;
    el.removeAttribute('data-ad-pending');
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) { /* AdSense blocked by an extension — nothing to recover from. */ }
  }
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < pending.length; i++) fill(pending[i]);
    return;
  }
  var io = new IntersectionObserver(function(entries){
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) { fill(entries[i].target); io.unobserve(entries[i].target); }
    }
  }, { rootMargin: '${rootMargin}' });
  for (var j = 0; j < pending.length; j++) io.observe(pending[j]);
})();`;
}

/**
 * Mediavine bootstrap. Mediavine injects its own slots into containers marked
 * with `data-mediavine-placement`, so all this does is load their script.
 *
 * @returns JavaScript source, ready to inline.
 */
export function buildMediavineLoaderScript(): string {
  const siteId = adsConfig.mediavineSiteId;

  return `(function(){
  var s = document.createElement('script');
  s.async = true;
  s.dataset.noptimize = '1';
  s.dataset.cfasync = 'false';
  s.src = 'https://scripts.mediavine.com/tags/${siteId}.js';
  document.head.appendChild(s);
})();`;
}
