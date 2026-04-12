/* ============================================================
   DevVerse — js/features/book-detail.js
   Page: pages/user/book-detail.html
   Depends on: storage.js, navbar.js (loaded before this file)
   ============================================================ */

requireAuth(false);

let currentBook = null;
let currentUser = null;


/* ============================================================
   INIT — called from HTML after scripts load
   ============================================================ */
function initPage() {
  const params = new URLSearchParams(window.location.search);
  const bookId  = params.get('id');

  if (!bookId) {
    window.location.href = '../../pages/user/browse.html';
    return;
  }

  const book = getBookById(bookId);
  const user  = getCurrentUser();

  if (!book) {
    window.location.href = '../../pages/user/browse.html';
    return;
  }

  currentBook = book;
  currentUser = user;

  populatePage(book);
  updateBorrowedUI(book, user);

  document.getElementById('borrow-btn').addEventListener('click', function () {
    handleBorrow(currentBook, currentUser);
  });

  document.getElementById('return-btn').addEventListener('click', openReturnDialog);
  document.getElementById('read-btn').addEventListener('click', openReadDialog);
}


/* ============================================================
   POPULATE PAGE — fill all text/image fields
   ============================================================ */
function populatePage(book) {
  document.title = book.name + ' — DevVerse';

  document.getElementById('book-title').textContent       = book.name;
  document.getElementById('book-author').textContent      = book.author;
  document.getElementById('book-category').textContent    = book.category;
  document.getElementById('book-description').textContent = book.description;

  const img      = document.getElementById('book-img');
  const fallback = document.querySelector('.detail-fallback');

  img.src = book.image || '';

  img.addEventListener('error', function () {
    img.style.display     = 'none';
    fallback.style.display = 'flex';
  });

  if (!book.image) {
    img.style.display     = 'none';
    fallback.style.display = 'flex';
  }
}


/* ============================================================
   BORROW
   ============================================================ */
function handleBorrow(book, user) {
  if (!user) {
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  book.isAvailable = false;
  book.borrowedBy  = user.id;
  book.borrowedAt  = today;
  updateBook(book);

  user.borrowedBooks.push({ bookId: book.id, borrowedAt: today });
  updateUser(user);
  setCurrentUser(user);

  showToast('Book borrowed! Enjoy reading.', 'success');
  updateBorrowedUI(book, user);
}


/* ============================================================
   UI STATE — update badge + buttons based on book state
   ============================================================ */
function updateBorrowedUI(book, user) {
  const borrowBtn    = document.getElementById('borrow-btn');
  const badge        = document.getElementById('availability-badge');
  const returnBtn    = document.getElementById('return-btn');
  const ownedActions = document.getElementById('owned-actions');

  if (book.isAvailable) {
    /* ── AVAILABLE ─────────────────────────────────────── */
    borrowBtn.style.display    = 'inline-block';
    borrowBtn.disabled          = false;
    borrowBtn.textContent       = 'Borrow this Book';
    borrowBtn.className         = 'available-button';
    ownedActions.style.display  = 'none';

    badge.className  = 'badge badge-available';
    badge.textContent = 'AVAILABLE';

  } else if (book.borrowedBy === user.id) {
    /* ── OWNED BY THIS USER ────────────────────────────── */
    borrowBtn.style.display    = 'none';
    borrowBtn.disabled          = true;
    ownedActions.style.display  = 'flex';

    badge.className  = 'badge badge-owned';
    badge.textContent = 'OWNED';

  } else {
    /* ── BORROWED BY SOMEONE ELSE ──────────────────────── */
    borrowBtn.style.display    = 'inline-block';
    borrowBtn.disabled          = true;
    borrowBtn.textContent       = 'Already Borrowed';
    borrowBtn.className         = 'unavailable-button';
    ownedActions.style.display  = 'none';

    badge.className  = 'badge badge-borrowed';
    badge.textContent = 'BORROWED';
  }
}


/* ============================================================
   RETURN DIALOG
   ============================================================ */
function openReturnDialog() {
  const overlay = document.getElementById('delete-overlay');
  if (overlay) overlay.classList.add('open');
}

function closeConfirmDialog() {
  const overlay = document.getElementById('delete-overlay');
  if (overlay) overlay.classList.remove('open');
}

function confirmReturn() {
  closeConfirmDialog();
  if (!currentBook || !currentUser) return;
  handleReturn(currentBook, currentUser);
}

function handleReturn(book, user) {
  book.isAvailable = true;
  book.borrowedBy  = null;
  book.borrowedAt  = null;
  updateBook(book);

  user.borrowedBooks = user.borrowedBooks.filter(function (item) {
    return item.bookId !== book.id;
  });
  updateUser(user);
  setCurrentUser(user);

  showToast('Book returned! Hope you enjoyed it.', 'success');
  updateBorrowedUI(book, user);
}


/* ============================================================
   READ DIALOG — "Not implemented yet"
   ============================================================ */
function openReadDialog() {
  const overlay = document.getElementById('read-overlay');
  if (overlay) overlay.classList.add('open');
}

function closeReadDialog() {
  const overlay = document.getElementById('read-overlay');
  if (overlay) overlay.classList.remove('open');
}

/* Close read dialog on overlay click */
document.addEventListener('DOMContentLoaded', function () {
  const readOverlay = document.getElementById('read-overlay');
  if (readOverlay) {
    readOverlay.addEventListener('click', function (e) {
      if (e.target === readOverlay) closeReadDialog();
    });
  }

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeConfirmDialog();
      closeReadDialog();
    }
  });
});