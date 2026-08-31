# 💰 Full-Stack Expense Tracker (React + Express + MySQL)

A modern, responsive, full-stack Personal Finance & Expense Tracker application built with **React.js**, **Node.js/Express.js**, and **MySQL** featuring connection pooling, interactive analytics charts with **Recharts**, and a sleek dark-mode glassmorphic user interface.

---

## 🌟 Features

- **Interactive Financial Analytics**:
  - **Summary Metrics**: Real-time cards for Total Spend, Current Month Spend, Top Category, and Average Transaction amount.
  - **Category Breakdown**: Interactive **Recharts Donut/Pie Chart** with custom tooltips showing expenditure percentages.
  - **Monthly Trends**: **Recharts Bar Chart** showing aggregated spending by month.
- **Complete Expense Management (CRUD)**:
  - **Add Expense**: Modal form with validation (Title, Positive Amount, Category dropdown, and Date picker).
  - **Edit Expense**: In-place edit modal with pre-populated values.
  - **Delete Expense**: Safe confirmation dialog to prevent accidental deletion.
  - **Table View**: Rich data table with category badges, formatted currency, and date styling.
- **Search, Filtering & Sorting**:
  - Search by title or note in real-time.
  - Filter by category (*Food & Dining, Transportation, Utilities, Housing, Entertainment, Shopping, etc.*).
  - Quick date presets (*All Time, This Month, Last 30 Days, This Year, Custom Date Range*).
  - Sort by Date (Newest/Oldest), Amount (High/Low), or Title (A-Z).
- **Robust Backend Architecture**:
  - Express.js REST API with modular routes and controllers.
  - `mysql2/promise` with **Connection Pooling** for high-performance concurrent database queries.
  - SQL aggregations (`GROUP BY` and `SUM`) for fast analytics calculation.
  - Input validation middleware and error handling for MySQL error codes (`ECONNREFUSED`, `ER_NO_SUCH_TABLE`, etc.).
  - CORS enabled and environment variable support with `dotenv`.

---

## 🏗️ Project Structure

```
Expense tracker/
├── package.json               # Root scripts with concurrently runner
├── README.md                  # Complete setup and usage documentation
├── server/                    # Backend (Node.js + Express.js + MySQL)
│   ├── package.json           # Server dependencies (express, mysql2, cors, dotenv, etc.)
│   ├── .env                   # Database credentials & PORT config
│   ├── .env.example           # Example environment template
│   ├── schema.sql             # SQL script to create DB, table & seed data
│   ├── server.js              # Express app entrypoint & middleware
│   ├── config/
│   │   └── db.js              # MySQL2 connection pool with async/await
│   ├── routes/
│   │   └── expenseRoutes.js   # Route definitions for CRUD & Summary
│   ├── controllers/
│   │   └── expenseController.js # Controllers with parameterized queries
│   └── middleware/
│       └── errorHandler.js    # Centralized MySQL & HTTP error handler
└── client/                    # Frontend (React + Vite + Recharts)
    ├── package.json           # Client dependencies (react, recharts, axios, lucide)
    ├── vite.config.js         # Vite configuration with API proxy to port 5000
    ├── index.html             # HTML entry point with Google Fonts
    └── src/
        ├── api/
        │   └── api.js         # Centralized Axios service
        ├── components/
        │   ├── Navbar.jsx          # Header with branding & quick actions
        │   ├── SummaryCards.jsx    # Metric cards (Total, Month, Top Cat, Count)
        │   ├── ExpenseCharts.jsx   # Recharts Pie & Bar charts
        │   ├── ExpenseFilters.jsx  # Category, date preset, search & sort bar
        │   ├── ExpenseTable.jsx    # Tabular list view with category badges
        │   ├── ExpenseModal.jsx    # Add / Edit modal dialog with validation
        │   ├── DeleteModal.jsx     # Delete confirmation dialog
        │   └── Toast.jsx           # Floating notification alerts
        ├── styles/
        │   └── index.css      # Modern Glassmorphism CSS Design System
        ├── App.jsx            # Main app coordinator & state management
        └── main.jsx           # React app mount
```

---

## 🗄️ Database Setup (MySQL)

### 1. Start your MySQL Server
Make sure your MySQL server is running (via XAMPP, WAMP, MySQL Workbench, or Command Line).

### 2. Run the SQL Schema
Run the provided [schema.sql](file:///server/schema.sql) in MySQL Workbench, phpMyAdmin, or your MySQL CLI:

```bash
mysql -u root -p < server/schema.sql
```

This creates the database `expense_tracker`, table `expenses`, and inserts sample records:
```sql
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configure Database Credentials
Edit `server/.env` with your MySQL connection credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
DB_PORT=3306
```

---

## 🚀 Installation & Running

### Option 1: Run Both Concurrently from Root (Recommended)

1. **Install all dependencies** (root, server, and client):
   ```bash
   npm run install:all
   ```

2. **Start both Backend (Port 5000) and Frontend (Port 3000) simultaneously**:
   ```bash
   npm run dev
   ```

3. Open your browser at **`http://localhost:3000`**.

---

### Option 2: Run Separately

#### Running the Backend:
```bash
cd server
npm install
npm run dev
```
Backend API will be running at `http://localhost:5000`.

#### Running the Frontend:
```bash
cd client
npm install
npm run dev
```
Frontend React App will be running at `http://localhost:3000`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Fetch all expenses | `category`, `startDate`, `endDate`, `search`, `sortBy`, `order` |
| `GET` | `/api/expenses/:id` | Fetch single expense by ID | - |
| `POST` | `/api/expenses` | Add a new expense | JSON Body: `{ title, amount, category, date }` |
| `PUT` | `/api/expenses/:id` | Update an existing expense | JSON Body: `{ title, amount, category, date }` |
| `DELETE`| `/api/expenses/:id` | Delete an expense by ID | - |
| `GET` | `/api/expenses/summary` | Spending metrics & category breakdown | Returns `totalSpend`, `categoryBreakdown`, `monthlyBreakdown` |
| `GET` | `/api/health` | API server health check | - |

---

## 🛡️ Input Validation & Error Handling

- **Title**: Required, non-empty, trimmed string.
- **Amount**: Required, positive decimal number (`> 0`).
- **Category**: Required from recognized categories.
- **Date**: Valid `YYYY-MM-DD` date.
- **MySQL Error Codes Handled**:
  - `ECONNREFUSED` (503 Service Unavailable with friendly instructions)
  - `ER_NO_SUCH_TABLE` (500 prompt to run `schema.sql`)
  - `ER_BAD_DB_ERROR` (500 prompt to create database)
  - `ER_ACCESS_DENIED_ERROR` (401 invalid credentials)
