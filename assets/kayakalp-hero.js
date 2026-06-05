/* ============================================================
   KAYAKALP — Hero Carousel
   kayakalp-hero.js
   ============================================================ */

(function () {
  'use strict';

  function initHero(section) {
    const track      = section.querySelector('.js-hero-track');
    const slides     = section.querySelectorAll('.hero__slide');
    const dots       = section.querySelectorAll('.hero__dot');
    const prevBtn    = section.querySelector('.js-hero-prev');
    const nextBtn    = section.querySelector('.js-hero-next');
    const progressBar = section.querySelector('.js-hero-progress-bar');

    if (!track || slides.length < 2) return;

    const totalSlides = slides.length;
    const autoplayMs  = (parseInt(section.dataset.autoplaySpeed, 10) || 6) * 1000;
    const autoplay    = section.dataset.autoplay !== 'false';

    let current   = 0;
    let timer     = null;
    let startX    = 0;
    let isDragging = false;

    function goTo(index) {
      index = ((index % totalSlides) + totalSlides) % totalSlides;

      // Move track
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      // Update aria-hidden on slides
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', String(i !== index));
      });

      // Update dots
      dots.forEach(function (dot, i) {
        dot.classList.toggle('hero__dot--active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });

      current = index;
      resetProgress();
    }

    // Progress bar animation
    function resetProgress() {
      if (!progressBar) return;
      progressBar.classList.remove('is-animating');
      progressBar.style.animationDuration = '';
      // Force reflow
      void progressBar.offsetWidth;
      progressBar.style.animationDuration = autoplayMs + 'ms';
      progressBar.classList.add('is-animating');
    }

    // Auto-advance
    function startTimer() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(function () {
        goTo(current + 1);
      }, autoplayMs);
      resetProgress();
    }

    function stopTimer() {
      clearInterval(timer);
      if (progressBar) {
        progressBar.classList.remove('is-animating');
      }
    }

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      stopTimer(); startTimer();
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      stopTimer(); startTimer();
    });

    // Dot navigation
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.dataset.index, 10);
        goTo(idx);
        stopTimer(); startTimer();
      });
    });

    // Pause on hover
    section.addEventListener('mouseenter', stopTimer);
    section.addEventListener('mouseleave', startTimer);

    // Touch / swipe support
    section.addEventListener('touchstart', function (e) {
      startX   = e.touches[0].clientX;
      isDragging = true;
      stopTimer();
    }, { passive: true });

    section.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      // Prevent vertical scroll hijacking
    }, { passive: true });

    section.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(current + (diff > 0 ? 1 : -1));
      }
      startTimer();
    }, { passive: true });

    // Keyboard navigation
    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(current - 1); stopTimer(); startTimer(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); stopTimer(); startTimer(); }
    });

    // Initial state
    goTo(0);
    startTimer();
  }

  // Init all hero sections on page
  function init() {
    document.querySelectorAll('.hero[data-section-id]').forEach(function (section) {
      initHero(section);
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Shopify theme editor re-init
  document.addEventListener('shopify:section:load', function (e) {
    const section = e.target.querySelector('.hero[data-section-id]');
    if (section) initHero(section);
  });

})();
