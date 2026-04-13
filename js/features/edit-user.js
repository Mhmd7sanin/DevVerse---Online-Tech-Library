/* ============================================================
   DevVerse — js/features/edit-user.js
   Page: pages/admin/edit-user.html
   Depends on: storage.js, navbar.js
   ============================================================ */

/* ── 1. Auth guard ───────────────────────────────────────── */
const adminUser = requireAuth(true);

/* ── 2. Read ?id= from URL ───────────────────────────────── */
const params    = new URLSearchParams(window.location.search);
const userId    = params.get('id');

if (!userId) {
//   window.location.href = '../../pages/admin/users.html';
}

let targetUser = getUserById(userId);

if (!targetUser) {
//   window.location.href = '../../pages/admin/users.html';
}


/* ── 3. DOM refs ─────────────────────────────────────────── */
const headingUsername = document.getElementById('heading-username');
const usernameInput   = document.getElementById('edit-username');
const emailInput      = document.getElementById('edit-email');
const isAdminCheckbox = document.getElementById('edit-is-admin');
const updateBtn       = document.getElementById('update-btn');
const borrowedList    = document.getElementById('borrowed-list');
const borrowedEmpty   = document.getElementById('borrowed-empty');


/* ============================================================
   POPULATE PAGE
   ============================================================ */
function populatePage() {
  document.title = 'Edit ' + targetUser.username + ' — DevVerse Admin';

  headingUsername.textContent = '@' + targetUser.username;
  usernameInput.value         = targetUser.username;
  emailInput.value            = targetUser.email || '';
  isAdminCheckbox.checked     = targetUser.isAdmin;

  renderBorrowedBooks();
}


/* ============================================================
   UPDATE USER INFO
   ============================================================ */
updateBtn.addEventListener('click', function () {
  clearErrors();

  const newUsername = usernameInput.value.trim();
  const newEmail    = emailInput.value.trim();
  const newIsAdmin  = isAdminCheckbox.checked;

  /* Validate */
  let valid = true;

  if (!newUsername) {
    showFieldError('edit-username', 'Username is required.');
    valid = false;
  } else if (newUsername.length < 3) {
    showFieldError('edit-username', 'Must be at least 3 characters.');
    valid = false;
  }

  if (!newEmail || !newEmail.includes('@')) {
    showFieldError('edit-email', 'Enter a valid email address.');
    valid = false;
  }

  if (!valid) return;

  /* Check uniqueness — allow same username as this user */
  const existing = getUserByUsername(newUsername);
  if (existing && existing.id !== targetUser.id) {
    showFieldError('edit-username', 'That username is already taken.');
    return;
  }

  /* Apply changes */
  targetUser.username = newUsername;
  targetUser.email    = newEmail;
  targetUser.isAdmin  = newIsAdmin;

  updateUser(targetUser);

  /* If editing the currently logged-in admin, keep session fresh */
  if (adminUser.id === targetUser.id) {
    setCurrentUser(targetUser);
  }

  /* Refresh heading */
  headingUsername.textContent = '@' + targetUser.username;

  showToast('User info updated successfully.', 'success');
});


/* ============================================================
   BORROWED BOOKS
   ============================================================ */
function renderBorrowedBooks() {
  const borrowed = targetUser.borrowedBooks || [];

  if (!borrowed.length) {
    borrowedList.style.display  = 'none';
    borrowedEmpty.style.display = 'block';
    return;
  }

  borrowedEmpty.style.display = 'none';
  borrowedList.style.display  = 'flex';

  borrowedList.innerHTML = borrowed.map(function (entry) {
    const book = getBookById(entry.bookId);
    if (!book) return '';

    const dateFormatted = formatDate(entry.borrowedAt);

    return `
      <div class="eu-book-item" data-book-id="${book.id}">
        <div class="eu-book-item__left">
          <div class="eu-book-item__thumb">♡</div>
          <div class="eu-book-item__info">
            <p class="eu-book-item__title">${escapeHtml(book.name)}</p>
            <p class="eu-book-item__meta">
              ${escapeHtml(book.author)} · Borrowed ${dateFormatted}
            </p>
          </div>
        </div>
        <button
          class="eu-return-btn"
          onclick="markAsReturned('${book.id}')"
        >
          Mark as Returned
        </button>
      </div>`;
  }).join('');
}


/* ============================================================
   MARK AS RETURNED
   ============================================================ */
function markAsReturned(bookId) {
  /* Update the book — set back to available */
  const book = getBookById(bookId);
  if (book) {
    updateBook({
      id:          book.id,
      name:        book.name,
      author:      book.author,
      category:    book.category,
      description: book.description,
      isAvailable: true,
      borrowedBy:  null,
      borrowedAt:  null
    });
  }

  /* Remove from user's borrowed list */
  targetUser.borrowedBooks = targetUser.borrowedBooks.filter(function (e) {
    return e.bookId !== bookId;
  });
  updateUser(targetUser);

  /* If this is the logged-in user, keep session fresh */
  if (adminUser.id === targetUser.id) {
    setCurrentUser(targetUser);
  }

  showToast('Book marked as returned.', 'success');
  renderBorrowedBooks();
}


/* ============================================================
   HELPERS
   ============================================================ */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (input) input.classList.add('error');
  if (error) { error.textContent = message; error.classList.add('visible'); }
}

function clearErrors() {
  document.querySelectorAll('.form-input.error').forEach(function (el) {
    el.classList.remove('error');
  });
  document.querySelectorAll('.form-error.visible').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ── 4. Init ─────────────────────────────────────────────── */
populatePage();