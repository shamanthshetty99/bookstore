/**
 * api.js - Shared utilities for calling the Spring Boot backend
 *
 * All JavaScript files import from this file using:
 *   <script src="js/api.js"></script>
 *
 * Base URL points to Spring Boot server running on port 8080.
 */

// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE = 'http://localhost:8080/api';

// ============================================================
// GENERIC FETCH HELPER
// ============================================================

/**
 * apiRequest - a generic wrapper for fetch() calls
 *
 * @param {string} endpoint  - API path (e.g. '/books')
 * @param {string} method    - HTTP method: GET, POST, PUT, DELETE
 * @param {object} body      - request body (for POST/PUT), optional
 * @returns {Promise<object>} - parsed JSON response
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_BASE + endpoint, options);

  // If the response isn't OK, throw an error with the status
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP Error ${response.status}`);
  }

  // Return empty object for 204 No Content responses
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// ============================================================
// BOOKS API
// ============================================================

const BooksAPI = {
  /** Fetch all books (optionally filtered by search keyword) */
  getAll: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/books${query}`);
  },

  /** Fetch single book by ID */
  getById: (id) => apiRequest(`/books/${id}`),

  /** Search books by keyword */
  search: (keyword) => apiRequest(`/books?search=${encodeURIComponent(keyword)}`),
};

// ============================================================
// CART API
// ============================================================

const CartAPI = {
  /** Get all items in cart */
  getItems: () => apiRequest('/cart'),

  /** Add a book to the cart */
  addItem: (bookId, quantity = 1) =>
    apiRequest('/cart', 'POST', { bookId, quantity }),

  /** Remove a cart item by its cart-item ID */
  removeItem: (cartItemId) => apiRequest(`/cart/${cartItemId}`, 'DELETE'),

  /** Update the quantity of a cart item */
  updateQuantity: (cartItemId, quantity) =>
    apiRequest(`/cart/${cartItemId}`, 'PUT', { quantity }),

  /** Get total price of cart */
  getTotal: () => apiRequest('/cart/total'),

  /** Proceed to checkout - places order and clears cart */
  checkout: () => apiRequest('/cart/checkout', 'POST'),
};

// ============================================================
// AUTH API
// ============================================================

const AuthAPI = {
  /** Sign up a new user */
  signup: (username, email, password) =>
    apiRequest('/auth/signup', 'POST', { username, email, password }),

  /** Login a user */
  login: (username, password) =>
    apiRequest('/auth/login', 'POST', { username, password }),
};

// ============================================================
// CART COUNT BADGE (updates navbar cart count)
// ============================================================

async function updateCartBadge() {
  try {
    const items = await CartAPI.getItems();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  } catch (err) {
    // silently fail - badge not critical
  }
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================

/**
 * Show a small notification pop-up at the bottom-right.
 *
 * @param {string} message  - text to display
 * @param {string} type     - 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ============================================================
// STAR RATING HELPER
// ============================================================

/**
 * Generate star rating HTML from a number (e.g. 4.3)
 */
function renderStars(rating) {
  if (!rating) return '';
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// ============================================================
// FORMAT PRICE
// ============================================================

function formatPrice(price) {
  return `$${parseFloat(price).toFixed(2)}`;
}

// ============================================================
// NAVBAR ACTIVE LINK
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Highlight the active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Update cart badge on every page load
  updateCartBadge();
});
