
/* ═══════════════════════════════════════════════════
   DevVerse — storage.js
   THE ONLY FILE that touches localStorage.
   Phase 2: replace these functions with fetch() calls.
═══════════════════════════════════════════════════ */


// Keys used
const KEYS = {
  BOOKS:        'dv_books',
  USERS:        'dv_users',
  CURRENT_USER: 'dv_current_user'
};

// --- BOOKS ---
function getBooksNumber()  {
    let books = localStorage.getItem(KEYS.BOOKS);
    if (!books) return 0;
    return JSON.parse(books).length;
}     // Returns number of books in storage, 0 if empty

function getBooks()  {
    if (!localStorage.getItem(KEYS.BOOKS)) {
        seedIfEmpty(); 
    }

    let books = localStorage.getItem(KEYS.BOOKS);
    return JSON.parse(books) || [];

}     // Returns Book[] from storage


function saveBooks(books)   {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));

}     // Overwrites all books in storage


function getBookById(id) {
    let books = getBooks();
    return books.find(b => b.id === id) || null;

}     // Returns one Book or null


function addBook(book)    {
    let books = getBooks();
    books.push(book);
    saveBooks(books);
}     // Adds one book, saves


function updateBook(updated) {
    let books = getBooks();
    let index = books.findIndex(b => b.id === updated.id);
    if (index !== -1) {
        books[index] = updated;
        saveBooks(books);
    }
}     // Replaces book by id, saves


function deleteBook(id)    {
    let books = getBooks();
    books = books.filter(b => b.id !== id);
    saveBooks(books);
}     // Removes book by id, saves

// --- USERS ---
function getUsersNumber()  {
    let users = localStorage.getItem(KEYS.USERS);
    if (!users) return 0;
    return JSON.parse(users).length;
}    // Returns number of users in storage, 0 if empty


function getUsers()       {
    if (!localStorage.getItem(KEYS.USERS)) {
        seedIfEmpty(); 
    }   

    let users = localStorage.getItem(KEYS.USERS);
    return JSON.parse(users) || [];
}    // Returns User[] from storage


function saveUsers(users)    {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

}     // Overwrites all users in storage


function getUserByUsername(username) {
    let users = getUsers();
    return users.find(user => user.username === username) || null;

}     // Returns User or null


function getUserById(id)  {
    let users = getUsers();
    return users.find(user => user.id === id) || null;  

}     // Returns User or null


function addUser(user)  {
    let users = getUsers();
    users.push(user);
    saveUsers(users);   

}      // Adds one user, saves


function updateUser(updated)    {
    let users = getUsers();
    let index = users.findIndex(u => u.id === updated.id);
    if (index !== -1) {
        users[index] = updated;
        saveUsers(users);
    }

}      // Replaces user by id, saves

// --- SESSION ---
function getCurrentUser()        {
    let user = localStorage.getItem(KEYS.CURRENT_USER);
    return JSON.parse(user) || null;    

}      // Returns logged-in User or null


function setCurrentUser(user)    {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));

}      // Saves user to dv_current_user


function clearCurrentUser()      {
    localStorage.removeItem(KEYS.CURRENT_USER);

}      // Removes dv_current_user (logout)

// --- BASE URL ---
const getBase = () => {
  const { origin, pathname } = window.location;
  const parts = pathname.split('/');

  // detect if running locally or GitHub Pages
  if (origin.includes("github.io")) {
    return `${origin}/${parts[1]}/`;
  }

  return `${origin}/`;
};