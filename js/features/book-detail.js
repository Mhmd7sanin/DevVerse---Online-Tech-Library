requireAuth(false);

// Guards this page, loads book from URL param, populates the page
function initPage(){
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  var book = getBookById(bookId);
  var user = getCurrentUser();
  document.addEventListener('DOMContentLoaded', () => {
    getBookFromUrl();
    populatePage(book);
    updateBorrowedUI(book, user);
  });

        
  document.getElementById('borrow-btn').addEventListener('click', () => handleBorrow(book, user));
}

// Reads ?id= from URL, returns the book object (or redirects if not found)
function getBookFromUrl(){
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  let book = getBookById(bookId);
  return book;
}

// Fills all the page elements with book data
function populatePage(book) {
  document.getElementById('book-title').textContent = book.name;
  document.getElementById('book-author').textContent = book.author;
  document.getElementById('book-category').textContent = book.category;
  document.getElementById('book-description').textContent = book.description;

  const img = document.getElementById('book-img');
  const fallback = document.querySelector('.detail-fallback');

  img.src = book.image || '';

  img.addEventListener('error', function () {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  });

  if (!img.src) {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  }
}

// Handles the borrow button click
function handleBorrow(book, user) {
  if(user == null) {
    window.location.href = "../../pages/auth/login.html";
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  book.isAvailable = false;
  book.borrowedBy = user.id;
  book.borrowedAt = today;
  updateBook(book);

  user.borrowedBooks.push({ bookId: book.id, borrowedAt: today });
  updateUser(user);
  setCurrentUser(user);

  showToast("Book borrowed! Enjoy reading.", "success");
  updateBorrowedUI(book, user);

}


//init & Updates the (badge + button state)
function updateBorrowedUI(book, user) {
  const borrowBtn = document.getElementById('borrow-btn');
  const badge = document.getElementById('availability-badge');
  let massage = document.getElementById('borrow-message');
  const returnBtn = document.getElementById('return-btn');
  const readBtn = document.getElementById('read-btn');

  if (book.isAvailable) {
    borrowBtn.style.display = 'inline-block';
    returnBtn.style.display = 'none';
    readBtn.style.display = 'none';

    borrowBtn.textContent = "Borrow this Book";
    borrowBtn.classList.remove("unavailable-button");
    borrowBtn.classList.add("available-button");

    badge.classList.remove('badge-borrowed');
    badge.classList.remove(`badge-owned`);
    badge.classList.add(`badge-available`);
    badge.textContent = 'AVAILABLE';
    // massage.style.visibility = 'hidden';
    // document.getElementById('days-left').textContent = calculateDaysLeft(book.borrowedAt);
    
  } else {
      if (book.borrowedBy === user.id) {
      borrowBtn.style.display = 'none';
      readBtn.style.display = 'inline-block';
      returnBtn.style.display = 'inline-block';
      badge.classList.remove('badge-available');
      badge.classList.remove(`badge-borrowed`);
      badge.classList.add(`badge-owned`);
      badge.textContent = 'OWNED';

      returnBtn.addEventListener('click', () => handleReturn(book, user));

      readBtn.addEventListener('click', () => {
      window.location.href = `../../pages/user/read-book.html?id=${book.id}`;
      });

    } else {
    borrowBtn.style.display = "inline-block";
    returnBtn.style.display = 'none';
    readBtn.style.display = 'none';

    borrowBtn.textContent = "Already Borrowed";
    borrowBtn.classList.remove("available-button");
    borrowBtn.classList.add("unavailable-button");;
    badge.classList.remove('badge-available');
    badge.classList.remove(`badge-owned`);
    badge.classList.add(`badge-borrowed`);
    badge.textContent = 'BORROWED';
    }
    // massage.style.visibility = 'visible';
    // document.getElementById('days-left').textContent = calculateDaysLeft(book.borrowedAt);

  }
}

// Handles the return button click
function handleReturn(book, user) {
  book.isAvailable = true;
  book.borrowedBy = null;
  book.borrowedAt = null;
  updateBook(book);

  user.borrowedBooks = user.borrowedBooks.filter(item => item.bookId !== book.id);
  updateUser(user);
  setCurrentUser(user);

  showToast("Book returned! Hope you enjoyed it.", "success");
  updateBorrowedUI(book, user);
}