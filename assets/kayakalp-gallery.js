/* ============================================================
   KAYAKALP — Product Image Gallery
   kayakalp-gallery.js
   ============================================================ */

(function () {
  'use strict';

  function initGallery(gallery) {
    const slides    = gallery.querySelectorAll('.product-gallery__main-slide');
    const thumbs    = gallery.querySelectorAll('.product-gallery__thumb');
    const dots      = gallery.querySelectorAll('.product-gallery__mobile-dots .hero__dot');
    const mainWrap  = gallery.querySelector('.js-gallery-main');

    if (!slides.length) return;

    let current  = 0;
    let startX   = 0;

    function goTo(index) {
      index = ((index % slides.length) + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('is-active', i === index);
        thumb.setAttribute('aria-pressed', String(i === index));
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('hero__dot--active', i === index);
      });

      current = index;
    }

    // Thumbnail clicks
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index, 10));
      });
    });

    // Dot clicks
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index, 10));
      });
    });

    // Touch swipe on main
    if (mainWrap) {
      mainWrap.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      mainWrap.addEventListener('touchend', function (e) {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          goTo(current + (diff > 0 ? 1 : -1));
        }
      }, { passive: true });
    }

    // Zoom toggle on desktop
    gallery.querySelectorAll('.js-gallery-zoom').forEach(function (img) {
      img.addEventListener('click', function () {
        this.classList.toggle('is-zoomed');
      });
      img.addEventListener('mouseleave', function () {
        this.classList.remove('is-zoomed');
      });
    });
  }

  // Variant image switching
  function initVariantImages() {
    const form = document.querySelector('.js-product-form');
    if (!form) return;

    form.addEventListener('change', function (e) {
      const input = e.target.closest('.variant-pill-input');
      if (!input) return;

      // Find matching variant and update price/id
      const allInputs = form.querySelectorAll('.variant-pill-input');
      const selected  = {};
      allInputs.forEach(function (i) {
        if (i.checked) selected[i.dataset.optionPosition] = i.value;
      });

      // Update selected option label
      const pos = input.dataset.optionPosition;
      const label = document.querySelector('.js-selected-opt-' + pos);
      if (label) label.textContent = input.value;

      // Find the matching variant in global window.variantData (if available)
      if (window.KayakalpVariants) {
        const variant = window.KayakalpVariants.find(function (v) {
          return v.options.every(function (opt, i) {
            return selected[String(i + 1)] === undefined || selected[String(i + 1)] === opt;
          });
        });

        if (variant) {
          // Update variant ID
          const idInput = form.querySelector('.js-variant-id');
          if (idInput) idInput.value = variant.id;

          // Update price
          const priceEl = document.querySelector('.js-variant-price');
          if (priceEl && variant.price) {
            priceEl.textContent = '₹' + (variant.price / 100).toLocaleString('en-IN');
          }

          // Update Add to Cart button
          const addBtn = form.querySelector('.js-add-to-cart');
          if (addBtn) {
            addBtn.dataset.variantId = variant.id;
            addBtn.disabled = !variant.available;
            addBtn.textContent = variant.available
              ? 'Add to Cart — ₹' + (variant.price / 100).toLocaleString('en-IN')
              : 'Sold Out';
          }

          // Swap to variant image if it exists
          if (variant.featured_image) {
            const gallerySlides = document.querySelectorAll('.product-gallery__main-slide');
            gallerySlides.forEach(function (slide, i) {
              const img = slide.querySelector('img');
              if (img && img.src.includes(variant.featured_image.id)) {
                document.querySelector('.js-gallery').querySelector('.product-gallery').goTo && goTo(i);
              }
            });
          }
        }
      }
    });
  }

  function init() {
    document.querySelectorAll('.js-gallery').forEach(initGallery);
    initVariantImages();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
