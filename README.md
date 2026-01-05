# Book Management System

A full-stack application for managing books, categories, and borrow/return tracking with user authentication.  
Built with React (frontend), Laravel (backend) and PostgreSQL (database).

---

## Features

### Authentication
- User registration and login
- Passwords are securely hashed
- Only logged-in users can borrow or return books
- Token-based authentication with Laravel Sanctum

### Book Management
- Display all books with:
  - Title, Author, Price, Stock, Category
- Filter books by category
- Add, Edit, Delete books
- Stock updates automatically on borrow/return

### Borrow / Return Tracking
- Record book issuance linked to a user
- Record book return linked to a user
- Reduce stock on borrow, increase stock on return
- View the list of books borrowed by the logged-in user

---

## **Tech Stack**

- Frontend: React.js
- Backend: Laravel (API)
- Database: PostgreSQL
- Auth: Laravel Sanctum (Token-based)
- Others: PHP, Composer, Node.js, npm

---

## Database Structure
### Tables:

users
- id, name, email, password, created_at, updated_at

books
- id, title, author, price, stock, book_category_id, created_at, updated_at

book_categories
- id, name, created_at, updated_at

borrow_records
- id, user_id, book_id, borrow_date, return_date, created_at, updated_at

## API Endpoints
### Public

POST /api/register - Register a new user
POST /api/login - Log in user
GET /api/book-categories - Get all book categories
Protected (Require Token)
GET /api/books - List all books
GET /api/books/{id} - View book details
POST /api/books - Add a book
PUT /api/books/{id} - Edit a book
DELETE /api/books/{id} - Delete a book
POST /api/logout - Logout user
POST /api/borrow - Borrow a book
POST /api/return/{id} - Return a book
GET /api/my-borrows - Get books borrowed by logged-in user
