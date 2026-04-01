/**
 * DevVerse — admin-users.js
 * Member 6: User Management Logic
 */

// 1. Auth guard FIRST — Only admins can access this page
// Assuming requireAuth(true) is defined in a global auth script
// const currentUser = requireAuth(true); 

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

/**
 * Initial page setup
 */
function initPage() {
    // 2. Load data from storage (using storage.js)
    const users = getUsers();

    // 3. Render the data into the page
    renderUsersTable(users);

    // 4. Wire up events (search)
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
}

/**
 * Renders the user table rows or shows empty state
 * @param {Array} usersArray 
 */
function renderUsersTable(usersArray) {
    const tbody = document.getElementById('users-tbody');
    const userCountEl = document.getElementById('user-count');

    if (!tbody) return;

    // Update the counter at the top
    userCountEl.textContent = usersArray.length;

    if (usersArray.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No users found.</td></tr>`;
        return;
    }

    // Rule: Use .map(buildUserRow).join('') to render lists
    tbody.innerHTML = usersArray.map(buildUserRow).join('');
}

/**
 * Builds ONE row of HTML for ONE user
 * @param {Object} user 
 * @returns {string} HTML row
 */
function buildUserRow(user) {
  const initials = getInitials(user.username);
  const isAdmin = user.isAdmin === true;

  const roleClass = isAdmin ? 'role-badge--admin' : 'role-badge--user';
  const roleText = isAdmin ? 'ADMIN' : 'USER';

  return `
    <tr>
      <td>
        <div class="user-info">
          <div class="avatar">${initials}</div>
          <div class="user-details">
            <span class="name">${user.username}</span>
            <span class="email">${user.email}</span>
          </div>
        </div>
      </td>

      <td>
        <span class="role-badge ${roleClass}">${roleText}</span>
      </td>

      <td>${user.borrowedBooks.length} books</td>

      <td>
        <div class="table-actions">
          <span class="action-edit" onclick="editUser('${user.id}')">Edit</span>
          ${!isAdmin 
            ? `<span class="action-delete" onclick="deleteUser('${user.id}')">Delete</span>` 
            : '<span style="color:#ccc">—</span>'}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Returns initials from username (e.g., "alex_reader" -> "AR")
 */
function getInitials(username) {
    if (!username) return "??";
    // Split by space or underscore
    const parts = username.split(/[ _]/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
}

/**
 * Filters users by search input text
 */
function filterUsers() {
    const query = document.getElementById('user-search').value.toLowerCase().trim();
    const allUsers = getUsers(); // Get fresh data from storage.js

    const filtered = query
        ? allUsers.filter(user => 
            user.username.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
          )
        : allUsers;

    renderUsersTable(filtered);
}

/**
 * Deletes a user by ID and refreshes the table
 */
function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        // Use storage.js logic: Get, Filter, Save
        let users = getUsers();
        users = users.filter(u => u.id !== userId);
        
        saveUsers(users); // Function from storage.js
        
        // Re-render the table with fresh data
        renderUsersTable(getUsers());
        showToast('User deleted successfully', 'success'); // If you have a toast system
    }
}

/**
 * Redirects to the Edit User page
 */
function editUser(userId) {
    window.location.href = `edit-user.html?id=${userId}`;
}
