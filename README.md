<div align="center">
    <h1>Framework Programming (2025)</h1>
</div>

<p align="center">
  <b>Institut Teknologi Sepuluh Nopember</b><br>
  Sepuluh Nopember Institute of Technology
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/39eed902-7dbc-4114-9799-f50c22ccec40" 
       alt="Badge_ITS" 
       width="50%" 
</p>
  
A website created by <a href="https://github.com/bellaacp">Bella Angeline C.P </a> and <a href="https://github.com/nathchristine">Nathaniel Christine M.S</a>

| Name           | NRP        | 
| ---            | ---        | 
| Bella Angeline C. P | 5025231073 | 
| Nathaniel Christine S. M| 5025231010 | 
<p>On behalf of:<p>

<p><b>Agus Budi Raharjo, S.Kom, M.Kom., Ph.D.</b></p>

### YouTube Link: https://www.youtube.com/watch?v=9m7EP4WVza4

## Overview

BookNest is a CRUD-based website designed to manage book borrowing activities in a library. The system provides two types of users (members and admins), each with their own features and permissions. Members can browse available books, create borrowing transactions, and view their personal transaction history. Admins have full control over the library’s inventory and records, including adding new books, updating availability status, and managing all borrowing transactions across all users.

## Models

- **User**: represents an application user.
  - Typical fields: `id`, `username`, `password`, `role` (`member` | `admin`), `created_at`.
- **Book**: the library's book inventory item.
  - Typical fields: `id`, `title`, `author`, `genre`, `year`, `cover`, `status` (`Available` | `Borrowed`), `created_at`.
- **Transaction**: borrowing record linking a `User` and a `Book`.
  - Typical fields: `id`, `user_id`, `user_name`, `book_id`, `book_title`, `borrow_date`, `return_date`, `status` (`Borrowed` | `Returned`).

## Features

- User authentication (members and admins).
- Browse books with details (title, author, genre, year, cover).
- Create, update, and delete books (admin).
- Borrowing transactions: create transactions (members), view history (members), manage all transactions (admin).
- Mark transactions as returned and update book availability.
- Simple search/filtering for books.

## Setup & Installation

1. Clone the repository:

```bash
git clone <https://github.com/nathchristine/PBKK_FP.git>
cd PBKK_FP
```

2. Backend (Go):

- Install dependencies and run the server:

```bash
go mod download
go run main.go
```

- If there are migration helpers, run them before starting (if applicable):

```bash
go run migrate/migrate.go
```

3. Frontend (Next.js):

```bash
cd frontend
npm install
npm run dev
```


4. Open the app:

- Frontend: `http://localhost:3000` 
- Backend API: `http://localhost:8080`


## Project Structure

```
PBKK_FP/
├─ controllers/             # Logic for Auth, Books, Transactions, Users
├─ initializers/            # DB connection and Env loading
├─ migrate/                 # Database migration scripts
├─ models/                  # GORM data structs (User, Book, Transaction)
├─ main.go                  # Entry point and API Routing
├─ go.mod                   # Go dependencies
├─ package.json             # Project package file
├─ README.md                # Project README
├─ .env                     # Environment 
└─ frontend/                # Next.js frontend
   └─ app/
      ├─ page.tsx           # Top-level landing page
      ├─ layout.tsx         # App layout and AuthGuard
      ├─ books/             # Book routes
      │  ├─ create/         # /books/create  # Create book (admin)
      │  └─ [id]/           # Book detail
      │     └─ edit/        # /books/[id]/edit # Edit book
      ├─ login/             # Authentication pages
      ├─ signup/            # Authentication pages
      ├─ profile/           # User profile page
      ├─ members/           # Admin member management
      ├─ transactions/      # Transactions dashboard
      └─ components/        # Reusable UI
```



