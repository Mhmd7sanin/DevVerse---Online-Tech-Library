requireAuth(false)


function initPage() {
    const books = getBooks();
    displayBooks(books);


    document.getElementById('search-input').addEventListener('input', filterAndSearchBooks);

    document.querySelectorAll('.filter-pill').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterAndSearchBooks();
      });
    });
}


function displayBooks(filteredBooks) {
      let user = getCurrentUser();

      const grid = document.getElementById('books-grid');
      grid.innerHTML = ''; 

      filteredBooks.forEach(book => {
        const bookCard = `
          <a href="../../pages/user/book-detail.html?id=${book.id}" class="book-card">
            <div class="book-card__cover">
              <span class="book-card__avail ${
                book.isAvailable ? 'book-card__avail--available':( book.borrowedBy == user.id ? 'book-card__avail--owned' :'book-card__avail--borrowed' )
              }">${book.isAvailable ? 'AVAILABLED' : ( book.borrowedBy == user.id ? 'OWNED' :'BORROWED' )}</span>
              <img src="c:\\Users\\MH\\Desktop\\ff.png">
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

      if (filteredBooks.length === 0) {
        grid.innerHTML = `<p class="no-books">No books found.</p>`;
      }
}

function filterAndSearchBooks() {
      const searchInput = document.getElementById('search-input').value.toLowerCase();
      const activeCategory = document.querySelector('.filter-pill.active').id;
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



