# College Management System

A basic web app to manage students, courses, and enrollments, with admin login.

## Features
- Admin login with hashed passwords (bcrypt)
- Add, view, edit, and delete students
- Add, view, edit, and delete courses
- Enroll students in courses and view their enrolled courses

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/gjvarma45/college-management-system.git
   cd college-management-system
   ```
2. Create the database: run `backend/schema.sql` in MySQL Workbench.
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in your MySQL password.
5. Create the admin user (change the password inside the file first):
   ```bash
   node admin.js
   ```
6. Start the server:
   ```bash
   node server.js
   ```
7. Open `frontend/login.html` in your browser (or use the Live Server extension).

## Future Improvements
- JWT-based authentication to protect API routes
- Faculty role and attendance tracking
- Grades and exam module