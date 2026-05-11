/* ============================================================
   DevVerse — admin-users.js
   Backend API Version + Original UI Design
============================================================ */

let selectedUserId = null;


/* ============================================================
   INIT
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

async function initPage() {

  requireAuth(true);

  const searchInput = document.getElementById('user-search');
  const confirmBtn = document.getElementById('confirm-delete-btn');

  if (searchInput) {
    searchInput.addEventListener('input', filterUsers);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmDelete);
  }

  const users = await getUsers();
  renderUsersTable(users);
}


/* ============================================================
   RENDER TABLE
============================================================ */

function renderUsersTable(usersArray) {

  const tbody = document.getElementById('users-tbody');
  const userCountEl = document.getElementById('user-count');

  if (!tbody) return;

  userCountEl.textContent = usersArray.length;

  if (usersArray.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:20px;">
          No users found.
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = usersArray.map(buildUserRow).join('');
}


/* ============================================================
   BUILD USER ROW
============================================================ */

function buildUserRow(user) {

  const initials = getInitials(user.username);

  const isAdmin = user.isAdmin === true;

  const roleClass =
    isAdmin
      ? 'role-badge--admin'
      : 'role-badge--user';

  const roleText =
    isAdmin
      ? 'ADMIN'
      : 'USER';

  const currentUser = getCurrentUser();

  const canDelete =
    !isAdmin ||
    (
      currentUser?.username === 'admin' &&
      user.username !== 'admin'
    );

  return `
    <tr>

      <td>
        <div class="user-info">

          <div class="avatar">
            ${initials}
          </div>

          <div class="user-details">
            <span class="name">
              ${escapeHtml(user.username)}
            </span>

            <span class="email">
              ${escapeHtml(user.email || '')}
            </span>
          </div>

        </div>
      </td>

      <td>
        <span class="role-badge ${roleClass}">
          ${roleText}
        </span>
      </td>

      <td>
        ${(user.borrowedBooks || []).length} books
      </td>

      <td>
        <div class="table-actions">

          <span
            class="action-edit"
            onclick="editUser('${user._id}')"
          >
            Edit
          </span>

          ${
            canDelete
              ? `
                <span
                  class="action-delete"
                  onclick="openDeleteDialog('${user._id}')"
                >
                  Delete
                </span>
              `
              : '<span style="color:#ccc">—</span>'
          }

        </div>
      </td>

    </tr>
  `;
}


/* ============================================================
   SEARCH USERS
============================================================ */

async function filterUsers() {

  const query = document
    .getElementById('user-search')
    .value
    .toLowerCase()
    .trim();

  const allUsers = await getUsers();

  const filtered = query
    ? allUsers.filter(user =>
        user.username.toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query)
      )
    : allUsers;

  renderUsersTable(filtered);
}


/* ============================================================
   DELETE DIALOG
============================================================ */

function openDeleteDialog(userId) {

  selectedUserId = userId;

  const overlay = document.getElementById('delete-overlay');

  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeDeleteDialog() {

  selectedUserId = null;

  const overlay = document.getElementById('delete-overlay');

  if (overlay) {
    overlay.classList.remove('open');
  }
}


/* ============================================================
   CONFIRM DELETE
============================================================ */

async function confirmDelete() {

  if (!selectedUserId) return;

  try {

    await deleteUser(selectedUserId);

    closeDeleteDialog();

    const users = await getUsers();
    renderUsersTable(users);

    showToast('User deleted successfully', 'success');

  } catch (error) {

    console.error(error);

    showToast('Failed to delete user', 'danger');
  }
}


/* ============================================================
   EDIT USER
============================================================ */

function editUser(userId) {

  const currentUser = getCurrentUser();

  /*
    Main admin protection
  */

  if (
    currentUser?.username !== 'admin' &&
    userId === currentUser?._id
  ) {
    return;
  }

  /*
    Open protected admin dialog
  */

  if (userId) {

    getUserById(userId).then(user => {

      if (user?.username === 'admin') {
        openMainAdminEditDialog();
        return;
      }

      window.location.href =
        `edit-user.html?id=${userId}`;
    });
  }
}


/* ============================================================
   MAIN ADMIN DIALOG
============================================================ */

function openMainAdminEditDialog() {

  const overlay = document.getElementById('edit-overlay');

  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeEditDialog() {

  const overlay = document.getElementById('edit-overlay');

  if (overlay) {
    overlay.classList.remove('open');
  }
}


/* ============================================================
   HELPERS
============================================================ */

function getInitials(username) {

  if (!username) return '??';

  const parts = username.split(/[ _]/);

  if (parts.length >= 2) {
    return (
      parts[0][0] +
      parts[1][0]
    ).toUpperCase();
  }

  return username.substring(0, 2).toUpperCase();
}

function escapeHtml(str) {

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}