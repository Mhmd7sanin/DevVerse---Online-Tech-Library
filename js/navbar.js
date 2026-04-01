
/* ═══════════════════════════════════════════════════
   DevVerse — navbar.js
   Renders the correct navbar + wires up dropdowns.
   Include AFTER storage.js on every page.
═══════════════════════════════════════════════════ */

(function() {
  const user = getCurrentUser();
  const path = window.location.pathname;
  const container = document.getElementById('navbar-container');
  if (!container) return;

  function isActive(keyword) {
    return path.includes(keyword) ? 'active' : '';
  }

  const logoIcon = ` <img src="/assets/logo.png" alt="DevVerse Logo" class="logo-img">`;

  let html = '';

  if (!user) {
    // ── GUEST
    html = `
      <nav class="navbar">
        <a href="/pages/index.html" class="navbar__logo">${logoIcon} DevVerse</a>
        <div class="navbar__right">
          <a href="/pages/index.html" class="nav-link ${isActive('index')}">Home</a>
          <a href="/pages/contact.html" class="nav-link ${isActive('contact')}">Contact</a>
          <a href="/pages/auth/login.html" class="nav-link ${isActive('login')}">Login</a>
          <a href="/pages/auth/signup.html" class="nav-btn">Sign Up</a>
        </div>
      </nav>`;

  } else if (user.isAdmin) {
    // ── ADMIN
    html = `
      <nav class="navbar navbar--admin">
        <a href="" class="navbar__logo">${logoIcon} DevVerse Admin</a> <!-- No link, just text -->
        <div class="navbar__right">
          <div class="nav-dropdown" id="admin-dropdown">
            <button class="nav-menu-btn" id="admin-menu-btn" aria-haspopup="true" aria-expanded="false">
              <span class="hamburger">≡</span> Menu
            </button>
            <div class="nav-dropdown__menu" id="admin-menu" role="menu">
              <a href="/pages/admin/dashboard.html" class="nav-dropdown__item ${isActive('dashboard')}" role="menuitem">Manage Books</a>
              <a href="/pages/admin/add-book.html" class="nav-dropdown__item ${isActive('add-book')}" role="menuitem">Add Book</a>
              <a href="/pages/admin/users.html" class="nav-dropdown__item ${isActive('users')}" role="menuitem">Manage Users</a>
              <a href="/pages/admin/create-account.html" class="nav-dropdown__item ${isActive('create-account')}" role="menuitem">Add Account</a>
            </div>
          </div>
          <a href="#" class="nav-logout" onclick="logoutUser(event)">Logout</a>
        </div>
      </nav>`;

  } else {
    // ── USER
    const initials = (user.username.slice(0,2)).toUpperCase();
    html = `
      <nav class="navbar">
        <a href="/pages/user/browse.html" class="navbar__logo">${logoIcon} DevVerse</a>
        <div class="navbar__right">
          <div class="nav-dropdown" id="user-dropdown">
            <button class="nav-icon-btn" id="user-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <div class="nav-dropdown__menu" id="user-menu" role="menu">
              <a href="/pages/user/profile.html" class="nav-dropdown__item ${isActive('profile')}" role="menuitem">
                <span class="user-avatar" style="width:24px;height:24px;font-size:10px;">${initials}</span>
                My Profile
              </a>
              <a href="/pages/user/browse.html" class="nav-dropdown__item ${isActive('browse')}" role="menuitem">Browse Books</a>
              <a href="/pages/user/my-library.html" class="nav-dropdown__item ${isActive('my-library')}" role="menuitem">My Books</a>
            </div>
          </div>
          <a href="/pages/contact.html" class="nav-link ${isActive('contact')}">Contact</a>
          <a href="#" class="nav-logout" onclick="logoutUser(event)">Logout</a>
        </div>
      </nav>`;
  }

  container.innerHTML = html;
  setupDropdowns();
})();

// ── DROPDOWN LOGIC
function setupDropdowns() {
  const triggers = [
    { btn: 'admin-menu-btn', menu: 'admin-menu' },
    { btn: 'user-menu-btn',  menu: 'user-menu'  },
  ];

  triggers.forEach(({ btn, menu }) => {
    const btnEl  = document.getElementById(btn);
    const menuEl = document.getElementById(menu);
    if (!btnEl || !menuEl) return;

    btnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuEl.classList.contains('open');
      // Close all first
      document.querySelectorAll('.nav-dropdown__menu').forEach(m => m.classList.remove('open'));
      // Toggle this one
      if (!isOpen) {
        menuEl.classList.add('open');
        btnEl.setAttribute('aria-expanded', 'true');
      } else {
        btnEl.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown__menu.open').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
  });

  // Close on item click
  document.querySelectorAll('.nav-dropdown__item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown__menu').forEach(m => m.classList.remove('open'));
    });
  });
}

// ── LOGOUT
function logoutUser(e) {
  e.preventDefault();
  clearCurrentUser();
  window.location.href = '/pages/auth/login.html';
}

// ── AUTH GUARD (call at top of every protected page)
function requireAuth(adminOnly = false) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/pages/auth/login.html';
    return null;
  }
  if (adminOnly && !user.isAdmin) {
    window.location.href = '/pages/user/browse.html';
    return null;
  }
  if (!adminOnly && user.isAdmin) {
    window.location.href = '/pages/admin/dashboard.html';
    return null;
  }
  return user;
}

// ── TOAST NOTIFICATION
function showToast(message, type = '') {
  let toast = document.getElementById('__dv_toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '__dv_toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast--${type || 'default'}`;
  requestAnimationFrame(() => toast.classList.add('toast--show'));
  setTimeout(() => toast.classList.remove('toast--show'), 3000);
}