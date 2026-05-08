/* ============================================================
   DevVerse — book-detail.js
============================================================ */

requireAuth(false);

let currentBook = null;
let currentUser = null;


/* ============================================================
   INIT
============================================================ */
async function initPage() {

  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  if (!bookId) {
    window.location.href = '../../pages/user/browse.html';
    return;
  }

  // bookId from URL is always MongoDB _id (set by browse/my-library links)
  const book = await getBookById(bookId);
  const user = getCurrentUser();

  if (!book) {
    window.location.href = '../../pages/user/browse.html';
    return;
  }

  currentBook = book;
  currentUser = user;

  populatePage(book);
  updateBorrowedUI(book, user);

  document.getElementById('borrow-btn')
    .addEventListener('click', () => handleBorrow(currentBook, currentUser));

  document.getElementById('return-btn')
    .addEventListener('click', openReturnDialog);

  document.getElementById('read-btn')
    .addEventListener('click', openReadDialog);
}


/* ============================================================
   POPULATE PAGE
============================================================ */
function populatePage(book) {
  document.title = book.name + ' — DevVerse';

  document.getElementById('book-title').textContent = book.name;
  document.getElementById('book-author').textContent = book.author;
  document.getElementById('book-category').textContent = book.category;
  document.getElementById('book-description').textContent = book.description;

  const img = document.getElementById('book-img');
  const fallback = document.querySelector('.detail-fallback');

  img.src = book.image || '';

  img.addEventListener('error', () => {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  });

  if (!book.image) {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  }
}


/* ============================================================
   BORROW
============================================================ */
async function handleBorrow(book, user) {

  if (!user) {
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // Use MongoDB _id for both — backend stores book.id (b_041) in user record
    const updatedBook = await borrowBook(book._id, user._id, today);

    currentBook = updatedBook;

    // Session already updated inside borrowBook() from server response
    currentUser = getCurrentUser();

    showToast('Book borrowed! Enjoy reading.', 'success');
    updateBorrowedUI(currentBook, currentUser);

  } catch (error) {
    console.error(error);
    showToast('Failed to borrow book.', 'danger');
  }
}


/* ============================================================
   RETURN
============================================================ */
async function handleReturn(book, user) {

  try {
    // Use MongoDB _id for both
    const updatedBook = await returnBook(book._id, user._id);

    currentBook = updatedBook;

    // Session already updated inside returnBook() from server response
    currentUser = getCurrentUser();

    showToast('Book returned! Hope you enjoyed it.', 'success');
    updateBorrowedUI(currentBook, currentUser);

  } catch (error) {
    console.error(error);
    showToast('Failed to return book.', 'danger');
  }
}


/* ============================================================
   UI STATE
   book.borrowedBy stores the user's MongoDB _id string
============================================================ */
function updateBorrowedUI(book, user) {

  const borrowBtn = document.getElementById('borrow-btn');
  const badge = document.getElementById('availability-badge');
  const ownedActions = document.getElementById('owned-actions');

  if (book.isAvailable) {

    borrowBtn.style.display = 'inline-block';
    borrowBtn.disabled = false;
    borrowBtn.textContent = 'Borrow this Book';
    borrowBtn.className = 'available-button';
    ownedActions.style.display = 'none';

    badge.className = 'badge badge-available';
    badge.textContent = 'AVAILABLE';

  } else if (user && book.borrowedBy === user._id) {
    // borrowedBy on the book is stored as user._id (MongoDB hex)

    borrowBtn.style.display = 'none';
    ownedActions.style.display = 'flex';

    badge.className = 'badge badge-owned';
    badge.textContent = 'OWNED';

  } else {

    borrowBtn.style.display = 'inline-block';
    borrowBtn.disabled = true;
    borrowBtn.textContent = 'Already Borrowed';
    borrowBtn.className = 'unavailable-button';
    ownedActions.style.display = 'none';

    badge.className = 'badge badge-borrowed';
    badge.textContent = 'BORROWED';
  }
}

document.addEventListener('DOMContentLoaded', initPage);