/* ============================================================
   KAYAKALP — WhatsApp Integration
   kayakalp-whatsapp.js
   ============================================================ */

(function () {
  'use strict';

  window.Kayakalp = window.Kayakalp || {};

  // Build WhatsApp URL with contextual pre-filled message
  function buildWhatsAppURL(options) {
    options = options || {};
    const phone = document.querySelector('[data-whatsapp-number]')
      ? document.querySelector('[data-whatsapp-number]').dataset.whatsappNumber
      : '919876543210';

    let message = 'Namaste! 🙏';

    if (options.productName) {
      message += ` I'm interested in *${options.productName}*.`;
    } else {
      message += " I'm interested in Kayakalp's Ayurvedic products.";
    }

    if (options.concern) {
      message += ` My main concern is: ${options.concern}.`;
    }

    if (options.pageURL) {
      message += ` Page: ${options.pageURL}`;
    }

    message += ' Could you help me choose the right formula?';

    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  }

  // Wire up all static WhatsApp links
  function initWhatsAppLinks() {
    const productTitle = document.querySelector('.product-title')
      ? document.querySelector('.product-title').textContent.trim()
      : null;

    const links = document.querySelectorAll('[data-whatsapp-link]');
    links.forEach(function (link) {
      const concern = link.dataset.concern || null;
      link.href = buildWhatsAppURL({
        productName: productTitle,
        concern: concern,
        pageURL: window.location.href
      });
    });
  }

  // Floating button with delayed appearance
  function initFloatingButton() {
    const floatBtn = document.querySelector('.js-whatsapp-float');
    if (!floatBtn) return;

    setTimeout(function () {
      floatBtn.classList.add('is-visible');
    }, 5000);

    floatBtn.addEventListener('click', function () {
      const productTitle = document.querySelector('.product-title')
        ? document.querySelector('.product-title').textContent.trim()
        : null;

      window.open(buildWhatsAppURL({
        productName: productTitle,
        pageURL: window.location.href
      }), '_blank', 'noopener,noreferrer');
    });
  }

  Kayakalp.buildWhatsAppURL = buildWhatsAppURL;

  document.addEventListener('DOMContentLoaded', function () {
    initWhatsAppLinks();
    initFloatingButton();
  });

})();
