/* ============================================================
   KAYAKALP — Sticky Header + Mobile Menu
   kayakalp-sticky.js
   ============================================================ */

(function () {
  'use strict';

  const header   = document.querySelector('.js-site-header');
  const overlay  = document.querySelector('.js-overlay');
  const cartBtn  = document.querySelector('.js-cart-open');
  const cartDrawer = document.querySelector('.js-cart-drawer');
  const cartClose  = document.querySelector('.js-cart-drawer-close');
  const searchBtn  = document.querySelector('.js-search-open');
  const scrollTopBtn = document.querySelector('.js-scroll-top');

  // ── Sticky header ──────────────────────────────────────────
  if (header) {
    let lastScroll = 0;
    const announcementBar = document.querySelector('.announcement-bar');
    const announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;

    window.addEventListener('scroll', Kayakalp.utils.throttle(function () {
      const current = window.scrollY;
      if (current > announcementHeight + 80) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
      lastScroll = current;
    }, 100), { passive: true });
  }

  // ── Scroll to top ──────────────────────────────────────────
  if (scrollTopBtn) {
    window.addEventListener('scroll', Kayakalp.utils.throttle(function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }, 200), { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Mobile Menu ────────────────────────────────────────────
  const menuOpenBtns = document.querySelectorAll('.js-menu-open');
  const menuCloseBtns = document.querySelectorAll('.js-menu-close');
  const mobileMenu = document.querySelector('#mobile-menu');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    overlay && overlay.classList.add('is-active');
    menuOpenBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    Kayakalp._releaseFocus = Kayakalp.utils.trapFocus(mobileMenu);
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    overlay && overlay.classList.remove('is-active');
    menuOpenBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (Kayakalp._releaseFocus) { Kayakalp._releaseFocus(); Kayakalp._releaseFocus = null; }
  }

  menuOpenBtns.forEach(b => b.addEventListener('click', openMenu));
  menuCloseBtns.forEach(b => b.addEventListener('click', closeMenu));
  overlay && overlay.addEventListener('click', function () {
    closeMenu();
    closeCart();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      closeCart();
    }
  });

  // ── Mobile Accordion ───────────────────────────────────────
  const accordionBtns = document.querySelectorAll('.js-mobile-accordion');
  accordionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const sub = this.closest('.mobile-menu__item').querySelector('.mobile-menu__sub');

      // Collapse all others
      accordionBtns.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherSub = other.closest('.mobile-menu__item').querySelector('.mobile-menu__sub');
          if (otherSub) otherSub.classList.remove('is-open');
        }
      });

      this.setAttribute('aria-expanded', String(!isExpanded));
      if (sub) sub.classList.toggle('is-open', !isExpanded);
    });
  });

  // ── Cart Drawer ────────────────────────────────────────────
  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    overlay && overlay.classList.add('is-active');
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    overlay && overlay.classList.remove('is-active');
  }

  cartBtn  && cartBtn.addEventListener('click', openCart);
  cartClose && cartClose.addEventListener('click', closeCart);

  // Expose for cart.js
  Kayakalp.openCart  = openCart;
  Kayakalp.closeCart = closeCart;

  // ── Search Drawer ──────────────────────────────────────────
  const searchDrawer = document.querySelector('.search-drawer');
  const searchClose  = document.querySelector('.search-drawer__close');
  const searchInput  = document.querySelector('.search-drawer__input');

  if (searchBtn && searchDrawer) {
    searchBtn.addEventListener('click', function () {
      searchDrawer.classList.add('is-open');
      document.body.classList.add('no-scroll');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', function () {
      searchDrawer.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    });
  }

  // ── Language Toggle ────────────────────────────────────────
  const langToggle = document.querySelector('.js-lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const current = this.dataset.lang;
      const next = current === 'EN' ? 'HI' : 'EN';
      this.dataset.lang = next;
      this.querySelector('.site-header__lang-label').textContent = next;
      Kayakalp.utils.setSession('lang', next);
      // Language switching would trigger Shopify locale redirect in a real setup
    });

    // Restore preference
    const savedLang = Kayakalp.utils.getSession('lang');
    if (savedLang) {
      langToggle.dataset.lang = savedLang;
      const label = langToggle.querySelector('.site-header__lang-label');
      if (label) label.textContent = savedLang;
    }
  }

})();
