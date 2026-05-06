# 📚 DevVerse — Online Library System

A browser-based library management app built with vanilla HTML, CSS, and JavaScript.

**IS231: Web Technology — Cairo University, Faculty of Computer Science and Artificial Intelligence**
Team ID: 12 | Supervisors: Dr. Neamat El Tazi 

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
├── index.html
├── pages/
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
│       ├── edit-user.html
│       └── create-account.html
│
├── css/
│   ├── global.css        (tokens) 
│   └── pages/
│       ├── home.css           
│       ├── contact.css       
│       ├── signup.css         
│       ├── login.css           
│       ├── browse.css          
│       ├── book-detail.css     
│       ├── my-library.css     
│       ├── profile.css       
│       ├── dashboard.css       
│       ├── add-book.css       
│       ├── edit-book.css
│       ├── edit-user.css     
│       ├── users.css           
│       └── create-account.css  
│
├── js/
│   ├── storage.js       ONLY — the only file that touches localStorage
│   ├── navbar.js               
│   ├── seed.js                 
│   └── features/
│       ├── home.js             
│       ├── auth.js             
│       ├── browse.js           
│       ├── book-detail.js      
│       ├── my-library.js       
│       ├── profile.js         
│       ├── admin-catalog.js    
│       ├── add-book.js        
│       ├── edit-book.js
│       ├── edit-user.js       
│       ├── admin-users.js      
│       └── create-account.js   
│
└── assets/
    ├── logo.png                ← Project logo (PNG file)
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
