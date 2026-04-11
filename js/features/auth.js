/* ============================================================
   DevVerse — js/features/auth.js
   Handles: login form, signup form, field validation, redirects.
   Depends on: storage.js (must be loaded first), navbar.js
   ============================================================ */


/* ── On every auth page load: redirect if already logged in ── */
redirectIfLoggedIn();


/* ================================================================
   LOGIN
================================================================ */

const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // ── Validate presence ──────────────────────────────────────
  let valid = true;

  if (!username) {
    showFieldError('username', 'Username is required.');
    valid = false;
  }

  if (!password) {
    showFieldError('password', 'Password is required.');
    valid = false;
  }

  if (!valid) return;

  // ── Look up user ───────────────────────────────────────────
  const user = getUserByUsername(username);

  if (!user) {
    showFieldError('username', 'No account found with that username.');
    return;
  }

  if (user.password !== password) {
    showFieldError('password', 'Incorrect password. Please try again.');
    return;
  }

  // ── Success: save session and redirect ─────────────────────
  setCurrentUser(user);

  showToast('Welcome back, ' + user.username + '!', 'success');

  // Short delay so the toast is visible before redirect
  setTimeout(function () {
    if (user.isAdmin) {
      window.location.href = '../../pages/admin/dashboard.html';
    } else {
      window.location.href = '../../pages/user/browse.html';
    }
  }, 800);
}


/* ================================================================
   SIGNUP
   (Included here so auth.js covers both pages in one file.)
================================================================ */

const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

function handleSignup(e) {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;

  // ── Validate ───────────────────────────────────────────────
  let valid = true;

  if (!username) {
    showFieldError('username', 'Username is required.');
    valid = false;
  }

  if (!email || !email.includes('@')) {
    showFieldError('email', 'Enter a valid email address.');
    valid = false;
  }

  if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (password !== confirm) {
    showFieldError('confirm', 'Passwords do not match.');
    valid = false;
  }

  if (!valid) return;

  // ── Check username uniqueness ──────────────────────────────
  if (getUserByUsername(username)) {
    showFieldError('username', 'That username is already taken.');
    return;
  }

  // ── Create user — always isAdmin: false from signup ────────
  const today = new Date().toISOString().split('T')[0];

  const newUser = {
    id:           'u_' + Date.now(),
    username:     username,
    email:        email,
    password:     password,
    isAdmin:      false,          // public signup = regular user only
    borrowedBooks: [],
    createdAt:    today
  };

  addUser(newUser);
  setCurrentUser(newUser);

  showToast('Account created! Welcome to DevVerse.', 'success');

  setTimeout(function () {
    window.location.href = '../../pages/user/browse.html';
  }, 800);
}


/* ================================================================
   HELPERS
================================================================ */

/**
 * Shows an inline error message below a specific field.
 * Adds .error to the input and .visible to the error span.
 *
 * @param {string} fieldId  - The id of the input element (e.g. 'username')
 * @param {string} message  - The error text to display
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

/**
 * Clears all visible field errors and the top-level form alert.
 */
function clearErrors() {
  // Remove .error from all inputs
  document.querySelectorAll('.form-input.error').forEach(function (el) {
    el.classList.remove('error');
  });

  // Hide all error spans
  document.querySelectorAll('.form-error.visible').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });

  // Hide the top alert banner
  const alert = document.getElementById('form-alert');
  if (alert) {
    alert.style.display = 'none';
    alert.textContent = '';
  }
}

/**
 * Redirects any already-logged-in user away from auth pages.
 * Call this at the top of every auth page script.
 */
function redirectIfLoggedIn() {
  const user = getCurrentUser();
  if (!user) return;

  if (user.isAdmin) {
    window.location.href = '../../pages/admin/dashboard.html';
  } else {
    window.location.href = '../../pages/user/browse.html';
  }
}