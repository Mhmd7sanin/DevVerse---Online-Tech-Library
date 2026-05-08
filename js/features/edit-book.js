/* ============================================================
   DevVerse — edit-book.js
============================================================ */

let currentBookId = null;   // MongoDB _id from URL
let currentBookData = null; // full book object


function initPage() {

  requireAuth(true);

  const urlParams = new URLSearchParams(window.location.search);
  currentBookId = urlParams.get('id');

  if (!currentBookId) {
    window.location.href = 'dashboard.html';
    return;
  }

  loadBookData();

  document.getElementById('book-form')
    .addEventListener('submit', handleEditBook);
}


/* ============================================================
   LOAD BOOK — fetch by MongoDB _id directly
============================================================ */
async function loadBookData() {

  const book = await getBookById(currentBookId);

  if (!book) {
    window.location.href = 'dashboard.html';
    return;
  }

  currentBookData = book;

  document.getElementById('book-name').value = book.name;
  document.getElementById('author').value = book.author;
  document.getElementById('category').value = book.category;
  document.getElementById('description').value = book.description;
}


/* ============================================================
   EDIT BOOK
============================================================ */
async function handleEditBook(event) {

  event.preventDefault();

  if (!validateForm()) return;

  const updatedBook = {
    ...currentBookData,
    name:        document.getElementById('book-name').value.trim(),
    author:      document.getElementById('author').value.trim(),
    category:    document.getElementById('category').value,
    description: document.getElementById('description').value.trim()
  };

  try {

    await updateBook(updatedBook);

    showToast('Book updated successfully!', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);

  } catch (error) {
    console.error(error);
    showToast('Failed to update book', 'danger');
  }
}


/* ============================================================
   HELPERS
============================================================ */

function showFieldError(fieldId, message) {
  const errorSpan = document.getElementById(fieldId);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.form-error');
  errors.forEach(error => {
    error.textContent = '';
    error.style.display = 'none';
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast toast--' + type + ' toast--show';
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}


/* ============================================================
   VALIDATION
============================================================ */
function validateForm() {

  clearErrors();
  let isValid = true;

  const name = document.getElementById('book-name').value.trim();
  if (!name) {
    showFieldError('error-book-name', 'Book name is required.');
    isValid = false;
  }

  const author = document.getElementById('author').value.trim();
  if (!author) {
    showFieldError('error-author', 'Author name is required.');
    isValid = false;
  }

  const category = document.getElementById('category').value;
  if (!category) {
    showFieldError('error-category', 'Please select a valid category.');
    isValid = false;
  }

  const description = document.getElementById('description').value.trim();
  if (!description) {
    showFieldError('error-description', 'Book description is required.');
    isValid = false;
  }

  return isValid;
}


/* ============================================================
   INIT
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);