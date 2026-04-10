let allBooks = [];

function initPage() {
  requireAuth(false);

  allBooks = getBooks();
  renderBooks(allBooks);

  document.getElementById("search-input")
    .addEventListener("input", applyFilters);

  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      applyFilters();
    });
  });
}

function renderBooks(booksArray) {
  const grid = document.getElementById("books-grid");
  grid.innerHTML = "";

  if (booksArray.length === 0) {
    showEmptyState();
    return;
  }

  document.getElementById("empty-state").style.display = "none";

  booksArray.forEach(book => {
    grid.innerHTML += buildBookCard(book);
  });
}

function buildBookCard(book) {
  return `
    <a href="/pages/user/book-detail.html?id=${book.id}" class="book-card">
      <div class="book-card__cover">
        <span class="book-card__avail ${book.isAvailable ? 'book-card__avail--available' : 'book-card__avail--borrowed'}">
          ${book.isAvailable ? 'AVAILABLE' : 'BORROWED'}
        </span>
        <img src="../../assets/placeholder-cover.svg">
      </div>
      <div class="book-card__body">
        <p class="book-card__category">${book.category}</p>
        <h3 class="book-card__title">${book.title}</h3>
        <p class="book-card__author">${book.author}</p>
      </div>
    </a>
  `;
}

function showEmptyState() {
  document.getElementById("books-grid").innerHTML = "";
  document.getElementById("empty-state").style.display = "block";
}

function applyFilters() {
  const text = document.getElementById("search-input").value.toLowerCase();
  const category = getActiveCategory();

  let filtered = allBooks.filter(book => {

    const matchesText =
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text) ||
      book.category.toLowerCase().includes(text);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesText && matchesCategory;
  });

  renderBooks(filtered);
}

function getActiveCategory() {
  const active = document.querySelector(".filter-pill.active");
  return active.dataset.cat;
}





function displayAllBooks() {
  const books = getBooks();
  const grid = document.getElementById('books-grid');

  grid.innerHTML = '';
  let num = 0;

  books.forEach(book => {
    const bookCard = `
      <a href="../../pages/user/book-detail.html?id=${book.id}" class="book-card">
        <div class="book-card__cover">
          <span class="book-card__avail ${
            book.isAvailable ? 'book-card__avail--available' : 'book-card__avail--borrowed'
          }">${book.isAvailable ? 'AVAILABLE' : 'BORROWED'}</span>
          <img src="c:\\Users\\MH\\Desktop\\ff.png">
        </div>
        <div class="book-card__body">
          <p class="book-card__category">${book.category.toUpperCase()}</p>
          <h3 class="book-card__title">${book.name}</h3>
          <p class="book-card__author">${book.author}</p>
        </div>
      </a>
    `;
    num+=1;   
    grid.innerHTML += bookCard;
  });

  if (num === 0) {
    grid.innerHTML = `<p class="no-books">No books found.</p>`;
  }
}

function displayBooks(filteredBooks) {
      const grid = document.getElementById('books-grid');
      grid.innerHTML = '';
      let num = 0;  
      filteredBooks.forEach(book => {
        const bookCard = `
          <a href="../../pages/user/book-detail.html?id=${book.id}" class="book-card">
            <div class="book-card__cover">
              <span class="book-card__avail ${
                book.isAvailable ? 'book-card__avail--available' : 'book-card__avail--borrowed'
              }">${book.isAvailable ? 'AVAILABLE' : 'BORROWED'}</span>
              <img src="c:\\Users\\MH\\Desktop\\ff.png">
            </div>
            <div class="book-card__body">
              <p class="book-card__category">${book.category.toUpperCase()}</p>
              <h3 class="book-card__title">${book.name}</h3>
              <p class="book-card__author">${book.author}</p>
            </div>
          </a>
        `;
        num+=1;
        grid.innerHTML += bookCard;
      });

      if (num === 0) {
        grid.innerHTML = `<p class="no-books">No books found.</p>`;
      }
}

function filterAndSearchBooks() {
      const searchInput = document.getElementById('search-input').value.toLowerCase();
      const activeCategory = document.querySelector('.filter-pill.active').dataset.cat;
      let books = getBooks();


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


displayAllBooks();
initPage();