# 📚 DevVerse — Online Library System

A full-stack online library management system built using **HTML, CSS, JavaScript, Django, and MongoDB**.

The platform allows users to browse books, borrow and return them, and manage their personal library, while administrators can manage the entire system through a dedicated admin dashboard.

**IS231: Web Technology — Cairo University, Faculty of Computer Science and Artificial Intelligence**  
Team ID: 12 | Supervisors: Dr. Neamat El Tazi

---

## ✨ Features

### 👤 User Features
- Sign Up and Login system connected to backend API
- Browse all available books
- Search and filter books by category, title, or author
- View detailed book information
- Borrow and return books
- Personal library page showing borrowed books
- Profile page with synced borrowing history
- Persistent login using localStorage
- Auto synchronization with backend database

---

### 🔧 Admin Features
- Admin dashboard with live database data
- Add new books
- Edit existing books
- Delete books with confirmation dialog
- Manage users
- Edit user information
- Delete users
- Create new accounts
- Mark borrowed books as returned directly from admin panel
- Protected admin-only routes

---

### 📚 Library System Features
- Full borrow / return workflow
- Real-time availability updates
- Synchronization between:
  - Books collection
  - Users collection
  - Frontend localStorage session
- Borrow tracking using:
  - `borrowedBy`
  - `borrowedAt`
  - `borrowedBooks`

---

### 🛠️ General Features
- Responsive UI design
- Toast notification system
- Custom dialogs instead of browser alerts
- Role-based navigation
- Route protection
- API-driven frontend architecture
- MongoDB database integration
- Automatic session refresh from backend

---

# 🌐 Backend Integration

The project uses a **Django backend API** connected to a **MongoDB database**.

---

## 🔗 Main API Endpoints

### Authentication
- `POST /auth/signup/`
- `POST /auth/login/`

### Books
- `GET /books/`
- `GET /books/<id>/`
- `POST /books/create/`
- `PUT /books/<id>/update/`
- `DELETE /books/<id>/delete/`

### Borrowing System
- `POST /books/<id>/borrow/`
- `POST /books/<id>/return/`

### Users
- `GET /users/`
- `GET /users/<id>/`
- `POST /users/create/`
- `PUT /users/<id>/update/`
- `DELETE /users/<id>/delete/`

---

# 🗄️ Database Structure

## 👤 Users Collection

```json
{
  "_id": "MongoDB ObjectId",
  "id": "u_001",
  "username": "alex_dev",
  "email": "alex@example.com",
  "password": "pass123",
  "isAdmin": false,
  "borrowedBooks": [
    {
      "bookId": "b_003",
      "borrowedAt": "2026-03-20"
    }
  ]
}
```

---

## 📚 Books Collection

```json
{
  "_id": "MongoDB ObjectId",
  "id": "b_003",
  "name": "Atomic Habits",
  "author": "James Clear",
  "category": "Self Development",
  "description": "Book description...",
  "image": "image-url",
  "isAvailable": false,
  "borrowedBy": "u_003",
  "borrowedAt": "2026-05-11"
}
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Backend | Django |
| Database | MongoDB |
| API Communication | Fetch API |
| Authentication Storage | localStorage |

---

# 🚀 Getting Started

## Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| User | alex_dev | pass123 |

---

# 🗂️ Project Structure

```bash
devverse/
│
├── backend/
│   ├── manage.py
│   │
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── api/
│       ├── views.py
│       ├── urls.py
│       ├── serializers.py
│       ├── database.py
│       └── utils.py
│
│
├── pages/
│   ├── contact.html
│   │
│   ├── auth/
│   │   ├── login.html
│   │   └── signup.html
│   │
│   ├── user/
│   │   ├── browse.html
│   │   ├── book-detail.html
│   │   ├── my-library.html
│   │   └── profile.html
│   │
│   └── admin/
│       ├── dashboard.html
│       ├── add-book.html
│       ├── edit-book.html
│       ├── users.html
│       ├── edit-user.html
│       └── create-account.html
│
├── css/
│   ├── global.css
│   │
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
│       ├── users.css
│       ├── edit-user.css
│       └── create-account.css
│
├── js/
│   ├── storage.js
│   ├── navbar.js
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
│       ├── admin-users.js
│       ├── edit-user.js
│       └── create-account.js
│
└── assets/
│    ├── images/
│    └── logo.png
│
├── index.html
│   requirements.txt
└── README.md
```

---

# 👥 Team

| Name | Student ID |
|---|---|
| Mohamed Ahmed Hassanin | 20242264 |
| Asmaa Akram Seadawy | 20240083 |
| Abdelrahman Mohsen Zaghloul | 20242205 |
| BelAl Mohamed Omar | 20230097 |
| Menna Mohamed Elabasery | 20230424 |
| Mostafa Hesham | 20240603 |

---

# 📄 License

This project was created for educational purposes as part of the IS231 Web Technology course at Cairo University.

All rights reserved by the project team.
