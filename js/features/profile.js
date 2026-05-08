/* ============================================================
   profile.js — User Profile Page
============================================================ */

if (typeof requireAuth === 'function') {
  requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

/* ── INIT ── */
async function initPage() {

  const user = getCurrentUser();
  if (!user) return;

  populateProfile(user);
  await renderBorrowedList(user);
}

/* ── PROFILE INFO ── */
function populateProfile(user) {

  document.getElementById('profile-username').textContent = `@${user.username}`;
  document.getElementById('profile-email').textContent = user.email;

  const initials = user.username.substring(0, 2).toUpperCase();
  document.getElementById('profile-initials').textContent = initials;

  document.getElementById('profile-since').textContent =
    formatDate(user.createdAt);

  document.getElementById('profile-count').textContent =
    `${user.borrowedBooks?.length || 0} titles`;
}

/* ── BORROWED LIST ── */
async function renderBorrowedList(user) {

  const container = document.getElementById('borrowed-list');
  if (!container) return;

  if (!user.borrowedBooks?.length) {
    container.innerHTML = `<p>No books currently borrowed.</p>`;
    return;
  }

  const allBooks = await getBooks();

  const items = user.borrowedBooks
    .map(entry => {
      // entry is { bookId: "b_001", borrowedAt: "..." }
      const bookCustomId = typeof entry === 'object' ? entry.bookId : entry;
      const borrowedAt   = typeof entry === 'object' ? entry.borrowedAt : null;
      const book = allBooks.find(b => b.id === bookCustomId);
      return book ? buildBorrowedItem(book, borrowedAt) : '';
    })
    .join('');

  container.innerHTML = items || `<p>No books currently borrowed.</p>`;
}

/* ── ITEM CARD ── */
function buildBorrowedItem(book, borrowedAt) {

  let icon = '📚';
  if (book.category === 'Frontend') icon = '🎨';
  if (book.category === 'Backend') icon = '⚙️';
  if (book.category === 'Security') icon = '🛡️';
  if (book.category === 'DevOps') icon = '🚀';

  return `
    <a href="book-detail.html?id=${book._id}" class="borrowed-item">
      <div class="borrowed-item__cover">
        <span>${icon}</span>
      </div>
      <div class="borrowed-item__info">
        <div class="borrowed-item__category">${book.category}</div>
        <div class="borrowed-item__title">${book.name}</div>
        <div class="borrowed-item__author">${book.author}</div>
        <div class="borrowed-item__date">
          📅 Borrowed ${formatDate(borrowedAt)}
        </div>
      </div>
    </a>
  `;
}

/* ── DATE FORMAT ── */
function formatDate(dateString) {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}