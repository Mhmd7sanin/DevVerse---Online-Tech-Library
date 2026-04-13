# 📚 DevVerse — Online Library System

A browser-based library management app built with vanilla HTML, CSS, and JavaScript.

**IS231: Web Technology — Cairo University, Faculty of Computer Science and Artificial Intelligence**
Team ID: 17 | Supervisors: Dr. Neamat El Tazi 

---

## ✨ Features

**👤 User**
- Sign Up / Login
- Browse, search, and filter books by category
- View full book details and borrow books
- My Library — view and return borrowed books
- Profile page with borrow history

**🔧 Admin**
- Book Catalog — add, edit, delete books
- Manage Users — view all registered accounts and create new ones
- Role-based navigation — navbar adapts to the logged-in role

**🛠️ General**
- Toast notifications for all actions
- Route protection — users can't access admin pages and vice versa
- Session stored in `sessionStorage`

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Markup   | HTML5                             |
| Styling  | CSS3 (custom, no framework)       |
| Logic    | Vanilla JavaScript                |
| Storage  | localStorage + sessionStorage     |

---

## Getting Started

**Demo credentials**

| Role  |   Username   | Password  |
|-------|--------------|-----------|
| Admin | admin        | admin123  |
| User  | alex_dev     | pass123   |

---

## 🗂️ Project Structure

```
devverse/
├── pages/
│   ├── index.html
│   ├── contact.html
│   ├── auth/
│   │   ├── signup.html
│   │   └── login.html
│   ├── user/
│   │   ├── browse.html
│   │   ├── book-detail.html
│   │   ├── my-library.html
│   │   └── profile.html
│   └── admin/
│       ├── dashboard.html
│       ├── add-book.html
│       ├── edit-book.html
│       ├── users.html
│       └── create-account.html
│
├── css/
│   ├── global.css              ← Member 1 (tokens) 
│   └── pages/
│       ├── home.css            ← Member 2
│       ├── contact.css         ← Member 2
│       ├── signup.css          ← Member 2
│       ├── login.css           ← Member 2
│       ├── browse.css          ← Member 3
│       ├── book-detail.css     ← Member 3
│       ├── my-library.css      ← Member 4
│       ├── profile.css         ← Member 4
│       ├── dashboard.css       ← Member 5
│       ├── add-book.css        ← Member 5
│       ├── edit-book.css       ← Member 5
│       ├── users.css           ← Member 6
│       └── create-account.css  ← Member 6
│
├── js/
│   ├── storage.js              ← Member 1 ONLY — the only file that touches localStorage
│   ├── navbar.js               ← Member 1
│   ├── seed.js                 ← Member 1
│   └── features/
│       ├── home.js             ← Member 2
│       ├── auth.js             ← Member 2
│       ├── browse.js           ← Member 3
│       ├── book-detail.js      ← Member 3
│       ├── my-library.js       ← Member 4
│       ├── profile.js          ← Member 4
│       ├── admin-catalog.js    ← Member 5
│       ├── add-book.js         ← Member 5
│       ├── edit-book.js        ← Member 5
│       ├── admin-users.js      ← Member 6
│       └── create-account.js   ← Member 6
│
└── assets/
    ├── logo.png                ← Project logo (PNG file)
    └── placeholder-cover.svg   ← Default book cover
```

---

## 👥 Team

| Name                      | Student ID |
|---------------------------|------------|
| Mohamed Ahmed Hassanin    | 20242264   |
| Asmaa Akram Seadawy       | 20240083   |
| Abdelrahman Mohsen Zaghloul | 20242205 |
| BelAl Mohamed Omar        | 20230097   |
| Menna Mohamed Elabasery   | 20230424   |
| Mostafa Hesham            | 20240603   |

---

## 📄 License

This project was created for educational purposes as part of the IS231 Web Technology course at Cairo University. All rights reserved by the team members listed above.
