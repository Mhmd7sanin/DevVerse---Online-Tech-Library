/**
 * DevVerse — create-account.js 
 */

document.addEventListener('DOMContentLoaded', () => {
  initCreatePage();
});

/* ───────────────────────────────────────────── */

function initCreatePage() {
  const form = document.getElementById('create-form');

  if (form) {
    form.addEventListener('submit', handleCreateAccount);
  }
}

/* ───────────────────────────────────────────── */
/**
 * Handle form submit
 */

async function handleCreateAccount(e) {
  e.preventDefault();

  //clearErrors?.(); // optional if you have global helper

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const isAdmin = document.getElementById('is-admin').checked;

  let valid = true;

  /* ── Validation ── */
  if (!username) {
    showFieldError('username', 'Username is required.');
    valid = false;
  } else if (username.length < 3) {
    showFieldError('username', 'Username must be at least 3 characters.');
    valid = false;
  }

  if (!email) {
    showFieldError('email', 'Email is required.');
    valid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    showFieldError('email', 'Enter a valid email address.');
    valid = false;
  }

  if (!password) {
    showFieldError('password', 'Password is required.');
    valid = false;
  } else if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (!valid) return;

  /* ── Username uniqueness (async-safe) ── */
  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    showFieldError('username', 'That username is already taken.');
    return;
  }

  /* ── Create user ── */
  const newUser = {
    id: 'u_' + (getUsersNumber() + 1).toString().padStart(3, '0'),
    username,
    email,
    password,
    isAdmin,
    borrowedBooks: [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  /* ── Save user ── */
  await addUser(newUser); 

  showToast('User created successfully', 'success');

  /* ── Redirect ── */
  setTimeout(() => {
    window.location.href = 'users.html';
  }, 800);
}

/* ───────────────────────────────────────────── */
/**
 * Field error helper
 */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');

  if (input) input.classList.add('error');

  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}