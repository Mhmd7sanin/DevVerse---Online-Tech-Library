

let bookToDeleteId = null;

function initPage() {
    
 requireAuth(true);

    
    const searchInput = document.getElementById('search-input');
    const dialogCancel = document.getElementById('dialog-cancel');
    const dialogConfirm = document.getElementById('dialog-confirm');

   
    searchInput.addEventListener('input', filterBooks);
    dialogCancel.addEventListener('click', closeDeleteDialog);
    dialogConfirm.addEventListener('click', confirmDelete);

  
    const allBooks = getBooks();
    renderTable(allBooks);
}

function renderTable(booksArray) {
    const tableBody = document.getElementById('table-body');
    const bookCount = document.getElementById('book-count');

    bookCount.textContent = `Total books: ${booksArray.length +1}`;
    
   
    tableBody.innerHTML = '';

    if (booksArray.length === 0) {
        toggleEmptyState(true);
    } else {
        toggleEmptyState(false);
    
        booksArray.forEach(book => {
            tableBody.innerHTML += buildTableRow(book);
        });
    }
}

function buildTableRow(book) {
    return `
        <tr>
            <td class="table-id">#${book.id}</td>
            <td><strong>${book.name}</strong></td>
            <td>${book.author}</td>
            <td><span class="category-chip">${book.category}</span></td>
            <td>
                <div class="table-actions">
                    <a href="edit-book.html?id=${book.id}" class="btn btn-secondary btn-sm">Edit</a>
                    <button onclick="openDeleteDialog('${book.id}')" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

function filterBooks() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const allBooks = getBooks();
    
    const filtered = allBooks.filter(book => {
        return book.name.toLowerCase().includes(searchInput) || 
               book.author.toLowerCase().includes(searchInput) ||
               book.category.toLowerCase().includes(searchInput);
    });
    
    renderTable(filtered);
}

function openDeleteDialog(bookId) {
    bookToDeleteId = bookId;
    document.getElementById('delete-dialog').classList.add('open');
}

function closeDeleteDialog() {
    bookToDeleteId = null;
    document.getElementById('delete-dialog').classList.remove('open');
}

function confirmDelete() {
    if (!bookToDeleteId) return;

    let allBooks = getBooks();
    
    allBooks = allBooks.filter(book => book.id !== bookToDeleteId);
    

    saveBooks(allBooks);
   
    closeDeleteDialog();
    renderTable(getBooks());
    
    
    if (typeof showToast === 'function') {
        showToast('Book deleted successfully', 'danger');
    }
}

function toggleEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    if (show) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', initPage);