// js/features/my-library.js

// 1. Auth Guard: Redirects unauthenticated users
if (typeof requireAuth === 'function') {
    requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

// 2. Initialize Page
function initPage() {
    // Fetch the current logged-in user (fallback to mock data for testing)
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : JSON.parse(localStorage.getItem('dv_current_user')) || {
        borrowedBooks: [{ bookId: "b_001", borrowedAt: "2026-03-29" }]
    };

    const books = getUserBooks(user);
    updateBookCount(books.length);
    renderLibraryGrid(books);
}

// 3. Get all Book objects for the current user's borrowedBooks list
function getUserBooks(user) {
    if (!user || !user.borrowedBooks) return [];
    
    // Fetch all books from storage
    const allBooks = (typeof getBooks === 'function') ? getBooks() : JSON.parse(localStorage.getItem('dv_books')) || [
        { id: "b_001", name: "The Clean Coder", author: "Robert C. Martin", category: "Backend" }
    ];

    // Map borrowed book IDs to actual book objects
    return user.borrowedBooks.map(borrowed => {
        const bookInfo = allBooks.find(b => b.id === borrowed.bookId);
        return { ...bookInfo, borrowedAt: borrowed.borrowedAt };
    }).filter(b => b.id);
}

// 4. Render the book grid or show the empty state
function renderLibraryGrid(books) {
    const grid = document.getElementById('library-grid');
    const emptyState = document.getElementById('empty-state');

    if (!grid || !emptyState) return;

    if (books.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    grid.innerHTML = books.map(book => buildLibraryCard(book)).join('');
}

// 5. Build one book card HTML string
function buildLibraryCard(book) {
    // Assign specific icons based on the book category
    let icon = '🤍';
    if (book.category === 'Frontend') icon = '🎨';
    else if (book.category === 'Backend') icon = '⚙️';
    else if (book.category === 'Security') icon = '🛡️';
    else if (book.category === 'DevOps') icon = '🚀';

    return `
        <div class="book-card">
            <div class="book-card__cover">
                <div class="library-cover-box">
                    <span>${icon}</span>
                    ${book.category.substring(0, 4).toUpperCase()}
                </div>
            </div>
            <div class="book-card__body">
                <div class="book-card__category">${book.category}</div>
                <h3 class="book-card__title">${book.name}</h3>
                <p class="book-card__author">${book.author}</p>
                <button class="btn btn-primary btn-full" style="margin-top: auto;" onclick="alert('Enjoy reading ${book.name}!')">Read Now</button>
            </div>
        </div>
    `;
}

// 6. Update the "You have borrowed X books." subtitle
function updateBookCount(count) {
    const countEl = document.getElementById('borrow-count');
    if (countEl) {
        countEl.textContent = `You have borrowed ${count} book${count !== 1 ? 's' : ''}.`;
    }
}
