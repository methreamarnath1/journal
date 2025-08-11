# 📓 Journal App

A full-stack journaling application built with **Node.js (Express)** for the backend and **React** for the frontend.  
It supports user authentication, private/public journal entries, search, and more.

---

## 🚀 Features
- **User Authentication** (JWT-based login & register)
- **Create / Read / Update / Delete** journals
- **Search journals** by keyword
- **Private & Public** journals
- **RESTful API** with MongoDB

---

## 📂 Folder Structure
journal/
│
├── backend/ # Express + MongoDB backend
│ ├── src/
│ │ ├── config/ # DB config
│ │ ├── controllers/ # Auth & journal logic
│ │ ├── middleware/ # Auth middleware
│ │ ├── models/ # Mongoose models
│ │ └── routes/ # API routes
│ ├── .env.example # Environment variables template
│ └── package.json
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ ├── package.json
│
└── README.md # This file

 
---

## ⚙️ Environment Variables
Create a `.env` file in the **backend** folder:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/journalDB
JWT_SECRET=your_jwt_secret_here
🛠️ Installation & Setup
---

##1️⃣ Clone the Repository
 
git clone https://github.com/methreamarnath1/journal.git
cd journal
---
##2️⃣ Install Backend Dependencies
 
cd backend
npm install
##3️⃣ Install Frontend Dependencies
 
cd ../frontend
npm install
##4️⃣ Run Backend
 
cd backend
npm run dev
Backend will run at: http://localhost:3000

##5️⃣+ Run Frontend
 
cd frontend
npm start   # or npm run dev if using Vite
Frontend will run at: http://localhost:5173 (Vite) or http://localhost:3001 (CRA)
---

##🔗 API Endpoints
 **Auth

| Method | Endpoint             | Description         | Input Example                                                           | Output Example    |
| ------ | -------------------- | ------------------- | ----------------------------------------------------------------------- | ----------------- |
| POST   | `/api/auth/register` | Register a new user | `{ "name": "Amar", "email": "amar@example.com", "password": "123456" }` | `{ token, user }` |
| POST   | `/api/auth/login`    | Login user          | `{ "email": "amar@example.com", "password": "123456" }`                 | `{ token, user }` |


**Journal

| Method | Endpoint               | Description              | Input Example                                        | Output Example    |
| ------ | ---------------------- | ------------------------ | ---------------------------------------------------- | ----------------- |
| POST   | `/api/journals`        | Create journal           | `{ title, content, tags, isPublic, summary, image }` | `Journal object`  |
| GET    | `/api/journals`        | Get all journals (user)  | None                                                 | `[Journal]`       |
| GET    | `/api/journals/:id`    | Get single journal by ID | None                                                 | `Journal object`  |
| PUT    | `/api/journals/:id`    | Update journal           | `{ title?, content?, ... }`                          | `Updated journal` |
| DELETE | `/api/journals/:id`    | Delete journal           | None                                                 | `204 No Content`  |
| POST   | `/api/journals/search` | Search journals          | `{ "query": "keyword" }`                             | `[Journal]`       |

---
##🔑 Authentication
All journal endpoints require JWT Bearer Token in the header:

 

Authorization: Bearer your_token_here
---
##🖼️ Screenshots (Optional)
Add screenshots of the app once frontend is done.

##🤝 Contributing
Fork the repo

Create a new branch

Commit changes

Create a pull request
--- 

##📜 License
MIT License

 
---

If you use this, you’ll have **one unified README** for your repo, so future you (and others) won’t have to guess how to set up and run it.  

If you want, I can also make a **`.env.example`** file for the backend so you can commit it without exposing secrets. That way people know what variables they need. Would you like me to prepare that?







 