/**
 * book-details.js — Book Detail page logic
 */

let selectedQty = 1;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = 'index.html'; return; }
  loadBook(id);
});

async function loadBook(id) {
  try {
    const book = await BooksAPI.getById(id);
    renderBook(book);
    document.title = `${book.title} — PageTurn`;
  } catch {
    document.getElementById('detailContainer').innerHTML = `
      <div style="text-align:center; padding:4rem; color:var(--danger);">
        <p style="font-size:2rem">⚠️</p>
        <p><strong>Book not found.</strong></p>
        <a href="index.html" class="btn btn-secondary" style="display:inline-flex; margin-top:1.5rem;">← Browse Books</a>
      </div>`;
  }
}

function renderBook(book) {
  const img   = book.imageUrl || 'https://via.placeholder.com/260x390?text=No+Cover';
  const stars = book.rating ? renderStars(book.rating) : '';

  document.getElementById('detailContainer').innerHTML = `
    <div class="book-detail-card">
      <div>
        <img class="book-detail-img" src="${img}" alt="${esc(book.title)}"
             onerror="this.src='https://via.placeholder.com/260x390?text=No+Cover'" />
      </div>
      <div class="book-detail-info">
        <div class="meta-row">
          ${book.genre ? `<span class="genre-tag">${book.genre}</span>` : ''}
          ${book.rating ? `<div class="rating-badge"><span class="stars">${stars}</span><span>${book.rating} / 5</span></div>` : ''}
        </div>
        <h1>${esc(book.title)}</h1>
        <p class="author">by <strong>${esc(book.author)}</strong></p>
        <hr class="divider"/>
        <p class="description">${esc(book.description || 'No description available.')}</p>
        <div class="book-detail-price">${book.price.toFixed(2)}</div>
        <div class="qty-selector">
          <span class="qty-label">Qty:</span>
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-display" id="qtyDisplay">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="addToCart(${book.id})" id="addBtn">🛒 Add to Cart</button>
          <a href="cart.html" class="btn btn-outline">View Cart</a>
        </div>
      </div>
    </div>`;
}

function changeQty(delta) {
  selectedQty = Math.max(1, selectedQty + delta);
  document.getElementById('qtyDisplay').textContent = selectedQty;
}

async function addToCart(bookId) {
  const btn = document.getElementById('addBtn');
  btn.disabled = true;
  btn.textContent = 'Adding…';

  try {
    await CartAPI.addItem(bookId, selectedQty);
    showToast(`Added ${selectedQty} item(s) to cart!`, 'success');
    updateCartBadge();
    btn.textContent = '✓ Added!';
    setTimeout(() => { btn.disabled = false; btn.innerHTML = '🛒 Add to Cart'; }, 1500);
  } catch {
    showToast('Failed to add to cart.', 'error');
    btn.disabled = false;
    btn.innerHTML = '🛒 Add to Cart';
  }
}

function esc(text) {
  if (!text) return '';
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
