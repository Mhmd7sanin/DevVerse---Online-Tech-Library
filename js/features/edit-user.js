/* ============================================================
   DevVerse — edit-user.js
   Backend API Version + Original UI Design
============================================================ */


/* ============================================================
   AUTH
============================================================ */

const adminUser = requireAuth(true);


/* ============================================================
   URL PARAMS
============================================================ */

const params = new URLSearchParams(window.location.search);

const userId = params.get('id');

if (!userId) {
  window.location.href = 'users.html';
}


let targetUser = null;


/* ============================================================
   DOM
============================================================ */

const headingUsername = document.getElementById('heading-username');

const usernameInput = document.getElementById('edit-username');

const emailInput = document.getElementById('edit-email');

const isAdminCheckbox = document.getElementById('edit-is-admin');

const updateBtn = document.getElementById('update-btn');

const borrowedList = document.getElementById('borrowed-list');

const borrowedEmpty = document.getElementById('borrowed-empty');


/* ============================================================
   INIT
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);

async function initPage() {

  targetUser = await getUserById(userId);

  if (!targetUser) {
    window.location.href = 'users.html';
    return;
  }

  /*
    Prevent editing main admin
  */

  if (targetUser.username === 'admin') {

    const overlay = document.getElementById('edit-overlay');

    if (overlay) {
      overlay.classList.add('open');
    }

    setTimeout(() => {
      window.location.href = 'users.html';
    }, 1800);

    return;
  }

  populatePage();
}


/* ============================================================
   POPULATE PAGE
============================================================ */

function populatePage() {

  document.title =
    'Edit ' +
    targetUser.username +
    ' — DevVerse Admin';

  headingUsername.textContent =
    '@' + targetUser.username;

  usernameInput.value =
    targetUser.username;

  emailInput.value =
    targetUser.email || '';

  isAdminCheckbox.checked =
    targetUser.isAdmin;

  renderBorrowedBooks();
}


/* ============================================================
   UPDATE USER
============================================================ */

updateBtn.addEventListener('click', async function () {

  clearErrors();

  const newUsername =
    usernameInput.value.trim();

  const newEmail =
    emailInput.value.trim();

  const newIsAdmin =
    isAdminCheckbox.checked;

  let valid = true;

  /*
    Username validation
  */

  if (!newUsername) {

    showFieldError(
      'edit-username',
      'Username is required.'
    );

    valid = false;

  } else if (newUsername.length < 3) {

    showFieldError(
      'edit-username',
      'Must be at least 3 characters.'
    );

    valid = false;
  }

  /*
    Email validation
  */

  if (
    !newEmail ||
    !newEmail.includes('@')
  ) {

    showFieldError(
      'edit-email',
      'Enter a valid email address.'
    );

    valid = false;
  }

  if (!valid) return;

  /*
    Prevent using admin username
  */

  if (
    newUsername.toLowerCase() === 'admin'
  ) {

    const overlay =
      document.getElementById('edit-overlay');

    if (overlay) {
      overlay.classList.add('open');
    }

    return;
  }

  /*
    Check uniqueness
  */

  const existing =
    await getUserByUsername(newUsername);

  if (
    existing &&
    existing._id !== targetUser._id
  ) {

    showFieldError(
      'edit-username',
      'That username is already taken.'
    );

    return;
  }

  /*
    Apply changes
  */

  targetUser.username = newUsername;
  targetUser.email = newEmail;
  targetUser.isAdmin = newIsAdmin;

  try {

    await updateUser(targetUser);

    /*
      Refresh local storage
    */

    if (adminUser._id === targetUser._id) {
      setCurrentUser(targetUser);
    }

    headingUsername.textContent =
      '@' + targetUser.username;

    showToast(
      'User info updated successfully.',
      'success'
    );

  } catch (error) {

    console.error(error);

    showToast(
      'Failed to update user.',
      'danger'
    );
  }
});


/* ============================================================
   BORROWED BOOKS
============================================================ */

async function renderBorrowedBooks() {

  const borrowed = targetUser.borrowedBooks || [];

  if (!borrowed.length) {

    borrowedList.style.display = 'none';
    borrowedEmpty.style.display = 'block';

    return;
  }

  borrowedEmpty.style.display = 'none';
  borrowedList.style.display = 'flex';

  /*
    Get all books once
  */

  const allBooks = await getBooks();

  const htmlParts = borrowed.map(function (entry) {

    /*
      borrowedBooks stores custom id like:
      b_001
    */

    const book = allBooks.find(
      b => b.id === entry.bookId
    );

    if (!book) return '';

    const dateFormatted =
      formatDate(entry.borrowedAt);

    return `
      <div
        class="eu-book-item"
        data-book-id="${book._id}"
      >

        <div class="eu-book-item__left">

          <div class="eu-book-item__thumb">
            ♡
          </div>

          <div class="eu-book-item__info">

            <p class="eu-book-item__title">
              ${escapeHtml(book.name)}
            </p>

            <p class="eu-book-item__meta">
              ${escapeHtml(book.author)}
              · Borrowed ${dateFormatted}
            </p>

          </div>

        </div>

        <button
          class="eu-return-btn"
          onclick="markAsReturned('${book._id}')"
        >
          Mark as Returned
        </button>

      </div>
    `;
  });

  borrowedList.innerHTML = htmlParts.join('');
}


/* ============================================================
   MARK AS RETURNED
============================================================ */

async function markAsReturned(bookId) {

  try {

    await returnBook(
      bookId,
      targetUser._id
    );

    /*
      Refresh user
    */

    targetUser =
      await getUserById(targetUser._id);

    /*
      Refresh current session
    */

    const currentUser = getCurrentUser();

    if (
      currentUser &&
      currentUser._id === targetUser._id
    ) {
      setCurrentUser(targetUser);
    }

    renderBorrowedBooks();

    showToast(
      'Book marked as returned.',
      'success'
    );

  } catch (error) {

    console.error(error);

    showToast(
      'Failed to return book.',
      'danger'
    );
  }
}


/* ============================================================
   HELPERS
============================================================ */

function showFieldError(fieldId, message) {

  const input =
    document.getElementById(fieldId);

  const error =
    document.getElementById(
      fieldId + '-error'
    );

  if (input) {
    input.classList.add('error');
  }

  if (error) {

    error.textContent = message;

    error.classList.add('visible');
  }
}

function clearErrors() {

  document
    .querySelectorAll('.form-input.error')
    .forEach(function (el) {
      el.classList.remove('error');
    });

  document
    .querySelectorAll('.form-error.visible')
    .forEach(function (el) {

      el.classList.remove('visible');

      el.textContent = '';
    });
}

function formatDate(dateStr) {

  if (!dateStr) return '';

  const d = new Date(
    dateStr + 'T00:00:00'
  );

  return d.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );
}

function escapeHtml(str) {

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}