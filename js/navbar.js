
/* ═══════════════════════════════════════════════════
   DevVerse — navbar.js
   Renders the correct navbar + wires up dropdowns.
   Include AFTER storage.js on every page.
═══════════════════════════════════════════════════ */

(function () {

  const user      = getCurrentUser();
  const path      = window.location.pathname;
  const container = document.getElementById('navbar-container');
  if (!container) return;


  function active(keyword) {
    return path.includes(keyword) ? 'active' : '';
  }


  function resolvePrefix() {
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth >= 2) return '../../';
    if (depth === 1) return '../';
    return './';
  }
  const prefix = resolvePrefix();

  /* ── Logo HTML ───────────────────────────────────────── */
  function logoHTML(href, label) {
    return `
      <a href="${prefix}${href}" class="navbar__logo">
        <img src="${prefix}assets/logo.png" alt="DevVerse">
        ${label}
      </a>`;
  }


  /// GUEST NAVBAR

  if (!user) {
    container.innerHTML = `
      <nav class="navbar">
        ${logoHTML('index.html', 'DevVerse')}

        <!-- Desktop links (hidden on mobile via CSS) -->
        <div class="navbar-links--desktop">
          <a href="${prefix}index.html"       class="nav-link ${active('index')}">Home</a>
          <a href="${prefix}pages/contact.html"     class="nav-link ${active('contact')}">Contact</a>
          <a href="${prefix}pages/auth/login.html"  class="nav-link ${active('login')}">Login</a>
          <a href="${prefix}pages/auth/signup.html" class="btn btn-primary btn-nav">Sign Up</a>
        </div>

        <!-- Mobile trigger: hamburger (shown on mobile via CSS) -->
        <button class="nav-hamburger" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <!-- Mobile panel (all 3 guest links + Sign Up) -->
      <div class="mobile-menu" id="mobile-menu">
        <a href="${prefix}index.html"       class="mobile-menu__item ${active('index')}">Home</a>
        <a href="${prefix}pages/contact.html"     class="mobile-menu__item ${active('contact')}">Contact</a>
        <a href="${prefix}pages/auth/login.html"  class="mobile-menu__item ${active('login')}">Login</a>
        <a href="${prefix}pages/auth/signup.html" class="mobile-menu__item mobile-menu__item--accent">Sign Up</a>
      </div>`;


  //ADMIN NAVBAR
  } else if (user.isAdmin) {
    container.innerHTML = `
      <nav class="navbar">
        ${logoHTML('pages/admin/dashboard.html', 'DevVerse Admin')}

        <!-- Desktop: dropdown menu + logout -->
        <div class="navbar-links--desktop">
          <div class="nav-dropdown">
            <button class="nav-menu-btn" id="admin-menu-btn" aria-haspopup="true" aria-expanded="false">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect width="16" height="2" rx="1" fill="currentColor"/>
                <rect y="5" width="16" height="2" rx="1" fill="currentColor"/>
                <rect y="10" width="16" height="2" rx="1" fill="currentColor"/>
              </svg>
              Menu
            </button>
            <div class="nav-dropdown__menu" id="admin-dropdown" role="menu">
              <a href="${prefix}pages/admin/dashboard.html"      class="nav-dropdown__item ${active('dashboard')}"      role="menuitem">Manage Books</a>
              <a href="${prefix}pages/admin/add-book.html"       class="nav-dropdown__item ${active('add-book')}"       role="menuitem">Add Book</a>
              <a href="${prefix}pages/admin/users.html"          class="nav-dropdown__item ${active('users')}"          role="menuitem">Manage Users</a>
              <a href="${prefix}pages/admin/create-account.html" class="nav-dropdown__item ${active('create-account')}" role="menuitem">Add Account</a>
            </div>
          </div>
          <button class="nav-logout" onclick="logoutUser()">Logout</button>
        </div>

        <!-- Mobile trigger: hamburger -->
        <button class="nav-hamburger" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <!-- Mobile panel (same 4 items + divider + Logout) -->
      <div class="mobile-menu" id="mobile-menu">
        <a href="${prefix}pages/admin/dashboard.html"      class="mobile-menu__item ${active('dashboard')}">Manage Books</a>
        <a href="${prefix}pages/admin/add-book.html"       class="mobile-menu__item ${active('add-book')}">Add Book</a>
        <a href="${prefix}pages/admin/users.html"          class="mobile-menu__item ${active('users')}">Manage Users</a>
        <a href="${prefix}pages/admin/create-account.html" class="mobile-menu__item ${active('create-account')}">Add Account</a>
        <div class="mobile-menu__divider"></div>
        <button class="mobile-menu__item mobile-menu__item--danger" onclick="logoutUser()">Logout</button>
      </div>`;


  // USER NAVBAR
  } else {
    const initials = user.username.slice(0, 2).toUpperCase();

    container.innerHTML = `
      <nav class="navbar">
        ${logoHTML('pages/user/browse.html', 'DevVerse')}

        <!-- Desktop: person dropdown + contact + logout -->
        <div class="navbar-links--desktop">
          <div class="nav-dropdown">
            <button class="nav-icon-btn" id="user-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="My account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <div class="nav-dropdown__menu" id="user-dropdown" role="menu">
              <a href="${prefix}pages/user/profile.html"    class="nav-dropdown__item ${active('profile')}" role="menuitem">
                <span class="user-avatar" style="width:24px;height:24px;font-size:10px;">${initials}</span>
                My Profile
              </a>
              <a href="${prefix}pages/user/browse.html"     class="nav-dropdown__item ${active('browse')}"     role="menuitem">Browse Books</a>
              <a href="${prefix}pages/user/my-library.html" class="nav-dropdown__item ${active('my-library')}" role="menuitem">My Books</a>
            </div>
          </div>
          <a href="${prefix}pages/contact.html" class="nav-link ${active('contact')}">Contact</a>
          <button class="nav-logout" onclick="logoutUser()">Logout</button>
        </div>

        <!-- Mobile trigger: person icon (no hamburger for user state) -->
        <button class="nav-icon-btn nav-icon-btn--mobile" id="mobile-menu-btn"
                aria-label="My account" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </nav>

      <!-- Mobile panel (profile + browse + my books + contact + logout) -->
      <div class="mobile-menu" id="mobile-menu">
        <a href="${prefix}pages/user/profile.html"    class="mobile-menu__item ${active('profile')}">
          <span class="user-avatar" style="width:28px;height:28px;font-size:11px;">${initials}</span>
          My Profile
        </a>
        <a href="${prefix}pages/user/browse.html"     class="mobile-menu__item ${active('browse')}">Browse Books</a>
        <a href="${prefix}pages/user/my-library.html" class="mobile-menu__item ${active('my-library')}">My Books</a>
        <div class="mobile-menu__divider"></div>
        <a href="${prefix}pages/contact.html"         class="mobile-menu__item ${active('contact')}">Contact</a>
        <button class="mobile-menu__item mobile-menu__item--danger" onclick="logoutUser()">Logout</button>
      </div>`;
  }


  // DESKTOP DROPDOWNS
  function setupDesktopDropdowns() {
    [
      { btnId: 'admin-menu-btn', menuId: 'admin-dropdown' },
      { btnId: 'user-menu-btn',  menuId: 'user-dropdown'  },
    ].forEach(function ({ btnId, menuId }) {
      const btn  = document.getElementById(btnId);
      const menu = document.getElementById(menuId);
      if (!btn || !menu) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        closeAllDesktopDropdowns();
        if (!isOpen) {
          menu.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      // Clicks inside dropdown don't bubble and close it
      menu.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    // Click anywhere else → close desktop dropdowns
    document.addEventListener('click', closeAllDesktopDropdowns);
  }

  function closeAllDesktopDropdowns() {
    document.querySelectorAll('.nav-dropdown__menu.open').forEach(function (m) {
      m.classList.remove('open');
    });
    document.querySelectorAll('.nav-menu-btn[aria-expanded="true"], .nav-icon-btn[aria-expanded="true"]')
      .forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }


  // MOBILE MENU TOGGLE
  function setupMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    // Click outside → close
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        closeMobileMenu();
      }
    });

    // Click on a menu item → close
    menu.querySelectorAll('.mobile-menu__item').forEach(function (item) {
      item.addEventListener('click', closeMobileMenu);
    });
  }

  function openMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.add('open');
    if (btn) { btn.classList.add('is-active'); btn.setAttribute('aria-expanded', 'true'); }
  }

  function closeMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.remove('open');
    if (btn) { btn.classList.remove('is-active'); btn.setAttribute('aria-expanded', 'false'); }
  }

  /* ── Init both dropdown systems ─────────────────────── */
  setupDesktopDropdowns();
  setupMobileMenu();

})();


/* ================================================================
   GLOBAL UTILITIES  (called by page scripts — stay in global scope)
================================================================ */

function logoutUser() {
  clearCurrentUser();
  const depth  = (window.location.pathname.match(/\//g) || []).length - 1;
  const prefix = depth >= 2 ? '../../' : depth === 1 ? '../' : './';
  window.location.href = prefix + 'pages/auth/login.html';
}

function requireAuth(adminOnly) {
  const user   = getCurrentUser();
  const depth  = (window.location.pathname.match(/\//g) || []).length - 1;
  const prefix = depth >= 2 ? '../../' : depth === 1 ? '../' : './';

  if (!user) {
    window.location.href = prefix + 'pages/auth/login.html';
    return null;
  }
  if (adminOnly && !user.isAdmin) {
    window.location.href = prefix + 'pages/user/browse.html';
    return null;
  }
  if (!adminOnly && user.isAdmin) {
    window.location.href = prefix + 'pages/admin/dashboard.html';
    return null;
  }
  return user;
}

function showToast(message, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className   = 'toast toast--' + (type || 'default');
  requestAnimationFrame(function () { toast.classList.add('show'); });
  setTimeout(function () { toast.classList.remove('show'); }, 3000);
}