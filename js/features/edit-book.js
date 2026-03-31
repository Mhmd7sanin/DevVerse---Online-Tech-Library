

let currentBookId = null;
let currentBookStatus = null; 

function initPage() {
  
    requireAuth(true);


    const urlParams = new URLSearchParams(window.location.search);
    currentBookId = urlParams.get('id');

    if (!currentBookId) {
        window.location.href = 'dashboard.html';
        return;
    }


    loadBookData();

    const form = document.getElementById('book-form');
    form.addEventListener('submit', handleEditBook);
}

function loadBookData() {
    const books = getBooks();
    const book = books.find(b => b.id === currentBookId);

   
    if (!book) {
        window.location.href = 'dashboard.html';
        return;
    }

   
    currentBookStatus = {
        isAvailable: book.isAvailable,
        borrowedBy: book.borrowedBy,
        borrowedAt: book.borrowedAt
    };

   
    document.getElementById('book-name').value = book.name;
    document.getElementById('author').value = book.author;
    document.getElementById('category').value = book.category;
    document.getElementById('description').value = book.description;
}

function handleEditBook(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    
    const name = document.getElementById('book-name').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();


    const updatedBook = {
        id: currentBookId,
        name: name,
        author: author,
        category: category,
        description: description,
        isAvailable: currentBookStatus.isAvailable,
        borrowedBy: currentBookStatus.borrowedBy,
        borrowedAt: currentBookStatus.borrowedAt
    };

    
    const books = getBooks();
    const bookIndex = books.findIndex(b => b.id === currentBookId);
    
    if (bookIndex !== -1) {
        books[bookIndex] = updatedBook;
        saveBooks(books);
    }

  
    if (typeof showToast === 'function') {
        showToast('Book updated successfully!', 'success');
    }

 
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

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

function showFieldError(fieldId, message) {
    const errorSpan = document.getElementById(fieldId);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'var(--color-danger, #DC2626)';
        errorSpan.style.fontSize = '12px';
        errorSpan.style.marginTop = '4px';
    }
}

function clearErrors() {
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}


document.addEventListener('DOMContentLoaded', initPage);