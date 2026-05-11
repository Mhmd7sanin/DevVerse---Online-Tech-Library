/* ============================================================
   home.js — DevVerse Home Page
============================================================ */

function redirectIfLoggedIn() {

  const user = getCurrentUser();

  if (!user) return;

  if (user.isAdmin) {

    window.location.replace(
      'pages/admin/dashboard.html'
    );

  } else {

    window.location.replace(
      'pages/user/browse.html'
    );
  }
}


/* ============================================================
   BUILD HOME CARD
   SAME UI STYLE AS browse.js
   WITHOUT STATUS BADGE
============================================================ */

function buildHomeCard(book) {

  return `
    <a href="pages/auth/login.html" class="book-card">

      <div class="book-card__cover">

        <div class="book-card__image-wrapper">

          <img
            class="book-img"
            src="${book.image || ''}"
            alt="${escapeHTML(book.name)}"
            loading="lazy"
          >

          <div class="book-card__fallback">
            ❤
          </div>

        </div>

      </div>

      <div class="book-card__body">

        <p class="book-card__category">
          ${escapeHTML((book.category || '').toUpperCase())}
        </p>

        <h3 class="book-card__title">
          ${escapeHTML(book.name)}
        </h3>

        <p class="book-card__author">
          ${escapeHTML(book.author || '')}
        </p>

      </div>

    </a>
  `;
}


/* ============================================================
   RENDER FEATURED BOOKS
============================================================ */

async function renderFeaturedBooks() {

  const grid =
    document.getElementById('featured-grid');

  if (!grid) return;

  try {

    const books =
      (await getBooks()).slice(0, 12);

    if (!books.length) {

      grid.innerHTML = `
        <p class="no-books">
          No books available.
        </p>
      `;

      return;
    }

    grid.innerHTML =
      books.map(buildHomeCard).join('');

    setupImageFallbacks();

  } catch (error) {

    console.error(error);

    grid.innerHTML = `
      <p class="no-books">
        Failed to load books.
      </p>
    `;
  }
}


/* ============================================================
   IMAGE FALLBACKS
   SAME AS browse.js
============================================================ */

function setupImageFallbacks() {

  document.querySelectorAll('.book-img').forEach(img => {

    img.addEventListener('error', function () {

      this.style.display = 'none';

      const fallback =
        this.parentElement.querySelector(
          '.book-card__fallback'
        );

      if (fallback) {
        fallback.style.display = 'flex';
      }
    });

    if (!img.getAttribute('src')) {

      img.style.display = 'none';

      const fallback =
        img.parentElement.querySelector(
          '.book-card__fallback'
        );

      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  });
}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(str) {

  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ============================================================
   INIT
============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  async function () {

    redirectIfLoggedIn();

    await renderFeaturedBooks();
  }
);