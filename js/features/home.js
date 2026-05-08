/* ============================================================
   home.js — DevVerse Home Page
============================================================ */

/* ── Redirect logged-in users ── */
function redirectIfLoggedIn() {
  const user = getCurrentUser();
  if (!user) return;

  if (user.isAdmin) {
    window.location.replace('pages/admin/dashboard.html');
  } else {
    window.location.replace('pages/user/browse.html');
  }
}

/* ── Build book card ── */
function buildHomeCard(book) {

  const coverHTML = book.image
    ? `<img src="${book.image}" alt="${escapeHTML(book.name)}" loading="lazy" />`
    : `<span class="home-card__placeholder">📚</span>`;

  return `
    <a href="pages/auth/login.html" class="book-card">
      <div class="book-card__cover">
        ${coverHTML}
      </div>
      <div class="book-card__body">
        <p class="book-card__category">${escapeHTML(book.category || '')}</p>
        <h3 class="book-card__title">${book.name}</h3>
        <p class="book-card__author">${escapeHTML(book.author || '')}</p>
      </div>
    </a>
  `;
}

/* ── Render featured books ── */
async function renderFeaturedBooks() {

  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const books = (await getBooks()).slice(0, 12);

  if (!books.length) {
    grid.innerHTML = `<p>No books available.</p>`;
    return;
  }

  grid.innerHTML = books.map(buildHomeCard).join('');
}

/* ── Escape HTML ── */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  redirectIfLoggedIn();
  await renderFeaturedBooks();
});