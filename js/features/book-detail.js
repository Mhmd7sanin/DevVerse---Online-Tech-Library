/* ============================================================
   book-detail.js 
============================================================ */

requireAuth(false);

let currentBook = null;
let currentUser = null;


document.addEventListener('DOMContentLoaded', initPage);

async function initPage() {

  const params = new URLSearchParams(window.location.search);

  
  const bookId = params.get('id');

  if (!bookId) {

    window.location.href =
      '../../pages/user/browse.html';

    return;
  }

  try {

    const book = await getBookById(bookId);

    const user = getCurrentUser();

    if (!book) {

      window.location.href =
        '../../pages/user/browse.html';

      return;
    }

    currentBook = book;
    currentUser = user;

    populatePage(book);

    updateBorrowedUI(book, user);

    setupButtons();

  } catch (error) {

    console.error(error);

    showToast(
      'Failed to load book.',
      'danger'
    );
  }
}


/* ============================================================
   SETUP BUTTONS
============================================================ */

function setupButtons() {

  const borrowBtn = document.getElementById('borrow-btn');
  const returnBtn = document.getElementById('return-btn');
  const readBtn   = document.getElementById('read-btn');

  if (borrowBtn) {

    borrowBtn.addEventListener('click', function () {

      handleBorrow(currentBook, currentUser);
    });
  }

  if (returnBtn) {

    returnBtn.addEventListener('click', function () {

      openReturnDialog();
    });
  }

  if (readBtn) {

    readBtn.addEventListener('click', function () {

      openReadDialog();
    });
  }
}


/* ============================================================
   POPULATE PAGE
============================================================ */

function populatePage(book) {

  document.title = book.name + ' — DevVerse';

  document.getElementById('book-title').textContent =
    book.name || '';

  document.getElementById('book-author').textContent =
    book.author || '';

  document.getElementById('book-category').textContent =
    book.category || '';

  document.getElementById('book-description').textContent =
    book.description || '';

  const img =
    document.getElementById('book-img');

  const fallback =
    document.querySelector('.detail-fallback');

  if (!img) return;

  img.src = book.image || '';

  img.addEventListener('error', function () {

    img.style.display = 'none';

    if (fallback) {
      fallback.style.display = 'flex';
    }
  });

  if (!book.image) {

    img.style.display = 'none';

    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
}


/* ============================================================
   BORROW BOOK
============================================================ */

async function handleBorrow(book, user) {

  if (!user) {

    window.location.href =
      '../../pages/auth/login.html';

    return;
  }

  try {

    const today =
      new Date().toISOString().split('T')[0];

    /*
      IMPORTANT

      book._id = MongoDB id
      user._id = MongoDB id

      Backend stores:
      borrowedBy = user.id (u_001)
    */

    const updatedBook = await borrowBook(
      book._id,
      user._id,
      today
    );

    currentBook = updatedBook;

    /*
      Session already updated in storage.js
    */

    currentUser = getCurrentUser();

    updateBorrowedUI(
      currentBook,
      currentUser
    );

    showToast(
      'Book borrowed successfully.',
      'success'
    );

  } catch (error) {

    console.error(error);

    showToast(
      error.message || 'Failed to borrow book.',
      'danger'
    );
  }
}


/* ============================================================
   RETURN BOOK
============================================================ */

async function handleReturn(book, user) {
  try {
    const updatedBook = await returnBook(book._id, user._id);

    currentBook = updatedBook;
    currentUser = getCurrentUser();

    showToast('Book returned successfully.', 'success');
    updateBorrowedUI(currentBook, currentUser);

  } catch (error) {
    console.error(error);
    showToast('Failed to return book.', 'danger');
  }
}


/* ============================================================
   RETURN DIALOG CONTROL (USES delete-overlay)
============================================================ */

function openReturnDialog() {
  const overlay = document.getElementById('delete-overlay');
  if (overlay) overlay.style.display = 'flex';
}


function closeConfirmDialog() {
  const overlay = document.getElementById('delete-overlay');
  if (overlay) overlay.style.display = 'none';
}


async function confirmReturn() {
  try {
    await handleReturn(currentBook, currentUser);

    closeConfirmDialog();

  } catch (error) {
    console.error(error);
    showToast('Failed to return book.', 'danger');
  }
}


/* ============================================================
   UI STATE
============================================================ */

function updateBorrowedUI(book, user) {

  const borrowBtn =
    document.getElementById('borrow-btn');

  const badge =
    document.getElementById('availability-badge');

  const ownedActions =
    document.getElementById('owned-actions');

  if (!borrowBtn || !badge || !ownedActions) {
    return;
  }

  /*
    IMPORTANT

    borrowedBy now stores:
    user.id (u_001)

    NOT user._id
  */

  const isOwner =
    user &&
    (
      book.borrowedBy === user.id ||
      book.borrowedBy === user._id
    );

  /* ================= AVAILABLE ================= */

  if (book.isAvailable) {

    borrowBtn.style.display = 'inline-block';

    borrowBtn.disabled = false;

    borrowBtn.textContent =
      'Borrow this Book';

    borrowBtn.className =
      'available-button';

    ownedActions.style.display = 'none';

    badge.className =
      'badge badge-available';

    badge.textContent =
      'AVAILABLE';

    return;
  }

  /* ================= OWNED ================= */

  if (isOwner) {

    borrowBtn.style.display = 'none';

    ownedActions.style.display = 'flex';

    badge.className =
      'badge badge-owned';

    badge.textContent =
      'OWNED';

    return;
  }

  /* ================= BORROWED ================= */

  borrowBtn.style.display = 'inline-block';

  borrowBtn.disabled = true;

  borrowBtn.textContent =
    'Already Borrowed';

  borrowBtn.className =
    'unavailable-button';

  ownedActions.style.display = 'none';

  badge.className =
    'badge badge-borrowed';

  badge.textContent =
    'BORROWED';
}


/* ============================================================
   READ DIALOG
============================================================ */

function openReadDialog() {

  const dialog = document.getElementById('read-overlay');

  if (!dialog) {
    console.warn('Read dialog not found in HTML');
    return;
  }

  dialog.classList.add('open');

  const closeBtn = dialog.querySelector('.close-dialog');
  const okBtn = dialog.querySelector('.ok-btn');

  if (closeBtn) {
    closeBtn.onclick = closeReadDialog;
  }

  if (okBtn) {
    okBtn.onclick = closeReadDialog;
  }

  // close when clicking outside dialog content
  dialog.onclick = function (e) {
    if (e.target === dialog) {
      closeReadDialog();
    }
  };
}

function closeReadDialog() {

  const dialog = document.getElementById('read-overlay');

  if (!dialog) return;

  dialog.classList.remove('open');
}