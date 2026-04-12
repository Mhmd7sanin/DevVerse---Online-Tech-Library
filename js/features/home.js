/* ============================================================
   home.js — Logic for pages/index.html
   Dependencies (loaded before this file):
     - storage.js  → getBooks(), getCurrentUser()
     - navbar.js   → already called, handles nav rendering
   ============================================================ */

/* ── 1. Redirect logged-in users away from home ── */
function redirectIfLoggedIn() {
  const user = getCurrentUser();
  if (!user) return;
  if (user.isAdmin) {
    window.location.replace('/pages/admin/dashboard.html');
  } else {
    window.location.replace('/pages/user/browse.html');
  }
}

/* ── 2. Build one book card HTML string ──
   - Links to login (guest preview only — no details access)
   - No availability label (public preview) */
function buildHomeCard(book) {
  const coverHTML = book.cover
    ? `<img src="${book.cover}" alt="${escapeHTML(book.title)}" loading="lazy" />`
    : `<span class="home-card__placeholder" aria-hidden="true">
         <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              style="color:var(--color-border-md)">
           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
         </svg>
       </span>`;

  return `
    <a href="/pages/auth/login.html" class="book-card" title="${escapeHTML(book.title)}">
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

/* ── 3. Render up to 10 books into #featured-grid ── */
function renderFeaturedBooks() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const books = getBooks().slice(0, 12);

  if (books.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">📚</div>
        <p class="empty-state__title">No books yet</p>
        <p class="empty-state__msg">Check back soon — the library is being stocked.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = books.map(buildHomeCard).join('');
}

/* ── Tiny HTML escape helper ── */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Init ── */
redirectIfLoggedIn();
renderFeaturedBooks();
