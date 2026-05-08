/* ============================================================
   DevVerse — js/features/auth.js
   ============================================================ */


/* Redirect if already logged in */
redirectIfLoggedIn();


/* ================================================================
   SIGNUP
================================================================ */
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

async function handleSignup(e) {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;

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

  /* Username uniqueness */
  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    showFieldError('username', 'That username is already taken.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  const newUser = {
    username,
    email,
    password,
    isAdmin: false,
    borrowedBooks: [],
    createdAt: today
  };

  try {
    const result = await signup(newUser);

    if (!result.success) {
      showToast(result.message, "error");
      return;
    }

    showToast('Account created! Welcome to DevVerse.', 'success');

    setTimeout(() => {
      window.location.href = '../../pages/user/browse.html';
    }, 900);

  } catch (err) {
    console.error(err);
    showToast("Signup failed", "error");
  }
}


/* ================================================================
   LOGIN
================================================================ */
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

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

  try {
    const result = await login(username, password);

    if (!result.success) {
      showToast("Invalid username or password", "error");
      return;
    }

    showToast("Login successful", "success");

    const user = result.user; // ✅ FIXED (was missing before)

    setTimeout(() => {
      if (user.isAdmin) {
        window.location.href = '../../pages/admin/dashboard.html';
      } else {
        window.location.href = '../../pages/user/browse.html';
      }
    }, 900);

  } catch (err) {
    console.error(err);
    showToast("Login failed", "error");
  }
}


/* ================================================================
   FORGOT PASSWORD (UNCHANGED LOGIC)
================================================================ */
const forgotBtn          = document.getElementById('forgot-btn');
const forgotDialog       = document.getElementById('forgot-dialog');
const forgotDialogClose  = document.getElementById('forgot-dialog-close');

if (forgotBtn && forgotDialog) {

  forgotBtn.addEventListener('click', () => {
    forgotDialog.classList.add('open');
  });

  forgotDialogClose.addEventListener('click', () => {
    forgotDialog.classList.remove('open');
  });

  forgotDialog.addEventListener('click', (e) => {
    if (e.target === forgotDialog) {
      forgotDialog.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotDialog.classList.contains('open')) {
      forgotDialog.classList.remove('open');
    }
  });
}


/* ================================================================
   HELPERS (UNCHANGED LOGIC)
================================================================ */

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');

  if (input) input.classList.add('error');

  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}

function clearErrors() {
  document.querySelectorAll('.form-input.error')
    .forEach(el => el.classList.remove('error'));

  document.querySelectorAll('.form-error.visible')
    .forEach(el => {
      el.classList.remove('visible');
      el.textContent = '';
    });

  const alert = document.getElementById('form-alert');
  if (alert) {
    alert.style.display = 'none';
    alert.textContent = '';
  }
}

function redirectIfLoggedIn() {
  const user = getCurrentUser();
  if (!user) return;

  if (user.isAdmin) {
    window.location.href = '../../pages/admin/dashboard.html';
  } else {
    window.location.href = '../../pages/user/browse.html';
  }
}