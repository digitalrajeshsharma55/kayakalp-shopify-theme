/* ============================================================
   KAYAKALP — AJAX Cart & Toast Notifications
   kayakalp-cart.js
   ============================================================ */

(function () {
  'use strict';

  window.Kayakalp = window.Kayakalp || {};

  // ── Toast System ───────────────────────────────────────────
  const toastContainer = document.getElementById('toast-container');

  function showToast(options) {
    if (!toastContainer) return;

    options = Object.assign({
      icon: '🌿',
      title: 'Added to cart!',
      message: '',
      action: 'View Cart',
      actionUrl: '/cart',
      duration: 4000,
      type: ''
    }, options);

    const toast = document.createElement('div');
    toast.className = 'toast' + (options.type ? ' toast--' + options.type : '');
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${options.icon}</span>
      <div class="toast__body">
        <p class="toast__title">${options.title}</p>
        ${options.message ? `<p class="toast__message">${options.message}</p>` : ''}
        ${options.action ? `<a href="${options.actionUrl}" class="toast__action">${options.action} →</a>` : ''}
      </div>
      <button class="toast__close" aria-label="Dismiss notification">✕</button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('is-visible');
      });
    });

    // Auto dismiss
    const timer = setTimeout(function () {
      dismissToast(toast);
    }, options.duration);

    toast.querySelector('.toast__close').addEventListener('click', function () {
      clearTimeout(timer);
      dismissToast(toast);
    });

    return toast;
  }

  function dismissToast(toast) {
    toast.classList.add('is-hiding');
    setTimeout(function () {
      toast.remove();
    }, 400);
  }

  // ── Cart Count Update ──────────────────────────────────────
  function updateCartCount(count) {
    const badge = document.querySelector('.js-cart-count');
    if (!badge) return;

    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'flex';
      Kayakalp.utils.setSession('cartCount', count);
    } else {
      badge.style.display = 'none';
    }
  }

  // ── Add to Cart ────────────────────────────────────────────
  function addToCart(variantId, quantity, button) {
    quantity = quantity || 1;

    if (button) {
      button.classList.add('is-loading');
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Adding…';
    }

    return Kayakalp.utils.postJSON('/cart/add.js', {
      items: [{ id: parseInt(variantId, 10), quantity: quantity }]
    })
    .then(function (data) {
      return Kayakalp.utils.getJSON('/cart.js');
    })
    .then(function (cart) {
      updateCartCount(cart.item_count);
      renderCartDrawer(cart);

      const item = cart.items.find(function (i) {
        return String(i.variant_id) === String(variantId);
      });

      showToast({
        icon: '🌿',
        title: 'Added to cart!',
        message: item ? item.product_title : 'Item added successfully',
        action: 'View Cart',
        actionUrl: '/cart'
      });

      if (button) {
        button.textContent = '✓ Added';
        button.classList.remove('is-loading');
        setTimeout(function () {
          button.textContent = button.dataset.originalText || 'Add to Cart';
          button.disabled = false;
        }, 2000);
      }

      // Open cart drawer
      if (Kayakalp.openCart) Kayakalp.openCart();
    })
    .catch(function (err) {
      showToast({
        icon: '⚠️',
        title: 'Could not add to cart',
        message: 'Please try again or refresh the page.',
        type: 'error',
        action: null
      });

      if (button) {
        button.classList.remove('is-loading');
        button.textContent = button.dataset.originalText || 'Add to Cart';
        button.disabled = false;
      }
    });
  }

  // ── Cart Drawer Render ─────────────────────────────────────
  function renderCartDrawer(cart) {
    const body   = document.querySelector('.js-cart-drawer-body');
    const footer = document.querySelector('.js-cart-drawer-footer');
    const totals = document.querySelector('.js-cart-totals');

    if (!body) return;

    if (!cart.item_count) {
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <span class="cart-drawer__empty-icon">🛒</span>
          <p>Your cart is empty</p>
          <a href="/collections/all" class="btn btn-secondary btn-sm">Shop Now</a>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    const itemsHTML = cart.items.map(function (item) {
      const savings = item.original_line_price - item.line_price;
      return `
        <div class="cart-item" data-key="${item.key}">
          <a href="${item.url}" class="cart-item__image">
            <img src="${item.image}" alt="${item.product_title}" width="80" height="80" loading="lazy">
          </a>
          <div class="cart-item__info">
            <p class="cart-item__name">${item.product_title}</p>
            ${item.variant_title && item.variant_title !== 'Default Title'
              ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
            <div class="cart-item__bottom">
              <div class="cart-item__qty">
                <button class="js-qty-change" data-key="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button>
                <span class="cart-item__qty-num">${item.quantity}</span>
                <button class="js-qty-change" data-key="${item.key}" data-delta="1" aria-label="Increase quantity">+</button>
              </div>
              <span class="price-sale">${Kayakalp.utils.formatPrice(item.line_price)}</span>
            </div>
            <button class="cart-item__remove js-remove-item" data-key="${item.key}" aria-label="Remove ${item.product_title}">Remove</button>
          </div>
        </div>`;
    }).join('');

    body.innerHTML = itemsHTML;
    if (footer) footer.style.display = 'block';

    if (totals) {
      const deliveryNote = cart.total_price >= 69900
        ? '<p style="color:var(--color-success);font-size:var(--text-xs);font-weight:600;">🚚 You qualify for FREE delivery!</p>'
        : `<p style="font-size:var(--text-xs);color:var(--color-text-secondary);">Add ${Kayakalp.utils.formatPrice(69900 - cart.total_price)} more for free delivery</p>`;

      totals.innerHTML = `
        <div class="cart-totals__row">
          <span>Subtotal</span>
          <span>${Kayakalp.utils.formatPrice(cart.total_price)}</span>
        </div>
        ${deliveryNote}`;
    }
  }

  // ── Quantity change / item remove ──────────────────────────
  function changeQuantity(key, newQty) {
    return Kayakalp.utils.postJSON('/cart/change.js', { id: key, quantity: newQty })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        renderCartDrawer(cart);
      })
      .catch(function () {
        showToast({ icon: '⚠️', title: 'Error updating cart', type: 'error', action: null });
      });
  }

  // ── Event Delegation ───────────────────────────────────────
  document.addEventListener('click', function (e) {
    // Add to cart buttons
    const addBtn = e.target.closest('.js-add-to-cart');
    if (addBtn) {
      e.preventDefault();
      const variantId = addBtn.dataset.variantId;
      const qty = parseInt(addBtn.dataset.qty || 1, 10);
      if (variantId) addToCart(variantId, qty, addBtn);
    }

    // Qty change in cart drawer
    const qtyBtn = e.target.closest('.js-qty-change');
    if (qtyBtn) {
      const key = qtyBtn.dataset.key;
      const delta = parseInt(qtyBtn.dataset.delta, 10);
      const numEl = qtyBtn.closest('.cart-item__qty').querySelector('.cart-item__qty-num');
      const current = parseInt(numEl ? numEl.textContent : 1, 10);
      const newQty = Math.max(0, current + delta);
      changeQuantity(key, newQty);
    }

    // Remove item
    const removeBtn = e.target.closest('.js-remove-item');
    if (removeBtn) {
      const key = removeBtn.dataset.key;
      changeQuantity(key, 0);
    }

    // Wishlist toggle
    const wishlistBtn = e.target.closest('.js-wishlist-toggle');
    if (wishlistBtn) {
      const productId = wishlistBtn.dataset.productId;
      const wishlist = Kayakalp.utils.getLocal('wishlist') || [];
      const idx = wishlist.indexOf(String(productId));

      if (idx === -1) {
        wishlist.push(String(productId));
        wishlistBtn.classList.add('is-active');
        showToast({ icon: '♥', title: 'Added to wishlist', action: null, duration: 2500 });
      } else {
        wishlist.splice(idx, 1);
        wishlistBtn.classList.remove('is-active');
      }

      Kayakalp.utils.setLocal('wishlist', wishlist);
    }
  });

  // ── Init: fetch cart on load ───────────────────────────────
  function init() {
    // Restore wishlist state
    const wishlist = Kayakalp.utils.getLocal('wishlist') || [];
    if (wishlist.length) {
      document.querySelectorAll('.js-wishlist-toggle').forEach(function (btn) {
        if (wishlist.includes(String(btn.dataset.productId))) {
          btn.classList.add('is-active');
        }
      });
    }

    // Fetch cart count
    Kayakalp.utils.getJSON('/cart.js').then(function (cart) {
      updateCartCount(cart.item_count);
    }).catch(function () {});
  }

  Kayakalp.addToCart   = addToCart;
  Kayakalp.showToast   = showToast;
  Kayakalp.updateCartCount = updateCartCount;

  document.addEventListener('DOMContentLoaded', init);

})();
