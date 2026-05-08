/* ============================================================
   browse.js 
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);

async function initPage() {

  requireAuth(false);

  try {

    const books = await getBooks();
    displayBooks(books);

    const searchInput = document.getElementById('search-input');

    if (searchInput) {
      searchInput.addEventListener('input', filterAndSearchBooks);
    }

    document.querySelectorAll('.filter-pill').forEach(button => {

      button.addEventListener('click', function () {

        document.querySelectorAll('.filter-pill')
          .forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        filterAndSearchBooks();
      });
    });

  } catch (error) {

    console.error(error);

    const grid = document.getElementById('books-grid');

    if (grid) {
      grid.innerHTML = `
        <p class="no-books">
          Failed to load books.
        </p>
      `;
    }
  }
}


/* ============================================================
   DISPLAY BOOKS
============================================================ */

function displayBooks(filteredBooks) {

  const user = getCurrentUser();

  const grid = document.getElementById('books-grid');

  if (!grid) return;

  grid.innerHTML = '';

  if (!filteredBooks || filteredBooks.length === 0) {

    grid.innerHTML = `
      <p class="no-books">
        No books found.
      </p>
    `;

    return;
  }

  filteredBooks.forEach(book => {

    /*
      IMPORTANT

      book.borrowedBy now stores:
      user.id (u_001)

      NOT MongoDB _id
    */

    const isOwner =
      user &&
      (
        book.borrowedBy === user.id ||
        book.borrowedBy === user._id
      );

    const statusClass =
      book.isAvailable
        ? 'book-card__avail--available'
        : (isOwner
            ? 'book-card__avail--owned'
            : 'book-card__avail--borrowed');

    const statusText =
      book.isAvailable
        ? 'AVAILABLE'
        : (isOwner
            ? 'OWNED'
            : 'BORROWED');

    /*
      IMPORTANT

      book detail page now uses MongoDB _id
      because backend route needs _id
    */

    const bookCard = `
      <a href="../../pages/user/book-detail.html?id=${book._id}" class="book-card">

        <div class="book-card__cover">

          <div class="book-card__image-wrapper">

            <img
              class="book-img"
              src="${book.image || ''}"
              alt="${escapeHTML(book.name)}"
            >

            <div class="book-card__fallback">
              ❤
            </div>

            <span class="book-card__avail ${statusClass}">
              ${statusText}
            </span>

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
            ${escapeHTML(book.author)}
          </p>

        </div>

      </a>
    `;

    grid.innerHTML += bookCard;
  });

  setupImageFallbacks();
}


/* ============================================================
   IMAGE FALLBACKS
============================================================ */

function setupImageFallbacks() {

  document.querySelectorAll('.book-img').forEach(img => {

    img.addEventListener('error', function () {

      this.style.display = 'none';

      const fallback =
        this.parentElement.querySelector('.book-card__fallback');

      if (fallback) {
        fallback.style.display = 'flex';
      }
    });

    if (!img.getAttribute('src')) {

      img.style.display = 'none';

      const fallback =
        img.parentElement.querySelector('.book-card__fallback');

      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  });
}


/* ============================================================
   SEARCH + FILTER
============================================================ */

async function filterAndSearchBooks() {

  try {

    const searchInput =
      document.getElementById('search-input')
        .value
        .toLowerCase();

    const activeCategory =
      document.querySelector('.filter-pill.active')?.id || 'All';

    let books = await getBooks();

    if (activeCategory !== 'All') {

      books = books.filter(book =>
        book.category === activeCategory
      );
    }

    if (searchInput) {

      books = books.filter(book =>

        (book.name || '')
          .toLowerCase()
          .includes(searchInput)

        ||

        (book.author || '')
          .toLowerCase()
          .includes(searchInput)
      );
    }

    displayBooks(books);

  } catch (error) {

    console.error(error);
  }
}


/* ============================================================
   HELPERS
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