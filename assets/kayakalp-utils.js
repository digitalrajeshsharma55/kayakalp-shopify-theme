/* ============================================================
   KAYAKALP — Shared Utilities
   kayakalp-utils.js
   ============================================================ */

window.Kayakalp = window.Kayakalp || {};

Kayakalp.utils = (function () {

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function formatPrice(cents) {
    const rupees = cents / 100;
    return '₹' + rupees.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatMoney(amount) {
    if (typeof amount === 'string') amount = parseFloat(amount);
    return formatPrice(amount * 100);
  }

  function getJSON(url) {
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => {
      if (!r.ok) throw new Error('Network error: ' + r.status);
      return r.json();
    });
  }

  function postJSON(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    }).then(r => {
      if (!r.ok) throw new Error('Network error: ' + r.status);
      return r.json();
    });
  }

  function trapFocus(element) {
    const focusable = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    element.addEventListener('keydown', handler);
    if (first) first.focus();

    return () => element.removeEventListener('keydown', handler);
  }

  function getSavingsPercent(original, sale) {
    if (!original || !sale || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  }

  // Session storage helpers
  function getSession(key) {
    try { return JSON.parse(sessionStorage.getItem('kayakalp_' + key)); }
    catch { return null; }
  }

  function setSession(key, value) {
    try { sessionStorage.setItem('kayakalp_' + key, JSON.stringify(value)); }
    catch { /* Quota or private browsing */ }
  }

  // Local storage helpers
  function getLocal(key) {
    try { return JSON.parse(localStorage.getItem('kayakalp_' + key)); }
    catch { return null; }
  }

  function setLocal(key, value) {
    try { localStorage.setItem('kayakalp_' + key, JSON.stringify(value)); }
    catch { /* Quota */ }
  }

  return {
    debounce,
    throttle,
    formatPrice,
    formatMoney,
    getJSON,
    postJSON,
    trapFocus,
    getSavingsPercent,
    getSession,
    setSession,
    getLocal,
    setLocal
  };
})();
