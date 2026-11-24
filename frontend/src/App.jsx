
import { useState, useEffect } from "react";
import "./index.css";

function App() {
  // Load saved transactions from LocalStorage
 const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("profile")) || {
      name: "Kamal",
      email: "kamal@example.com",
    };
  } catch {
    return {
      name: "Kamal",
      email: "kamal@example.com",
    };
  }
});

const [editProfile, setEditProfile] = useState(false);
const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(
  new Date().toISOString().split("T")[0]
 
);
const [category, setCategory] = useState("Other");
 const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";

});

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]); 
  const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const [activePage, setActivePage] = useState("Dashboard");

const filteredTransactions = transactions.filter((item) => {
  const matchesSearch = item.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "all" || item.type === filter;

  return matchesSearch && matchesFilter;
});
// Fetch transactions from backend
useEffect(() => {
  async function fetchTransactions() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  fetchTransactions();
}, []);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;
  const currentMonth = new Date().toISOString().slice(0, 7);

const monthlyTransactions = transactions.filter(
  (item) => item.date?.startsWith(currentMonth)
);

const monthlyIncome = monthlyTransactions
  .filter((item) => item.type === "income")
  .reduce((sum, item) => sum + item.amount, 0);

const monthlyExpenses = monthlyTransactions
  .filter((item) => item.type === "expense")
  .reduce((sum, item) => sum + item.amount, 0);

const monthlySavings = monthlyIncome - monthlyExpenses;
const categoryTotals = transactions
  .filter((item) => item.type === "expense")
  .reduce((acc, item) => {
    const category = item.category || "Other";

    acc[category] = (acc[category] || 0) + item.amount;

    return acc;
  }, {});

const totalCategoryExpenses = Object.values(categoryTotals)
  .reduce((sum, amount) => sum + amount, 0);

const categoryColors = {
  Food: "#f59e0b",
  Shopping: "#3b82f6",
  Travel: "#8b5cf6",
  Education: "#16a34a",
  Bills: "#ef4444",
  Other: "#64748b",
};

let currentAngle = 0;

const categorySegments = Object.entries(categoryTotals).map(
  ([name, amount]) => {
    const start = currentAngle;
    const end =
      start + (amount / totalCategoryExpenses) * 360;

    currentAngle = end;

    return `${categoryColors[name] || "#64748b"} ${start}deg ${end}deg`;
  }
);

const categoryGradient =
  totalCategoryExpenses > 0
    ? `conic-gradient(${categorySegments.join(", ")})`
    : "#e5e7eb";
 const maxAmount = Math.max(income, expenses, 1);

const incomePercentage = (income / maxAmount) * 100;
const expensePercentage = (expenses / maxAmount) * 100; 

function editTransaction(item) {
  setEditingId(item._id);
  setTitle(item.title);
  setAmount(item.amount);
  setType(item.type);
  setDate(item.date.split("T")[0]);
  setCategory(item.category);
}
async function addTransaction(e) {
  e.preventDefault();

  if (!title.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    alert("Please enter valid details");
    return;
  }

  const newTransaction = {
    title: title.trim(),
    amount: Number(amount),
    type,
    date,
    category,
  };

  try {
  
    const response = await fetch(
  editingId
    ? `http://127.0.0.1:5000/api/transactions/${editingId}`
    : "http://127.0.0.1:5000/api/transactions",
  {
    method: editingId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTransaction),
  }
); 

    if (!response.ok) {
      throw new Error("Failed to save transaction");
    }

    const savedTransaction = await response.json();

   if (editingId) {
  setTransactions((prev) =>
    prev.map((item) =>
      item._id === editingId ? savedTransaction : item
    )
  );
} else {
  setTransactions((prev) => [savedTransaction, ...prev]);
}

    setTitle("");
    setAmount("");
    setType("expense");
    setDate(new Date().toISOString().split("T")[0]);

    setEditingId(null);

  alert(editingId ? "Transaction updated successfully!" : "Transaction saved successfully!");
  } catch (error) {
    console.error("Add Transaction Error:", error);

    alert("Transaction save nahi hui. Backend check karo.");
  }
}

 async function deleteTransaction(id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/transactions/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }

    setTransactions((prev) =>
      prev.filter((item) => item._id !== id)
    );

    alert("Transaction deleted successfully!");
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Transaction delete nahi hui.");
  }
}
async function clearAllTransactions() {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete all transactions?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/transactions",
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete transactions");
    }

    setTransactions([]);
    alert("All transactions deleted successfully!");
  } catch (error) {
    console.error("Clear All Error:", error);
    alert("Transactions delete nahi hui. Backend check karo.");
  }
}

function saveProfile(e) {
  e.preventDefault();

  localStorage.setItem("profile", JSON.stringify(profile));

  setEditProfile(false);
  alert("Profile updated successfully!");
}

function exportCSV() {
  const headers = [
    "Transaction Name",
    "Amount",
    "Type",
    "Category",
    "Date",
  ];

  const rows = transactions.map((item) => [
    item.title,
    item.amount,
    item.type,
    item.category || "Other",
    item.date || "Not Available",
  ]);

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ExpenseTrack-Transactions.csv";
  link.click();

  URL.revokeObjectURL(url);
}
function exportPDF() {
  window.print();
}

  return (
   <div className={darkMode ? "app dark-mode" : "app"}>
      <aside className="sidebar">
        <h2>ExpenseTrack</h2>
       <nav>
  <p
    className={activePage === "Dashboard" ? "active" : ""}
    onClick={() => setActivePage("Dashboard")}
  >
    Dashboard
  </p>

  <p
    className={activePage === "Transactions" ? "active" : ""}
    onClick={() => setActivePage("Transactions")}
  >
    Transactions
  </p>

  <p
    className={activePage === "Reports" ? "active" : ""}
    onClick={() => setActivePage("Reports")}
  >
    Reports
  </p>

  <p
    className={activePage === "Settings" ? "active" : ""}
    onClick={() => setActivePage("Settings")}
  >
    Settings
  </p>
</nav> 
      </aside>

      <main className="main-content">
       <header>
  <div>
    <h1>{activePage}</h1>
   <p>
  {activePage === "Dashboard"
    ? "Welcome back! Here's your financial overview."
    : `Welcome to ${activePage}`}
</p> 
  </div>

  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</header>
{activePage === "Dashboard" && (
        <section className="summary">
          <div className="card">
            <p>Total Balance</p>
            <h2>₹{balance.toLocaleString("en-IN")}</h2>
          </div>

          <div className="card">
            <p>Total Income</p>
            <h2>₹{income.toLocaleString("en-IN")}</h2>
          </div>

          <div className="card">
            <p>Total Expenses</p>
            <h2>₹{expenses.toLocaleString("en-IN")}</h2>
          </div>
        </section>
        )}

{activePage === "Transactions" && (
        <section className="transactions">
        <h2>{editingId ? "Update Transaction" : "Add Transaction"}</h2>

          <form onSubmit={addTransaction} className="transaction-form"> 
            <input
              type="text"
              placeholder="Transaction name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="Other">Other</option>
  <option value="Food">Food</option>
  <option value="Shopping">Shopping</option>
  <option value="Travel">Travel</option>
  <option value="Education">Education</option>
  <option value="Bills">Bills</option>
</select>
<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  required
/>

          <select
           
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
           

          <button type="submit">
  {editingId ? "Update Transaction" : "Add Transaction"}
</button>
</form>
          <h2 className="recent-heading">Recent Transactions</h2>
          <button
  className="clear-btn"
onClick={clearAllTransactions}
>
  Clear All Transactions
</button>
<button
  className="export-btn"
  onClick={exportCSV}
>
  Download CSV
</button>
<button
  className="pdf-btn"
  onClick={exportPDF}
>
  Download PDF
</button>

          <div className="filter-section">
  <input
    type="text"
    placeholder="Search transaction..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">All Transactions</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>
</div>

{filteredTransactions.length === 0 && (
  <p className="empty-message">
    No transactions found. Add your first transaction!
  </p>
)}
       {filteredTransactions.map((item) => (
          <div className="transaction" key={item._id}> 
              <span>{item.title}</span>

              <div className="transaction-actions">
                <strong className={item.type}>
                  {item.type === "income" ? "+" : "-"} ₹
                  {item.amount.toLocaleString("en-IN")}
                </strong>
<button
  className="edit-btn"
  onClick={() => editTransaction(item)}
>
  Edit
</button>
               <button
  className="delete-btn"
  onClick={() => deleteTransaction(item._id)}
>
  Delete
</button>
              </div>
            </div>
                 ))}
        </section>
        )}

        {/* Reports & Analytics Section */}
        {activePage === "Reports" && (
        <section className="reports">
          <h2>Reports & Analytics</h2>

          <div className="report-card">
            <h3>Income vs Expenses</h3>

            <div className="chart-item">
              <p>Total Income: ₹{income.toLocaleString("en-IN")}</p>

              <div className="chart-bar">
                <div
                  className="income-bar"
                  style={{ width: `${incomePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-item">
              <p>Total Expenses: ₹{expenses.toLocaleString("en-IN")}</p>

              <div className="chart-bar">
                <div
                  className="expense-bar"
                  style={{ width: `${expensePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
       </section>
)}

{activePage === "Settings" && (
<section className="profile-section">
  <h2>Profile Settings</h2>

  <div className="profile-card">
    {editProfile ? (
      <form onSubmit={saveProfile}>
        <input
          type="text"
          placeholder="Enter your name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
          required
        />

        <button type="submit">Save Profile</button>

        <button
          type="button"
          onClick={() => setEditProfile(false)}
        >
          Cancel
        </button>
      </form>
    ) : (
      <>
        <h3>{profile.name}</h3>
        <p>{profile.email}</p>

        <button onClick={() => setEditProfile(true)}>
          Edit Profile
        </button>
      </>
    )}
  </div>
</section>
)}

{activePage === "Reports" && (
<>
<section className="monthly-report">
  <h2>Monthly Report</h2>

  <div className="summary">
    <div className="card">
      <p>Monthly Income</p>
      <h2>₹{monthlyIncome.toLocaleString("en-IN")}</h2>
    </div>

    <div className="card">
      <p>Monthly Expenses</p>
      <h2>₹{monthlyExpenses.toLocaleString("en-IN")}</h2>
    </div>

    <div className="card">
      <p>Monthly Savings</p>
      <h2>₹{monthlySavings.toLocaleString("en-IN")}</h2>
    </div>
  </div>
</section>
<section className="category-report">
  <h2>Category-wise Expenses</h2>

  <div className="category-card">
    <div
      className="pie-chart"
      style={{ background: categoryGradient }}
    ></div>

    <div className="category-list">
      {Object.entries(categoryTotals).map(([name, amount]) => (
        <div className="category-item" key={name}>
          <span
            className="category-dot"
            style={{
              background: categoryColors[name] || "#64748b",
            }}
          ></span>

          <span>{name}</span>

          <strong>
            ₹{amount.toLocaleString("en-IN")}
          </strong>
        </div>
      ))}

      {Object.keys(categoryTotals).length === 0 && (
        <p>No expense data available yet.</p>
      )}
    </div>
  </div>
</section>
</>
)}
      </main>  
    </div>
  );
}
export default App;
