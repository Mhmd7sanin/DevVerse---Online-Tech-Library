let book;

function initPage() {
  requireAuth(false);

  book = getBookFromUrl();
  populatePage(book);

  document.getElementById("borrow-btn")
    .addEventListener("click", handleBorrow);
}

function getBookFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const books = getBooks();
  const found = books.find(b => b.id === id);

  if (!found) {
    window.location.href = "/pages/user/browse.html";
  }

  return found;
}

function populatePage(book) {
  document.getElementById("book-category").textContent = book.category;
  document.getElementById("book-title").textContent = book.title;
  document.getElementById("book-author").textContent = "by " + book.author;
  document.getElementById("book-description").textContent = book.description;

  if (!book.isAvailable) {
    updateBorrowedUI();
  }
}


function handleBorrow() {
  const user = getCurrentUser();

  const today = new Date().toISOString();

  book.isAvailable = false;
  book.borrowedBy = user.id;
  book.borrowedAt = today;

  updateBook(book);

  user.borrowedBooks.push({
    bookId: book.id,
    borrowedAt: today
  });

  updateUser(user);
  setCurrentUser(user);
  isavailable(book.isAvailable);
  availableButton(book.isAvailable);

  showToast("Book borrowed! Enjoy reading.", "success");
}




function isavailable(state_boolean) {
    let state = state_boolean ? 'available' : 'borrowed';

    let badge = document.getElementById('availability-badge');

    badge.classList.add(`badge-${state}`);
    badge.textContent = state.toUpperCase();

}



function availableButton(state_boolean) {
  let borrowBtn = document.getElementById("borrow-btn");
  if (state_boolean) {
    borrowBtn.disabled = false;
    borrowBtn.textContent = "Borrow this Book";
    borrowBtn.classList.remove("unavailable-button");
    borrowBtn.classList.add("available-button");
  } else {
    borrowBtn.disabled = true;
    borrowBtn.textContent = "Already Borrowed";
    borrowBtn.classList.remove("available-button");
    borrowBtn.classList.add("unavailable-button");
  }
}


initPage();