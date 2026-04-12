
function initPage() {
 
     requireAuth(true);

   
    const form = document.getElementById('book-form');
    form.addEventListener('submit', handleAddBook);
}

function handleAddBook(event) {
    event.preventDefault();

  
    if (!validateForm()) {
        return; 
    }


    const name = document.getElementById('book-name').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    const allBooks = getBooks();
    const nextNumber = allBooks.length + 2; // as we start with b_001, we add 2 to get the next ID number
    const idFormat = 'b_' + nextNumber.toString().padStart(3, '0');

 
    const newBook = {
        
        id: idFormat, 
        name: name,
        author: author,
        category: category,
        description: description,
        isAvailable: true,
        borrowedBy: null,
        borrowedAt: null
    };

    
    addBook(newBook);

    
    if (typeof showToast === 'function') {
        showToast('Book published successfully!', 'success');
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