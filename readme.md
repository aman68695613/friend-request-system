# 🤝 Friend Request System API

A full-stack friend request system with authentication, user management, mutual friends, blocking/unblocking, and real-time notifications (Socket.IO). Built using Node.js, Express, MongoDB, and React.

---

## 📁 Project Structure

devify-intern-assignment/
│

├── client/ # React frontend

├── server/ # Backend API

│ ├── config/ # DB & environment config

│ ├── controllers/ # Request controllers

│ ├── middleware/ # Auth & error middleware

│ ├── models/ # Mongoose schemas

│ ├── routes/ # Express route handlers

│ ├── utils/ # Token generation, helper functions

│ ├── tests/ # Test files

│ ├── app.js # Express app setup

│ ├── server.js # Server entry point

│ ├── swagger.json # Swagger API documentation

│ └── .env # Environment config



---

## 🚀 Features

- 🔐 JWT Authentication (Register/Login)
- 👥 Send, accept, reject, and cancel friend requests
- 👬 View mutual friends
- 🔕 Block/unblock users
- 🧾 Audit log of user actions
- 🔔 Real-time notifications via Socket.IO
- 📖 Swagger API Documentation

---

## 🛠️ Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React + TypeScript + TailwindCSS
- Auth: JWT, bcrypt
- Realtime: Socket.IO
- Docs: Swagger (OpenAPI 3.0)

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/friend-request-system.git
cd friend-request-system     
```

2. Install dependencies:

-- Backend
```bash
cd server
npm install
```
-- Frontend
```bash
cd ../client
npm install
```
3. Create a .env file in /server:

```bash
PORT=5000
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret
```

## Running the Project
1. Start Backend:
```bash
cd server
npm run dev
```
2. Start Frontend:
```bash
cd ../client
npm run dev
```
## Visit

Visit frontend: http://localhost:5173

Backend API runs at: http://localhost:5000

Swagger API Docs: http://localhost:5000/api-docs

## Author
Aman Srivastava