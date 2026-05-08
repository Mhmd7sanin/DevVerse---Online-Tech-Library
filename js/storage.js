const API_BASE = "http://127.0.0.1:8000/api";

const SESSION_KEY = "dv_current_user";


// ======================================
// API HELPER
// ======================================

async function _api(method, path, body = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, options);

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "API request failed");
    }

    return data;
}


// ======================================
// LOCAL STORAGE SESSION
// ======================================

function setCurrentUser(user) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}


function getCurrentUser() {

    const user = localStorage.getItem(SESSION_KEY);

    return user ? JSON.parse(user) : null;
}


function removeCurrentUser() {

    localStorage.removeItem(SESSION_KEY);
}


function isLoggedIn() {

    return getCurrentUser() !== null;
}


// ======================================
// AUTH
// ======================================

async function signup(userData) {

    const data = await _api(
        "POST",
        "/auth/signup/",
        userData
    );

    if (data.success && data.user) {
        setCurrentUser(data.user);
    }

    return data;
}


async function login(username, password) {

    const data = await _api(
        "POST",
        "/auth/login/",
        {
            username,
            password
        }
    );

    if (data.success && data.user) {
        setCurrentUser(data.user);
    }

    return data;
}


function logout() {

    removeCurrentUser();
}


// ======================================
// BOOKS
// ======================================

async function getBooks() {

    const data = await _api(
        "GET",
        "/books/"
    );

    return data.books || [];
}


async function getBookById(bookId) {
    // bookId can be MongoDB _id (hex string) OR custom id (b_001)
    // The URL route uses MongoDB _id, so if it looks like a custom id,
    // we fetch all books and find by custom id instead.

    if (bookId && bookId.startsWith("b_")) {
        const books = await getBooks();
        return books.find(b => b.id === bookId) || null;
    }

    const data = await _api(
        "GET",
        `/books/${bookId}/`
    );

    return data.book;
}


async function addBook(bookData) {

    const data = await _api(
        "POST",
        "/books/",
        bookData
    );

    return data.book;
}


async function updateBook(updatedBook) {

    // Always use MongoDB _id for the URL
    const bookId = updatedBook._id || updatedBook.id;

    // If the id looks like a custom id (b_001), we need the _id instead
    // In this case updatedBook should always have _id from the API response
    const mongoId = updatedBook._id || bookId;

    const data = await _api(
        "PUT",
        `/books/${mongoId}/`,
        updatedBook
    );

    return data.book;
}


async function deleteBook(bookId) {

    return await _api(
        "DELETE",
        `/books/${bookId}/`
    );
}


async function getBooksNumber() {

    const data = await _api(
        "GET",
        "/books/count/"
    );

    return data.count || 0;
}


// ======================================
// USERS
// ======================================

async function getUsers() {

    const data = await _api(
        "GET",
        "/users/"
    );

    return data.users || [];
}


async function getUserById(userId) {

    const data = await _api(
        "GET",
        `/users/${userId}/`
    );

    return data.user;
}


async function updateUser(updatedUser) {

    const userId = updatedUser._id || updatedUser.id;

    const data = await _api(
        "PUT",
        `/users/${userId}/`,
        updatedUser
    );

    // Update local storage if current user updated himself
    const currentUser = getCurrentUser();

    if (
        currentUser &&
        (currentUser.id === updatedUser.id || currentUser._id === updatedUser._id)
    ) {
        setCurrentUser(data.user);
    }

    return data.user;
}


async function deleteUser(userId) {

    return await _api(
        "DELETE",
        `/users/${userId}/`
    );
}


async function getUsersNumber() {

    const users = await getUsers();

    return users.length;
}


async function getUserByUsername(username) {

    const users = await getUsers();

    return users.find(
        user => user.username === username
    ) || null;
}


// ======================================
// BORROW / RETURN
// ======================================

async function borrowBook(bookMongoId, userMongoId, borrowedAt = "") {
    // bookMongoId  = book._id  (MongoDB hex, used in URL)
    // userMongoId  = user._id  (MongoDB hex, sent in body)

    const data = await _api(
        "POST",
        `/books/${bookMongoId}/borrow/`,
        {
            user_id: userMongoId,
            borrowedAt: borrowedAt
        }
    );

    // Server returns updated user — sync session
    if (data.user) {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser._id === userMongoId) {
            setCurrentUser(data.user);
        }
    }

    return data.book;
}


async function returnBook(bookMongoId, userMongoId) {
    // bookMongoId  = book._id  (MongoDB hex, used in URL)
    // userMongoId  = user._id  (MongoDB hex, sent in body)

    const data = await _api(
        "POST",
        `/books/${bookMongoId}/return/`,
        {
            user_id: userMongoId
        }
    );

    // Server returns updated user — sync session
    if (data.user) {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser._id === userMongoId) {
            setCurrentUser(data.user);
        }
    }

    return data.book;
}


// ======================================
// BORROWED BOOKS HELPER
// ======================================

async function getBorrowedBooks(userId) {
    // userId = MongoDB _id of the user

    const user = await getUserById(userId);

    if (!user || !user.borrowedBooks || !user.borrowedBooks.length) {
        return [];
    }

    // borrowedBooks is now [{bookId: "b_001", borrowedAt: "..."}, ...]
    const allBooks = await getBooks();
    const books = [];

    for (const entry of user.borrowedBooks) {
        const bookCustomId = typeof entry === "object" ? entry.bookId : entry;
        const book = allBooks.find(b => b.id === bookCustomId);
        if (book) {
            books.push({
                ...book,
                borrowedAt: typeof entry === "object" ? entry.borrowedAt : null
            });
        }
    }

    return books;
}


// --- BASE URL ---
const getBase = () => {
  const { origin, pathname } = window.location;
  const parts = pathname.split('/');

  if (origin.includes("github.io")) {
    return `${origin}/${parts[1]}/`;
  }

  return `${origin}/`;
};