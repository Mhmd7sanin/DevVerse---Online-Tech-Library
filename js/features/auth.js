/* ============================================================
   DevVerse — js/features/auth.js
   Handles: signup, login, redirects.
   Used by: signup.html and login.html
   Depends on: storage.js + navbar.js (loaded first)
   ============================================================ */


/*  Redirect if already logged in  */
redirectIfLoggedIn();


/* ================================================================
   SIGNUP
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

  /* Validation  */
  let valid = true;

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

  if (!confirm) {
    showFieldError('confirm', 'Please confirm your password.');
    valid = false;
  } else if (password !== confirm) {
    showFieldError('confirm', 'Passwords do not match.');
    valid = false;
  }

  if (!valid) return;

  /*  Username uniqueness */
  if (getUserByUsername(username)) {
    showFieldError('username', 'That username is already taken.');
    return;
  }

  /*  Create user  */
  const today = new Date().toISOString().split('T')[0];

  const newUser = {
    id:            'u_' + (getUsersNumber() + 1).toString().padStart(3, '0'),
    username:      username,
    email:         email,
    password:      password,
    isAdmin:       false,
    borrowedBooks: [],
    createdAt:     today
  };

  addUser(newUser);
  setCurrentUser(newUser);

  showToast('Account created! Welcome to DevVerse.', 'success');

  setTimeout(function () {
    window.location.href = '../../pages/user/browse.html';
  }, 900);
}


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

  /*  Validate presence  */
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

  /*  Look up user  */
  const user = getUserByUsername(username);

  if (!user) {
    showFieldError('username', 'No account found with that username.');
    return;
  }

  if (user.password !== password) {
    showFieldError('password', 'Incorrect password. Please try again.');
    return;
  }

  /* ── Success ─────────────────────────────────────────── */
  setCurrentUser(user);
  showToast('Welcome back, ' + user.username + '!', 'success');

  setTimeout(function () {
    if (user.isAdmin) {
      window.location.href = '../../pages/admin/dashboard.html';
    } else {
      window.location.href = '../../pages/user/browse.html';
    }
  }, 900);
}


/* ================================================================
   FORGOT PASSWORD DIALOG
   Opens a "not implemented yet" dialog when user clicks Forgot?
================================================================ */
const forgotBtn          = document.getElementById('forgot-btn');
const forgotDialog       = document.getElementById('forgot-dialog');
const forgotDialogClose  = document.getElementById('forgot-dialog-close');

if (forgotBtn && forgotDialog) {

  /* Open */
  forgotBtn.addEventListener('click', function () {
    forgotDialog.classList.add('open');
  });

  /* Close via "Got it" button */
  forgotDialogClose.addEventListener('click', function () {
    forgotDialog.classList.remove('open');
  });

  /* Close on overlay click (outside the dialog box) */
  forgotDialog.addEventListener('click', function (e) {
    if (e.target === forgotDialog) {
      forgotDialog.classList.remove('open');
    }
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && forgotDialog.classList.contains('open')) {
      forgotDialog.classList.remove('open');
    }
  });
}


/* ================================================================
   HELPERS
================================================================ */

/**
 * Shows an inline error below a field.
 * Adds .error to the input + makes the error span visible.
 */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');

  if (input) {
    input.classList.add('error');
  }

  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}

/**
 * Clears all field errors and the top-level alert.
 */
function clearErrors() {
  document.querySelectorAll('.form-input.error').forEach(function (el) {
    el.classList.remove('error');
  });

  document.querySelectorAll('.form-error.visible').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });

  const alert = document.getElementById('form-alert');
  if (alert) {
    alert.style.display = 'none';
    alert.textContent   = '';
  }
}

/**
 * Redirect any logged-in user away from auth pages immediately.
 * Called at top of script on signup.html and login.html.
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