/* ============================================================
   KAYAKALP — Product Page Tabs
   kayakalp-tabs.js
   ============================================================ */

(function () {
  'use strict';

  function initTabs(tabContainer) {
    const btns   = tabContainer.querySelectorAll('.product-tabs__btn');
    const panels = tabContainer.querySelectorAll('.product-tabs__panel');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('aria-controls');

        // Deactivate all
        btns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('is-active');
          p.hidden = true;
        });

        // Activate clicked
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('is-active');
          target.hidden = false;
        }
      });

      // Keyboard: left/right arrow navigation
      btn.addEventListener('keydown', function (e) {
        const all = Array.from(btns);
        const idx = all.indexOf(this);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          all[(idx + 1) % all.length].focus();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          all[(idx - 1 + all.length) % all.length].focus();
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('.js-tabs').forEach(initTabs);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
