/* ============================================================
   KAYAKALP — Scroll-triggered Animations (IntersectionObserver)
   kayakalp-scroll.js
   ============================================================ */

(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    // Fallback: make all elements visible immediately
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  function observeAll() {
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Observe on load
  observeAll();

  // Re-observe after Shopify Section Rendering API updates
  document.addEventListener('shopify:section:load', observeAll);

  // Expose for dynamic content
  Kayakalp = window.Kayakalp || {};
  Kayakalp.observeAnimations = observeAll;

})();
