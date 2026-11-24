# ExpenseTrack 💰

## About the Project
ExpenseTrack is a personal expense management application that helps users track their income, expenses, balance and monthly savings.

## Features
- Add new income and expense transactions
- View all transactions
- Edit existing transactions
- Delete individual transactions
- Clear all transactions
- Search and filter transactions
- Dashboard with income, expense and balance summaries
- Monthly financial tracking
- Category-wise expense reports
- Income vs Expense chart
- CSV export
- PDF export
- Profile settings
- Dark and Light mode
- Responsive design

## Technologies Used

**Frontend**
- React.js
- HTML
- CSS
- JavaScript
- Vite

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

## Project Structure

```text
ExpenseTrack/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ExpenseTrack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your backend `.env` file with your MongoDB connection string and required environment variables.

Start the backend:

```bash
node server.js
```

Backend runs on:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in your terminal.

## API Endpoints

Base URL: `http://localhost:5000/api/transactions`

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Get all transactions |
| POST | / | Add transaction |
| PUT | /:id | Update transaction |
| DELETE | /:id | Delete one transaction |
| DELETE | / | Delete all transactions |

## Database

MongoDB Atlas is used to store transaction records.

## Project Purpose

The purpose of ExpenseTrack is to provide a simple and user-friendly platform for managing personal income and expenses.

## Author

ExpenseTrack Project