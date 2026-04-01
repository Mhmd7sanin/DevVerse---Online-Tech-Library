/**
 * DevVerse — create-account.js
 */


document.addEventListener('DOMContentLoaded', () => {
  initCreatePage();
});

function initCreatePage() {
  const form = document.getElementById('create-form');

  if (form) {
    form.addEventListener('submit', handleCreateAccount);
  }
}

/**
 * Handle form submit
 */
function handleCreateAccount(e) {
  e.preventDefault();

  // Get inputs
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const isAdmin = document.getElementById('is-admin').checked;

  // 🔴 Validation
  if (!username || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  // Check if username already exists
  const existingUser = getUserByUsername(username);
  if (existingUser) {
    alert('Username already exists');
    return;
  }

  // Create new user object
  const newUser = {
    id: generateId(),
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin,
    borrowedBooks: [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  // Save using storage.js
  addUser(newUser);

  // Optional: success message
  alert('Account created successfully');

  // Redirect back to users page
  window.location.href = 'users.html';
}

/**
 * Generate unique user ID
 */
function generateId() {
  return 'u_' + Date.now();
}
