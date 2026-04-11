// js/features/profile.js

// 1. Auth Guard: Redirects unauthenticated users
if (typeof requireAuth === 'function') {
    requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

// 2. Initialize Page
function initPage() {
    // Fetch user data (fallback to mock data for testing)
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : JSON.parse(localStorage.getItem('dv_current_user')) || {
        username: "alex_dev",
        email: "alex@example.com",
        createdAt: "2026-03-29",
        borrowedBooks: [{ bookId: "b_001", borrowedAt: "2026-03-29" }]
    };

    populateProfile(user);
    renderBorrowedList(user);
}

// 3. Fills in all the profile fields from the user object
function populateProfile(user) {
    if (!user) return;

    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const initialsEl = document.getElementById('profile-initials');
    const sinceEl = document.getElementById('profile-since');
    const countEl = document.getElementById('profile-count');

    if (usernameEl) usernameEl.textContent = `@${user.username}`;
    if (emailEl) emailEl.textContent = user.email;
    
    // Extract first 2 letters for the avatar
    if (initialsEl && user.username) {
        initialsEl.textContent = user.username.substring(0, 2).toUpperCase();
    }

    if (sinceEl && user.createdAt) {
        sinceEl.textContent = formatDate(user.createdAt);
    }

    if (countEl) {
        const count = user.borrowedBooks ? user.borrowedBooks.length : 0;
        countEl.textContent = `${count} title${count !== 1 ? 's' : ''}`;
    }
}

// 4. Renders the "Currently Borrowed" horizontal list
function renderBorrowedList(user) {
    const listContainer = document.getElementById('borrowed-list');
    if (!listContainer) return;

    // Show empty state message if no books are borrowed
    if (!user.borrowedBooks || user.borrowedBooks.length === 0) {
        listContainer.innerHTML = '<p class="empty-state__msg">No books currently borrowed.</p>';
        return;
    }

    // Fetch all books
    const allBooks = (typeof getBooks === 'function') ? getBooks() : JSON.parse(localStorage.getItem('dv_books')) || [
        { id: "b_001", name: "The Clean Coder", author: "Robert C. Martin", category: "Backend" }
    ];

    // Build HTML for each borrowed book
    const html = user.borrowedBooks.map(borrowed => {
        const book = allBooks.find(b => b.id === borrowed.bookId);
        return book ? buildBorrowedItem(book, borrowed.borrowedAt) : '';
    }).join('');

    listContainer.innerHTML = html;
}

// 5. Builds one horizontal borrowed item card HTML string
function buildBorrowedItem(book, borrowedAt) {
    // Assign specific icons based on the book category
    let icon = '🤍';
    if (book.category === 'Frontend') icon = '🎨';
    else if (book.category === 'Backend') icon = '⚙️';
    else if (book.category === 'Security') icon = '🛡️';
    else if (book.category === 'DevOps') icon = '🚀';

    // Item is now a clickable link to the detail page
    return `
        <a href="book-detail.html?id=${book.id}" class="borrowed-item" style="text-decoration: none; color: inherit; cursor: pointer;">
            <div class="borrowed-item__cover">
                <div class="library-cover-box" style="font-size: 8px;">
                    <span style="font-size: 16px; margin-bottom: 2px;">${icon}</span>
                    ${book.category.substring(0, 4).toUpperCase()}
                </div>
            </div>
            <div class="borrowed-item__info">
                <div class="borrowed-item__category">${book.category}</div>
                <div class="borrowed-item__title">${book.name}</div>
                <div class="borrowed-item__author">${book.author}</div>
                <div class="borrowed-item__date">📅 Borrowed ${formatDate(borrowedAt)}</div>
            </div>
        </a>
    `;
}

// 6. Formats a date string like "2026-03-29" -> "March 29, 2026"
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}
