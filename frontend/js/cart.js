/**
 * cart.js — Shopping Cart + Address Modal logic
 *
 * Handles:
 *  - Rendering cart items in new grid layout
 *  - Quantity increase / decrease / remove
 *  - Opening the checkout modal
 *  - Populating modal order summary
 *  - Address form validation
 *  - Shipping cost based on delivery type
 *  - Submitting order to backend
 */

// ─── State ───────────────────────────────────────────────────
let cartItems     = [];
let cartSubtotal  = 0;

// Shipping costs keyed by <select> value
const SHIPPING_COSTS = {
  standard:  49,
  express:   99,
  overnight: 199,
};

// ─── On Page Load ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadCart);

// ─── Load Cart ───────────────────────────────────────────────
async function loadCart() {
  const container = document.getElementById('cartContainer');
  container.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';

  try {
    cartItems = await CartAPI.getItems();

    if (cartItems.length === 0) {
      document.getElementById('cartSubtitle').textContent = '';
      renderEmptyCart(container);
    } else {
      const count = cartItems.reduce((s, i) => s + i.quantity, 0);
      document.getElementById('cartSubtitle').textContent =
        `${count} item${count !== 1 ? 's' : ''} in your cart`;
      renderCart(container);
    }

    updateCartBadge();
  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--danger);">
        <p style="font-size:1.5rem;">⚠️</p>
        <p><strong>Could not load cart.</strong> Make sure the Spring Boot server is running on port 8080.</p>
      </div>`;
  }
}

// ─── Empty State ─────────────────────────────────────────────
function renderEmptyCart(container) {
  container.innerHTML = `
    <div class="cart-empty">
      <span class="empty-icon">🛒</span>
      <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.9rem; color:var(--charcoal); margin-bottom:.6rem;">
        Your cart is empty
      </h2>
      <p style="margin-bottom:1.8rem;">You haven't added any books yet. Start browsing!</p>
      <a href="index.html" class="btn btn-primary">Browse Books</a>
    </div>`;
}

// ─── Render Full Cart ─────────────────────────────────────────
function renderCart(container) {
  cartSubtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const shipping = getShippingCost();
  const total    = cartSubtotal + shipping;

  const rows = cartItems.map(createCartRowHTML).join('');

  container.innerHTML = `
    <div class="cart-layout">

      <!-- Left: items panel -->
      <div>
        <div class="cart-items-panel">
          <div class="cart-items-header">
            <span>Book</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>
          <div id="cartRows">${rows}</div>
        </div>
      </div>

      <!-- Right: summary sidebar -->
      <div>
        <div class="cart-summary">
          <h3>Order Summary</h3>

          <div class="summary-row">
            <span>Subtotal</span>
            <span class="summary-val" id="summarySubtotal">$${cartSubtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span class="summary-val" id="summaryShipping">$${shipping.toFixed(2)}</span>
          </div>

          ${cartSubtotal >= 35
            ? `<div class="free-shipping-note">🎉 You qualify for free standard shipping!</div>`
            : `<div style="font-size:.78rem; color:var(--text-light); padding:.4rem 0;">
                 Add $${(35 - cartSubtotal).toFixed(2)} more for free shipping
               </div>`
          }

          <div class="summary-row total">
            <span>Total</span>
            <span class="summary-val" id="summaryTotal">$${total.toFixed(2)}</span>
          </div>

          <button
            class="btn btn-success"
            style="width:100%; margin-top:1.5rem;"
            onclick="openCheckoutModal()"
            id="checkoutBtn"
          >
            Checkout →
          </button>

          <a href="index.html"
             style="display:block; text-align:center; margin-top:1rem;
                    font-size:.83rem; color:var(--text-light); cursor:pointer;">
            ← Continue Shopping
          </a>
        </div>
      </div>

    </div>`;
}

// ─── Build one cart row ───────────────────────────────────────
function createCartRowHTML(item) {
  const book     = item.book;
  const imgSrc   = book.imageUrl || 'https://via.placeholder.com/50x68?text=📖';
  const subtotal = (book.price * item.quantity).toFixed(2);

  return `
    <div class="cart-item-row" id="row-${item.id}">
      <!-- Book info -->
      <div class="cart-book-info">
        <img class="cart-book-img"
             src="${imgSrc}"
             alt="${esc(book.title)}"
             onerror="this.src='https://via.placeholder.com/50x68?text=📖'" />
        <div>
          <div class="cart-book-title">${esc(book.title)}</div>
          <div class="cart-book-author">by ${esc(book.author)}</div>
        </div>
      </div>
      <!-- Unit price -->
      <div class="cart-unit-price">$${book.price.toFixed(2)}</div>
      <!-- Qty controls -->
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity}, -1)" title="Decrease">−</button>
        <span class="qty-display" id="qty-${item.id}">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity}, 1)" title="Increase">+</button>
      </div>
      <!-- Row total -->
      <div class="cart-row-total" id="rowtotal-${item.id}">$${subtotal}</div>
      <!-- Remove -->
      <div>
        <button class="btn btn-danger" onclick="removeItem(${item.id})" title="Remove item">🗑</button>
      </div>
    </div>`;
}

// ─── Change quantity ──────────────────────────────────────────
async function changeQty(cartItemId, currentQty, delta) {
  const newQty = currentQty + delta;

  try {
    if (newQty <= 0) {
      await removeItem(cartItemId);
      return;
    }
    await CartAPI.updateQuantity(cartItemId, newQty);
    await loadCart();
  } catch {
    showToast('Could not update quantity.', 'error');
  }
}

// ─── Remove item ──────────────────────────────────────────────
async function removeItem(cartItemId) {
  const row = document.getElementById(`row-${cartItemId}`);
  if (row) { row.style.opacity = '0.4'; row.style.transition = 'opacity .25s'; }

  try {
    await CartAPI.removeItem(cartItemId);
    showToast('Item removed.', 'info');
    await loadCart();
  } catch {
    showToast('Could not remove item.', 'error');
    if (row) row.style.opacity = '1';
  }
}

// ─── Shipping cost helper ─────────────────────────────────────
function getShippingCost() {
  const sel = document.getElementById('deliveryType');
  const key = sel ? sel.value : 'standard';
  // Free standard shipping above $35
  if (key === 'standard' && cartSubtotal >= 35) return 0;
  return SHIPPING_COSTS[key] || 49;
}

/** Called when delivery type dropdown changes inside the modal */
function updateShipping() {
  const shipping = getShippingCost();
  const total    = cartSubtotal + shipping;

  const el = document.getElementById('modalShipping');
  const te = document.getElementById('modalTotal');
  if (el) el.textContent = `$${shipping.toFixed(2)}`;
  if (te) te.textContent = `$${total.toFixed(2)}`;
}

// ─── Open Checkout Modal ──────────────────────────────────────
async function openCheckoutModal() {
  // Refresh cart data for accurate summary
  cartItems = await CartAPI.getItems();
  cartSubtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);

  const shipping = getShippingCost();
  const total    = cartSubtotal + shipping;

  // Populate mini order summary
  const itemsEl = document.getElementById('modalOrderItems');
  if (itemsEl) {
    itemsEl.innerHTML = cartItems.map(item => `
      <div class="modal-order-item">
        <span class="item-name">${esc(item.book.title)} × ${item.quantity}</span>
        <span>$${(item.book.price * item.quantity).toFixed(2)}</span>
      </div>`).join('');
  }

  const sub = document.getElementById('modalSubtotal');
  const shi = document.getElementById('modalShipping');
  const tot = document.getElementById('modalTotal');
  if (sub) sub.textContent = `$${cartSubtotal.toFixed(2)}`;
  if (shi) shi.textContent = `$${shipping.toFixed(2)}`;
  if (tot) tot.textContent = `$${total.toFixed(2)}`;

  // Open modal
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ─── Close Modal ──────────────────────────────────────────────
function closeModal() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

/** Close when clicking outside the modal box */
function handleOverlayClick(e) {
  if (e.target === document.getElementById('checkoutModal')) closeModal();
}

/** Escape key closes modal */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── Address Form Validation ──────────────────────────────────
function validateForm() {
  let valid = true;

  const fields = [
    { id: 'firstName',  errId: 'firstNameErr',  label: 'First name',     type: 'text' },
    { id: 'lastName',   errId: 'lastNameErr',   label: 'Last name',      type: 'text' },
    { id: 'email',      errId: 'emailErr',      label: 'Email',          type: 'email' },
    { id: 'phone',      errId: 'phoneErr',      label: 'Phone',          type: 'phone' },
    { id: 'address1',   errId: 'address1Err',   label: 'Street address', type: 'text' },
    { id: 'city',       errId: 'cityErr',       label: 'City',           type: 'text' },
    { id: 'state',      errId: 'stateErr',      label: 'State',          type: 'select' },
    { id: 'pincode',    errId: 'pincodeErr',    label: 'PIN code',       type: 'pincode' },
  ];

  // Clear previous errors
  fields.forEach(f => {
    const inp = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (inp) inp.classList.remove('error');
    if (err) err.textContent = '';
  });

  fields.forEach(({ id, errId, label, type }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el) return;

    const val = el.value.trim();

    if (!val) {
      setFieldError(el, err, `${label} is required.`);
      valid = false;
      return;
    }

    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setFieldError(el, err, 'Enter a valid email address.');
      valid = false;
    }

    if (type === 'phone' && !/^[+\d\s\-()]{7,15}$/.test(val)) {
      setFieldError(el, err, 'Enter a valid phone number.');
      valid = false;
    }

    if (type === 'pincode' && !/^\d{6}$/.test(val)) {
      setFieldError(el, err, 'PIN code must be 6 digits.');
      valid = false;
    }
  });

  return valid;
}

function setFieldError(input, errEl, message) {
  if (input) input.classList.add('error');
  if (errEl) errEl.textContent = message;
}

// ─── Submit Order ─────────────────────────────────────────────
async function submitOrder() {
  if (!validateForm()) {
    // Scroll to first error inside modal
    const firstErr = document.querySelector('.modal-box .form-input.error, .modal-box .form-select.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const btn = document.getElementById('submitOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Placing Order…';

  try {
    // Call the checkout API (clears the cart server-side)
    const result = await CartAPI.checkout();

    // Gather address details to pass to success page
    const orderData = {
      orderId:      result.orderId,
      itemCount:    result.itemCount,
      totalAmount:  cartSubtotal + getShippingCost(),
      deliveryType: document.getElementById('deliveryType').value,
      address: {
        name:     `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
        line1:    document.getElementById('address1').value.trim(),
        line2:    document.getElementById('address2').value.trim(),
        city:     document.getElementById('city').value.trim(),
        state:    document.getElementById('state').value,
        pincode:  document.getElementById('pincode').value.trim(),
        phone:    document.getElementById('phone').value.trim(),
      },
      notes: document.getElementById('orderNotes').value.trim(),
    };

    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Navigate to success page
    window.location.href = 'checkout.html';

  } catch (err) {
    showToast('Order failed. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order →';
  }
}

// ─── Utility ─────────────────────────────────────────────────
function esc(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
