# 🍬 Sweet Shop Management System

A full-stack Sweet Shop application built with **React (Vite)** on the frontend and **Node.js + Express + PostgreSQL** on the backend.  
It supports **user authentication, admin management of sweets, and a persistent shopping cart**.

---

## 🚀 Features

### 👤 Authentication
- User registration & login (JWT based)
- Role-based access (Admin / User)
- Secure token-based authorization

### 🍭 Sweets Management
- View all sweets (users)
- Search & filter by name and category
- Stock availability handling
- Admin CRUD operations:
  - Add new sweets
  - Update price & quantity
  - Delete sweets

### 🛒 Cart (Persistent)
- Add sweets to cart
- Increase/decrease quantity
- Remove items from cart
- Cart data stored in database (persistent across sessions)
- Protected routes (login required)

### 🛠 Admin Panel
- Admin-only access
- Full control over sweets inventory

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- React Router
- Axios
- CSS (custom styling)

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT (Authentication)
- bcrypt (Password hashing)

---

## 📂 Project Structure

```
sweet-shop-management-full/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── database.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── main.tsx
│   └── index.html
│
└── README.md
```

---

## 🗄 Database Schema

### Users
```sql
users (
  id,
  username,
  email,
  password,
  is_admin,
  created_at
)
```

### Sweets
```sql
sweets (
  id,
  name,
  category,
  price,
  quantity,
  created_at,
  updated_at
)
```

### Cart Items
```sql
cart_items (
  id,
  user_id,
  sweet_id,
  quantity,
  created_at,
  updated_at
)
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweetshop
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
```

---

## 🧪 Default Admin Credentials

```
Email: admin@sweetshop.com
Password: admin123
```

> ⚠️ Change this password in production.

---

## ▶️ How to Run the Project

### 1️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at:
```
http://localhost:5000
```

---

### 2️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🔐 API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Sweets
- `GET /api/sweets`
- `POST /api/sweets` (admin)
- `PUT /api/sweets/:id` (admin)
- `DELETE /api/sweets/:id` (admin)

### Cart (Protected)
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

---

## 🧠 Important Implementation Notes

- JWT token is stored in `localStorage`
- Axios interceptor automatically attaches token
- Cart routes are protected using authentication middleware
- PostgreSQL is used for **persistent cart storage**
- Proper separation of concerns (routes / controllers / middleware)

---

## 🐞 Common Issues & Fixes

### ❌ `Route.get() requires a callback function`
✔ Ensure correct named imports (`authenticate`, not `authMiddleware`)

### ❌ `Cannot read properties of undefined (reading 'query')`
✔ Use correct import:
```ts
import { pool } from "../database";
```

### ❌ Cart not saving
✔ Ensure `/api/cart` routes are protected by auth middleware

---

## 📌 Future Improvements

- Checkout & payment integration
- Order history
- User profile page
- Better UI animations
- Pagination for sweets

---

## 📄 License

This project is for **learning and educational purposes**.

