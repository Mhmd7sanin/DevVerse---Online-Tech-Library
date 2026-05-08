let bookToDeleteId = null;

async function initPage() {

    requireAuth(true);

    const searchInput = document.getElementById('search-input');
    const dialogCancel = document.getElementById('dialog-cancel');
    const dialogConfirm = document.getElementById('dialog-confirm');

    searchInput.addEventListener('input', filterBooks);
    dialogCancel.addEventListener('click', closeDeleteDialog);
    dialogConfirm.addEventListener('click', confirmDelete);

    const allBooks = await getBooks();
    renderTable(allBooks);
}


/* ============================================================
   TABLE RENDERING (UNCHANGED LOGIC)
============================================================ */

function renderTable(booksArray) {
    const tableBody = document.getElementById('table-body');
    const bookCount = document.getElementById('book-count');

    bookCount.textContent = `Total books: ${booksArray.length}`;

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


/* ============================================================
   SEARCH
============================================================ */

async function filterBooks() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const allBooks = await getBooks();

    const filtered = allBooks.filter(book => {
        return book.name.toLowerCase().includes(searchInput) ||
               book.author.toLowerCase().includes(searchInput) ||
               book.category.toLowerCase().includes(searchInput);
    });

    renderTable(filtered);
}


/* ============================================================
   DELETE FLOW (FIXED → API BASED)
============================================================ */

function openDeleteDialog(bookId) {
    bookToDeleteId = bookId;
    document.getElementById('delete-dialog').classList.add('open');
}

function closeDeleteDialog() {
    bookToDeleteId = null;
    document.getElementById('delete-dialog').classList.remove('open');
}

async function confirmDelete() {
    if (!bookToDeleteId) return;

    try {
        await deleteBook(bookToDeleteId);

        closeDeleteDialog();

        const updatedBooks = await getBooks();
        renderTable(updatedBooks);

        if (typeof showToast === 'function') {
            showToast('Book deleted successfully', 'danger');
        }

    } catch (error) {
        console.error(error);
        if (typeof showToast === 'function') {
            showToast('Failed to delete book', 'danger');
        }
    }
}


/* ============================================================
   EMPTY STATE
============================================================ */

function toggleEmptyState(show) {
    const emptyState = document.getElementById('empty-state');

    if (!emptyState) return;

    emptyState.style.display = show ? 'block' : 'none';
}


/* ============================================================
   INIT
============================================================ */

document.addEventListener('DOMContentLoaded', initPage);