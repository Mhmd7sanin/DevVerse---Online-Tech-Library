/* ============================================================
   edit-user.js 
============================================================ */

const adminUser = requireAuth(true);

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) {
  window.location.href = '../../pages/admin/users.html';
}

let targetUser = null;


/* ============================================================
   DOM REFS
============================================================ */

const headingUsername = document.getElementById('heading-username');
const usernameInput   = document.getElementById('edit-username');
const emailInput      = document.getElementById('edit-email');
const isAdminCheckbox = document.getElementById('edit-is-admin');
const updateBtn       = document.getElementById('update-btn');

const borrowedList    = document.getElementById('borrowed-list');
const borrowedEmpty   = document.getElementById('borrowed-empty');


/* ============================================================
   INIT
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);

async function initPage() {

  targetUser = await getUserById(userId);

  if (!targetUser) {
    window.location.href = '../../pages/admin/users.html';
    return;
  }

  populatePage();
}


/* ============================================================
   POPULATE PAGE
============================================================ */

function populatePage() {

  document.title =
    'Edit ' + targetUser.username + ' — DevVerse Admin';

  headingUsername.textContent =
    '@' + targetUser.username;

  usernameInput.value =
    targetUser.username || '';

  emailInput.value =
    targetUser.email || '';

  isAdminCheckbox.checked =
    targetUser.isAdmin || false;

  renderBorrowedBooks();
}


/* ============================================================
   UPDATE USER
============================================================ */

updateBtn.addEventListener('click', async function () {

  clearErrors();

  const newUsername = usernameInput.value.trim();
  const newEmail    = emailInput.value.trim();
  const newIsAdmin  = isAdminCheckbox.checked;

  let valid = true;

  /* Username validation */

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

  /* Email validation */

  if (!newEmail) {

    showFieldError(
      'edit-email',
      'Email is required.'
    );

    valid = false;

  } else if (
    !newEmail.includes('@') ||
    !newEmail.includes('.')
  ) {

    showFieldError(
      'edit-email',
      'Enter a valid email address.'
    );

    valid = false;
  }

  if (!valid) return;


  /* Username uniqueness */

  const existingUser =
    await getUserByUsername(newUsername);

  if (
    existingUser &&
    existingUser._id !== targetUser._id
  ) {

    showFieldError(
      'edit-username',
      'That username is already taken.'
    );

    return;
  }


  targetUser.username = newUsername;
  targetUser.email    = newEmail;
  targetUser.isAdmin  = newIsAdmin;


  const updatedUser =
    await updateUser(targetUser);

  targetUser = updatedUser;



  if (
    adminUser &&
    adminUser._id === updatedUser._id
  ) {
    setCurrentUser(updatedUser);
  }


  headingUsername.textContent =
    '@' + updatedUser.username;

  showToast(
    'User info updated successfully.',
    'success'
  );
});


/* ============================================================
   BORROWED BOOKS
============================================================ */

async function renderBorrowedBooks() {

  const borrowed =
    targetUser.borrowedBooks || [];

  if (!borrowed.length) {

    borrowedList.style.display = 'none';
    borrowedEmpty.style.display = 'block';

    return;
  }

  borrowedEmpty.style.display = 'none';
  borrowedList.style.display = 'flex';

  const allBooks = await getBooks();

  borrowedList.innerHTML = borrowed.map(function (entry) {

    const book = allBooks.find(
      b => b.id === entry.bookId
    );

    if (!book) return '';

    const dateFormatted =
      formatDate(entry.borrowedAt);

    return `
      <div class="eu-book-item">

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

  }).join('');
}


/* ============================================================
   MARK AS RETURNED
============================================================ */

async function markAsReturned(bookMongoId) {

  const currentUser =
    await getUserById(targetUser._id);

  await returnBook(
    bookMongoId,
    currentUser._id
  );

  targetUser =
    await getUserById(targetUser._id);

  renderBorrowedBooks();

  showToast(
    'Book marked as returned.',
    'success'
  );
}


/* ============================================================
   HELPERS
============================================================ */

function showFieldError(fieldId, message) {

  const input =
    document.getElementById(fieldId);

  const error =
    document.getElementById(fieldId + '-error');

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

  const d = new Date(dateStr);

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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}