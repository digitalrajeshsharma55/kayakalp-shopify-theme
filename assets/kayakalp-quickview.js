/* ============================================================
   KAYAKALP — Quick View Modal
   kayakalp-quickview.js
   ============================================================ */

(function () {
  'use strict';

  const backdrop   = document.querySelector('.js-quickview-backdrop');
  const modal      = document.querySelector('.js-quickview-modal');
  const content    = document.querySelector('.js-quickview-content');
  const closeBtn   = document.querySelector('.js-quickview-close');

  if (!backdrop || !modal) return;

  function openQuickView(productUrl) {
    if (!content) return;

    content.innerHTML = '<div style="padding:var(--space-12);text-align:center;"><p style="font-family:var(--font-subheading);font-style:italic;color:var(--color-text-secondary);">Loading…</p></div>';
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    Kayakalp.utils.getJSON(productUrl)
      .then(function (product) {
        const variant = product.variants[0];
        const savings = variant.compare_at_price
          ? Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)
          : 0;

        content.innerHTML = `
          <div class="quickview">
            <div class="quickview__image-wrap">
              ${product.images[0]
                ? `<img src="${product.images[0].src.replace(/\?.*$/, '').replace(/(\.[a-z]+)$/, '_600x600$1')}" alt="${product.title}" width="600" height="600" loading="eager">`
                : '<div style="background:var(--color-bg-secondary);width:100%;height:100%;display:flex;align-items:center;justify-content:center;">🌿</div>'}
            </div>
            <div class="quickview__info">
              <h2 class="quickview__name">${product.title}</h2>
              ${product.metafields && product.metafields.kayakalp
                ? `<p class="quickview__tagline">${product.metafields.kayakalp.benefit_short}</p>`
                : ''}
              <div class="quickview__price-row">
                <span class="price-sale">₹${(variant.price / 100).toLocaleString('en-IN')}</span>
                ${variant.compare_at_price > variant.price
                  ? `<span class="price-original">₹${(variant.compare_at_price / 100).toLocaleString('en-IN')}</span>
                     <span class="price-savings">${savings}% OFF</span>`
                  : ''}
              </div>
              <div class="quickview__cta-row">
                <button class="btn btn-cart js-add-to-cart" data-variant-id="${variant.id}" data-product-title="${product.title}">
                  Add to Cart
                </button>
                <a href="/products/${product.handle}" class="btn btn-ghost">View Full Details</a>
              </div>
              <p class="quickview__view-full" style="margin-top:var(--space-3);">
                <a href="/products/${product.handle}">See all images, ingredients & how to use →</a>
              </p>
            </div>
          </div>`;

        Kayakalp.utils.trapFocus(modal);
      })
      .catch(function () {
        content.innerHTML = '<div style="padding:var(--space-12);text-align:center;"><p>Could not load product. <a href="">Try reloading.</a></p></div>';
      });
  }

  function close() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  // Delegate quick view trigger clicks
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.js-quickview-trigger');
    if (trigger) {
      e.preventDefault();
      openQuickView(trigger.dataset.productUrl);
    }
  });

  closeBtn  && closeBtn.addEventListener('click', close);
  backdrop  && backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

})();
