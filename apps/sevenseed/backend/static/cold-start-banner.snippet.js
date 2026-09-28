/**
 * Sevenseed Cold-Start Banner
 * Paste this IIFE immediately after <body> in any venture app/index.html.
 * Change HEALTH_URL to match the venture's own /api/health path.
 */
(function coldStartBanner() {
  'use strict';
  var HEALTH_URL = '/api/health'; // ← change per venture
  var MAX_RETRIES = 10;
  var RETRY_DELAY = 3000;
  var FETCH_TIMEOUT = 3000;
  var attempts = 0;
  var banner = null;

  function showBanner(msg, isError) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cold-start-banner';
      banner.style.cssText =
        'position:fixed;top:0;left:0;right:0;z-index:99999;' +
        'padding:12px 20px;text-align:center;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
        'font-size:14px;font-weight:500;transition:background .3s';
      document.body.prepend(banner);
    }
    banner.style.background = isError ? '#7f1d1d' : '#92400e';
    banner.style.color = isError ? '#fca5a5' : '#fef3c7';
    banner.textContent = msg;
  }

  function hideBanner() {
    if (banner) {
      banner.style.transition = 'opacity .4s';
      banner.style.opacity = '0';
      setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        banner = null;
      }, 400);
    }
  }

  function attempt() {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT);
    fetch(HEALTH_URL, { signal: ctrl.signal })
      .then(function (r) {
        clearTimeout(timer);
        if (r.ok) { hideBanner(); } else { throw new Error('non-2xx'); }
      })
      .catch(function () {
        clearTimeout(timer);
        attempts++;
        if (attempts === 1) {
          showBanner('\u23F3 Waking up the backend (free-tier cold start, up to ~30s)\u2026', false);
        }
        if (attempts >= MAX_RETRIES) {
          showBanner('\u26A0 Backend may be unavailable. Please try refreshing.', true);
          return;
        }
        setTimeout(attempt, RETRY_DELAY);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attempt);
  } else {
    attempt();
  }
})();
