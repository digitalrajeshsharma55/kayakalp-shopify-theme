/* ============================================================
   KAYAKALP — Collection Sort
   kayakalp-filters.js
   ============================================================ */

(function () {
  'use strict';

  const sortSelect = document.querySelector('.js-collection-sort');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', function () {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', this.value);
    window.location.href = url.toString();
  });

})();
