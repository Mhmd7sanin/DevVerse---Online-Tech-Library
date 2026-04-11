// js/features/profile.js

if (typeof requireAuth === 'function') {
    requireAuth(false);
}

document.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : JSON.parse(localStorage.getItem('dv_current_user')) || {
        username: "omar_coder",
        email: "omar@example.com",
        createdAt: "2026-02-20",
        borrowedBooks: [{ bookId: "b_001", borrowedAt: "2026-03-22" }]
    };

    populateProfile(user);
    renderBorrowedList(user);
}

function populateProfile(user) {
    if (!user) return;

    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const initialsEl = document.getElementById('profile-initials');
    const sinceEl = document.getElementById('profile-since');
    const countEl = document.getElementById('profile-count');

    if (usernameEl) usernameEl.textContent = `@${user.username}`;
    if (emailEl) emailEl.textContent = user.email;
    
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

// Function to return clean SVG icons (same as library)
function getCategorySVG(category) {
    const baseStyle = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    switch(category) {
        case 'Productivity': return `<svg ${baseStyle}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        case 'Backend': return `<svg ${baseStyle}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        case 'Security': return `<svg ${baseStyle}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
        default: return `<svg ${baseStyle}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    }
}

function renderBorrowedList(user) {
    const listContainer = document.getElementById('borrowed-list');
    if (!listContainer) return;

    if (!user.borrowedBooks || user.borrowedBooks.length === 0) {
        listContainer.innerHTML = '<p class="empty-state__msg">No books currently borrowed.</p>';
        return;
    }

    const allBooks = (typeof getBooks === 'function') ? getBooks() : JSON.parse(localStorage.getItem('dv_books')) || [];

    const html = user.borrowedBooks.map(borrowed => {
        const book = allBooks.find(b => b.id === borrowed.bookId);
        return book ? buildBorrowedItem(book, borrowed.borrowedAt) : '';
    }).join('');

    listContainer.innerHTML = html;
}

function buildBorrowedItem(book, borrowedAt) {
    const svgIcon = getCategorySVG(book.category);
    
    return `
        <div class="borrowed-item">
            <div class="borrowed-item__cover">
                <div class="library-cover-box" style="font-size: 10px;">
                    <div class="svg-wrapper" style="margin-bottom: 4px; color: var(--color-text-secondary);">${svgIcon}</div>
                    ${book.category.substring(0, 4).toUpperCase()}
                </div>
            </div>
            <div class="borrowed-item__info">
                <div class="borrowed-item__category">${book.category.toUpperCase()}</div>
                <div class="borrowed-item__title">${book.name}</div>
                <div class="borrowed-item__author">${book.author}</div>
                <div class="borrowed-item__date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Borrowed ${formatDate(borrowedAt)}
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}
