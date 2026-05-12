/**
 * index.js — Homepage logic
 * Handles book fetching, rendering, search, and genre filtering.
 */

let allBooks = [];

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAllBooks();

  document.getElementById('searchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSearch();
  });
});

// ─── Load All Books ───────────────────────────────────────────
async function loadAllBooks() {
  const container = document.getElementById('booksContainer');
  container.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';

  document.getElementById('sectionTitle').textContent = 'All Books';
  document.getElementById('searchInput').value = '';
  document.getElementById('clearSearchBtn').style.display = 'none';
  document.querySelectorAll('.genre-pill').forEach((p, i) => {
    p.classList.toggle('active', i === 0);
  });

  try {
    allBooks = await BooksAPI.getAll();
    renderBooks(allBooks);
  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center; padding:4rem; color:var(--danger);">
        <p style="font-size:2.5rem;">⚠️</p>
        <p style="font-size:1.05rem;"><strong>Cannot reach the server.</strong></p>
        <p style="color:var(--text-light); margin-top:.5rem;">
          Start Spring Boot at <code style="background:var(--ivory-dark); padding:2px 8px; border-radius:4px;">http://localhost:8080</code> then refresh.
        </p>
      </div>`;
  }
}

// ─── Search ───────────────────────────────────────────────────
async function handleSearch() {
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) { loadAllBooks(); return; }

  const container = document.getElementById('booksContainer');
  container.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  document.getElementById('sectionTitle').textContent = `Results for "${keyword}"`;
  document.getElementById('clearSearchBtn').style.display = 'inline-flex';
  document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));

  try {
    const books = await BooksAPI.search(keyword);
    renderBooks(books);
  } catch {
    showToast('Search failed. Please try again.', 'error');
  }
}

// ─── Genre filter ─────────────────────────────────────────────
function filterByGenre(genre, pillEl) {
  document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
  pillEl.classList.add('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('clearSearchBtn').style.display = 'none';

  const filtered = genre
    ? allBooks.filter(b => b.genre && b.genre.toLowerCase() === genre.toLowerCase())
    : allBooks;

  document.getElementById('sectionTitle').textContent = genre || 'All Books';
  renderBooks(filtered);
}

// ─── Render Grid ──────────────────────────────────────────────
function renderBooks(books) {
  const container = document.getElementById('booksContainer');
  const countEl   = document.getElementById('bookCount');

  countEl.textContent = `${books.length} title${books.length !== 1 ? 's' : ''}`;

  if (books.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:4rem 2rem; color:var(--text-light);">
        <p style="font-size:2.5rem; margin-bottom:1rem;">📖</p>
        <p style="font-size:1.05rem; font-family:'Cormorant Garamond',serif; color:var(--charcoal);">No books found.</p>
        <p style="margin-top:.5rem;">Try a different search term or browse all categories.</p>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="books-grid">${books.map(bookCardHTML).join('')}</div>`;
}

// ─── Book Card HTML ───────────────────────────────────────────
function bookCardHTML(book) {
  const img    = book.imageUrl || 'https://via.placeholder.com/210x315?text=No+Cover';
  const stars  = book.rating ? renderStars(book.rating) : '';
  const rating = book.rating
    ? `<div class="book-card-rating">
         <span class="stars">${stars}</span>
         <span class="rating-num">${book.rating}</span>
       </div>` : '';
  const genre = book.genre
    ? `<span class="book-card-genre">${book.genre}</span>` : '';

  return `
    <div class="book-card" onclick="goToDetails(${book.id})">
      <div class="book-card-img-wrap">
        <img src="${img}" alt="${esc(book.title)}"
             onerror="this.src='https://via.placeholder.com/210x315?text=No+Cover'"
             loading="lazy" />
        ${genre}
      </div>
      <div class="book-card-body">
        <h3 class="book-card-title">${esc(book.title)}</h3>
        <p class="book-card-author">by ${esc(book.author)}</p>
        ${rating}
        <div class="book-card-footer">
          <span class="book-price">${book.price.toFixed(2)}</span>
          <button class="btn-details" onclick="event.stopPropagation(); goToDetails(${book.id})">
            View →
          </button>
        </div>
      </div>
    </div>`;
}

function goToDetails(id) {
  window.location.href = `book-details.html?id=${id}`;
}

function esc(text) {
  if (!text) return '';
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
