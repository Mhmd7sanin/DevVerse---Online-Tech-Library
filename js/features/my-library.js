// js/features/my-library.js

if (typeof requireAuth === 'function') {
    requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : JSON.parse(localStorage.getItem('dv_current_user')) || {
        borrowedBooks: [{ bookId: "b_001", borrowedAt: "2026-03-29" }, { bookId: "b_002", borrowedAt: "2026-03-24" }]
    };

    const books = getUserBooks(user);
    updateBookCount(books.length);
    renderLibraryGrid(books);
}

function getUserBooks(user) {
    if (!user || !user.borrowedBooks) return [];
    
    const allBooks = (typeof getBooks === 'function') ? getBooks() : JSON.parse(localStorage.getItem('dv_books')) || [
        { id: "b_001", name: "Python Crash Course", author: "Eric Matthes", category: "Backend" },
        { id: "b_002", name: "Atomic Habits", author: "James Clear", category: "Productivity" }
    ];

    return user.borrowedBooks.map(borrowed => {
        const bookInfo = allBooks.find(b => b.id === borrowed.bookId);
        return { ...bookInfo, borrowedAt: borrowed.borrowedAt };
    }).filter(b => b.id);
}

// Function to return clean SVG icons based on category
function getCategorySVG(category) {
    const baseStyle = 'width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    
    switch(category) {
        case 'Productivity':
            // Simple Heart SVG
            return `<svg ${baseStyle}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        case 'Backend':
            // Simple Gear SVG
            return `<svg ${baseStyle}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        case 'Security':
            // Simple Shield SVG
            return `<svg ${baseStyle}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
        default:
            // Default Code/Frontend SVG
            return `<svg ${baseStyle}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    }
}

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

function buildLibraryCard(book) {
    // Call the SVG function
    const svgIcon = getCategorySVG(book.category);

    return `
        <div class="book-card">
            <div class="book-card__cover">
                <div class="library-cover-box">
                    <div class="svg-wrapper">${svgIcon}</div>
                    ${book.category.substring(0, 4).toUpperCase()}
                </div>
            </div>
            <div class="book-card__body">
                <div class="book-card__category">${book.category.toUpperCase()}</div>
                <h3 class="book-card__title">${book.name}</h3>
                <p class="book-card__author">${book.author}</p>
                <button class="btn btn-primary btn-full" style="margin-top: auto;" onclick="alert('Enjoy reading ${book.name}!')">Read Now</button>
            </div>
        </div>
    `;
}

function updateBookCount(count) {
    const countEl = document.getElementById('borrow-count');
    if (countEl) {
        countEl.textContent = `You have borrowed ${count} book${count !== 1 ? 's' : ''}.`;
    }
}
