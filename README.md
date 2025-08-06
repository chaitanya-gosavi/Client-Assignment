# Rural Community Platform

A modern, full-stack web application to help rural communities easily find and access essential products and services like groceries, healthcare, and more.

---

## 🚀 Features
- **Homepage** with professional design
- **Our Services**: List of key services (with icons)
- **Available Products**: Product catalog with search/filter and cart
- **News & Updates**: Latest headlines for rural communities
- **Contact Us**: Address, helpline, and contact form
- **User Authentication**: Signup/Login (with JWT)
- **User Dashboard**: Welcome message, bookings, profile edit
- **Bookings**: Add products to cart and book them
- **Responsive Design**: Works on mobile and desktop

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Database**: MySQL

---

## 📦 Project Structure
```
Client/
  index.html
  style.css
  script.js
  rural_platform.sql
backend/
  index.js
  .env
README.md
```

---

## ⚡ Getting Started

### 1. Clone the Repository
```
git clone <your-repo-url>
cd <project-folder>
```

### 2. Database Setup (MySQL)
- Open MySQL Workbench or your preferred client.
- Run the SQL script:
  - Open `Client/rural_platform.sql`
  - Execute all to create the database, tables, and sample data.

### 3. Backend Setup
```
cd backend
npm install
```
- Create a `.env` file in `backend/`:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=rural_platform
JWT_SECRET=your_jwt_secret
```
- Start the server:
```
node index.js
```

### 4. Frontend Setup
- Open `Client/index.html` in your browser (double-click or drag into browser).
- For real API usage, update `script.js` to use backend endpoints instead of localStorage.

---

## 📚 API Endpoints

| Method | Endpoint        | Description                       |
|--------|----------------|-----------------------------------|
| GET    | /services      | List all services                  |
| GET    | /products      | List all products                  |
| GET    | /news          | List news headlines                |
| POST   | /register      | Register a new user                |
| POST   | /login         | Login and get JWT token            |
| POST   | /contact       | Submit contact form                |
| GET    | /bookings      | Get user bookings (JWT required)   |
| POST   | /bookings      | Add a booking (JWT required)       |

---

## 📝 Usage Notes
- The frontend works standalone (with localStorage) or can be connected to the backend for real data.
- All backend API endpoints return JSON.
- For protected routes, send the JWT token in the `Authorization` header as `Bearer <token>`.

---

## 🙌 Credits
- Icons: [Icons8](https://icons8.com/)
- Illustrations: [Unsplash](https://unsplash.com/) / [unDraw](https://undraw.co/)

---

## 📣 License
MIT
