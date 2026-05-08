document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

/**
 * Initial page setup
 */
async function initPage() {
  const users = await getUsers();

  renderUsersTable(users);

  const searchInput = document.getElementById("user-search");
  if (searchInput) {
    searchInput.addEventListener("input", filterUsers);
  }

  const confirmBtn = document.getElementById("confirm-delete-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", confirmDeleteUser);
  }
}

/**
 * Renders the user table rows or shows empty state
 */
function renderUsersTable(usersArray) {
  const tbody = document.getElementById("users-tbody");
  const userCountEl = document.getElementById("user-count");

  if (!tbody) return;

  userCountEl.textContent = usersArray.length;

  if (usersArray.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = usersArray.map(buildUserRow).join("");
}

/**
 * Builds ONE row of HTML for ONE user
 */
function buildUserRow(user) {
  const initials = getInitials(user.username);
  const isAdmin = user.isAdmin === true;

  const roleClass = isAdmin ? "role-badge--admin" : "role-badge--user";
  const roleText = isAdmin ? "ADMIN" : "USER";

  const currentUser = getCurrentUser();

  const canDelete =
    !isAdmin ||
    (currentUser?.username === "admin" && user.username !== "admin");

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
          ${
            canDelete
              ? `<span class="action-delete" onclick="openDeleteDialog('${user.id}')">Delete</span>`
              : '<span style="color:#ccc">—</span>'
          }
        </div>
      </td>
    </tr>
  `;
}

/**
 * Initials helper
 */
function getInitials(username) {
  if (!username) return "??";
  const parts = username.split(/[ _]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
}

/**
 * Filter users
 */
async function filterUsers() {
  const query = document.getElementById("user-search").value.toLowerCase().trim();

  const allUsers = await getUsers();

  const filtered = query
    ? allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    : allUsers;

  renderUsersTable(filtered);
}


// ======================================
// DELETE FLOW (FIXED TO USE API)
// ======================================

let selectedUserId = null;

function openDeleteDialog(userId) {
  selectedUserId = userId;
  document.getElementById("delete-overlay").classList.add("open");
}

function closeDeleteDialog() {
  selectedUserId = null;
  document.getElementById("delete-overlay").classList.remove("open");
}

async function confirmDeleteUser() {
  if (!selectedUserId) return;

  try {
    await deleteUser(selectedUserId); 

    closeDeleteDialog();

    const users = await getUsers(); // refresh from backend
    renderUsersTable(users);

    showToast("User deleted successfully", "success");

  } catch (error) {
    console.error(error);
    showToast("Failed to delete user", "error");
  }
}


// ======================================
// TOAST
// ======================================

function showToast(message, type = "default") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


// ======================================
// EDIT USER
// ======================================

function editUser(userId) {
  if (userId === "u_001") {
    openMainAdminEditDialog();
    return;
  }
  window.location.href = `edit-user.html?id=${userId}`;
}