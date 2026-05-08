async function initPage() {

  requireAuth(false);

  const books = await getBooks();
  displayBooks(books);

  document.getElementById('search-input')
    .addEventListener('input', filterAndSearchBooks);

  document.querySelectorAll('.filter-pill').forEach(button => {
    button.addEventListener('click', () => {

      document.querySelectorAll('.filter-pill')
        .forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');
      filterAndSearchBooks();
    });
  });
}


/* ============================================================
   DISPLAY BOOKS (FIXED SAFETY + SMALL BUG FIXES)
============================================================ */

function displayBooks(filteredBooks) {

  const user = getCurrentUser(); // may be null (safe now)

  const grid = document.getElementById('books-grid');
  grid.innerHTML = '';

  if (filteredBooks.length === 0) {
    grid.innerHTML = `<p class="no-books">No books found.</p>`;
    return;
  }

  filteredBooks.forEach(book => {

    const isOwner = user && book.borrowedBy === user.id;

    const statusClass =
      book.isAvailable
        ? 'book-card__avail--available'
        : (isOwner ? 'book-card__avail--owned' : 'book-card__avail--borrowed');

    const statusText =
      book.isAvailable
        ? 'AVAILABLE'
        : (isOwner ? 'OWNED' : 'BORROWED');

    const bookCard = `
      <a href="../../pages/user/book-detail.html?id=${book.id}" class="book-card">
        <div class="book-card__cover">
          <div class="book-card__image-wrapper">
            <img class="book-img" src="${book.image || ''}">
            <div class="book-card__fallback">❤</div>

            <span class="book-card__avail ${statusClass}">
              ${statusText}
            </span>
          </div>
        </div>

        <div class="book-card__body">
          <p class="book-card__category">${book.category.toUpperCase()}</p>
          <h3 class="book-card__title">${book.name}</h3>
          <p class="book-card__author">${book.author}</p>
        </div>
      </a>
    `;

    grid.innerHTML += bookCard;
  });

  /* ============================================================
     IMAGE FALLBACK (SAFE)
  ============================================================ */

  document.querySelectorAll('.book-img').forEach(img => {

    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.parentElement.querySelector('.book-card__fallback');
      if (fallback) fallback.style.display = 'flex';
    });

    if (!img.getAttribute('src')) {
      img.style.display = 'none';
      const fallback = img.parentElement.querySelector('.book-card__fallback');
      if (fallback) fallback.style.display = 'flex';
    }
  });
}


/* ============================================================
   SEARCH + FILTER (OPTIMIZED)
============================================================ */

async function filterAndSearchBooks() {

  const searchInput = document.getElementById('search-input')
    .value.toLowerCase();

  const activeCategory =
    document.querySelector('.filter-pill.active')?.id || 'All';

  let books = await getBooks();

  if (activeCategory !== 'All') {
    books = books.filter(book => book.category === activeCategory);
  }

  if (searchInput) {
    books = books.filter(book =>
      book.name.toLowerCase().includes(searchInput) ||
      book.author.toLowerCase().includes(searchInput)
    );
  }

  displayBooks(books);
}


/* ============================================================
   INIT SAFETY
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);