requireAuth(false)

// Guards this page, loads book from URL param, populates the page
function initPage(){
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  let book = getBookById(bookId);
  let user = getCurrentUser();
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
}

// Handles the borrow button click
function handleBorrow(book, user) {
  if(user == null) {
    window.location.href = "../../pages/auth/login.html";
    return;
  }

  const today = new Date().toISOString();

  book.isAvailable = false;
  book.borrowedBy = user.id;
  book.borrowedAt = today;
  updateBook(book);

  user.borrowedBooks.push(book.id);
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

  if (book.isAvailable) {
    borrowBtn.disabled = false;
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
    borrowBtn.disabled = true;
    borrowBtn.textContent = "Already Borrowed";
    borrowBtn.classList.remove("available-button");
    borrowBtn.classList.add("unavailable-button");;
    badge.classList.remove('badge-available');
    badge.classList.remove(`badge-owned`);
    badge.classList.add(`badge-borrowed`);
    badge.textContent = 'BORROWED';

    // massage.style.visibility = 'visible';
    // document.getElementById('days-left').textContent = calculateDaysLeft(book.borrowedAt);

      if (book.borrowedBy === user.id) {
      borrowBtn.style.backgroundColor = '#16a367';
      borrowBtn.textContent = 'Read this Book';
      borrowBtn.disabled = false;

      borrowBtn.classList.remove("unavailable-button");
      borrowBtn.classList.add("available-button");
      badge.style.visibility = 'hidden';
    }
  }
  console.log( user.id);
}