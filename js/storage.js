// storage.js

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

    if (!user) return;

    /*
      IMPORTANT

      user.id must stay:
      u_001

      user._id:
      MongoDB ObjectId string
    */

    const normalizedUser = {
        ...user,

        id: user.id || "",

        _id: user._id || user.id
    };

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(normalizedUser)
    );
}


function getCurrentUser() {

    const user = localStorage.getItem(
        SESSION_KEY
    );

    if (!user) {
        return null;
    }

    try {

        const parsed = JSON.parse(user);

        /*
          Safety normalization
        */

        return {
            ...parsed,

            id: parsed.id || "",

            _id: parsed._id || parsed.id
        };

    } catch {

        return null;
    }
}

async function refreshCurrentUser() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return null;
    }

    try {

        /*
          Always refresh from server
          using MongoDB _id
        */

        const freshUser = await getUserById(
            currentUser._id
        );

        if (freshUser) {

            setCurrentUser(freshUser);

            return freshUser;
        }

        return currentUser;

    } catch (error) {

        console.error(
            'Failed to refresh current user:',
            error
        );

        return currentUser;
    }
}


function clearCurrentUser() {

    localStorage.removeItem(SESSION_KEY);
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

    clearCurrentUser();
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

    // Support custom id like b_001
    if (bookId && bookId.startsWith("b_")) {

        const books = await getBooks();

        return books.find(book => book.id === bookId) || null;
    }

    // MongoDB _id
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

    const mongoId = updatedBook._id || updatedBook.id;

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

    // Support custom id like u_001
    if (userId && userId.startsWith("u_")) {

        const users = await getUsers();

        return users.find(user => user.customId === userId) || null;
    }

    // MongoDB _id
    const data = await _api(
        "GET",
        `/users/${userId}/`
    );

    return data.user;
}


async function addUser(userData) {

    const data = await _api(
        "POST",
        "/users/create/",
        userData
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

    const currentUser = getCurrentUser();

    if (
        currentUser &&
        (
            currentUser._id === updatedUser._id ||
            currentUser.id === updatedUser.id
        )
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

    const data = await _api(
        "GET",
        "/users/count/"
    );

    return data.count || 0;
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

    const data = await _api(
        "POST",
        `/books/${bookMongoId}/borrow/`,
        {
            user_id: userMongoId,
            borrowedAt
        }
    );

    if (data.user) {

        const currentUser = getCurrentUser();

        if (
            currentUser &&
            currentUser._id === userMongoId
        ) {
            setCurrentUser(data.user);
        }
    }

    return data.book;
}


async function returnBook(bookMongoId, userMongoId) {

    const data = await _api(
        "POST",
        `/books/${bookMongoId}/return/`,
        {
            user_id: userMongoId
        }
    );

    if (data.user) {

        const currentUser = getCurrentUser();

        if (
            currentUser &&
            currentUser._id === userMongoId
        ) {
            setCurrentUser(data.user);
        }
    }

    return data.book;
}


// ======================================
// BORROWED BOOKS HELPER
// ======================================

async function getBorrowedBooks(userId) {

    const user = await getUserById(userId);

    if (
        !user ||
        !user.borrowedBooks ||
        !user.borrowedBooks.length
    ) {
        return [];
    }

    const allBooks = await getBooks();

    const books = [];

    for (const entry of user.borrowedBooks) {

        const bookCustomId = entry.bookId;

        const book = allBooks.find(
            b => b.id === bookCustomId
        );

        if (book) {
            books.push({
                ...book,
                borrowedAt: entry.borrowedAt
            });
        }
    }

    return books;
}


// ======================================
// BASE URL
// ======================================

const getBase = () => {
    const { origin, pathname } = window.location;
    const parts = pathname.split('/');

    // GitHub Pages
    if (origin.includes("github.io")) {
        return `${origin}/${parts[1]}/`;
    }

    // Local / normal hosting
    return `${origin}/`;
};