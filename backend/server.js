
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "ExpenseTrack Backend is Running Successfully!"
  });
});

// Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
}); 
};

startServer();

