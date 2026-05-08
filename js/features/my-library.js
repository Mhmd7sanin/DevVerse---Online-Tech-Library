/* ============================================================
   my-library.js — User Borrowed Books Page
============================================================ */

if (typeof requireAuth === 'function') {
  requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

/* ── INIT ── */
async function initPage() {

  const user = getCurrentUser();
  if (!user) return;

  const books = await getUserBooks(user);

  updateBookCount(books.length);
  renderLibraryGrid(books);
}

/* ── Get user books ── */
async function getUserBooks(user) {

  if (!user?.borrowedBooks?.length) return [];

  const allBooks = await getBooks();

  return user.borrowedBooks
    .map(entry => {
      // entry is { bookId: "b_001", borrowedAt: "..." }
      const bookCustomId = typeof entry === 'object' ? entry.bookId : entry;
      const book = allBooks.find(b => b.id === bookCustomId);
      return book
        ? { ...book, borrowedAt: typeof entry === 'object' ? entry.borrowedAt : null }
        : null;
    })
    .filter(Boolean);
}

/* ── Render grid ── */
function renderLibraryGrid(books) {

  const grid = document.getElementById('library-grid');
  const emptyState = document.getElementById('empty-state');

  if (!grid || !emptyState) return;

  if (!books.length) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  grid.innerHTML = books.map(buildLibraryCard).join('');
}

/* ── Build card ── */
function buildLibraryCard(book) {

  let icon = '📚';
  if (book.category === 'Frontend') icon = '🎨';
  if (book.category === 'Backend') icon = '⚙️';
  if (book.category === 'Security') icon = '🛡️';
  if (book.category === 'DevOps') icon = '🚀';

  // Link uses MongoDB _id so book-detail page can fetch by _id
  return `
    <a href="book-detail.html?id=${book._id}" class="book-card">
      <div class="book-card__cover">
        <div class="library-cover-box">
          <span>${icon}</span>
          ${book.category?.substring(0, 4).toUpperCase() || ''}
        </div>
      </div>
      <div class="book-card__body">
        <div class="book-card__category">${book.category}</div>
        <h3 class="book-card__title">${book.name}</h3>
        <p class="book-card__author">${book.author}</p>
      </div>
    </a>
  `;
}

/* ── Count update ── */
function updateBookCount(count) {
  const el = document.getElementById('borrow-count');
  if (el) {
    el.textContent = `You have borrowed ${count} book${count !== 1 ? 's' : ''}.`;
  }
}