
const express = require("express");

const router = express.Router();

const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  deleteAllTransactions,
} = require("../controllers/transactionController");

// GET all transactions
router.get("/", getTransactions);

// POST new transaction
router.post("/", addTransaction);

// DELETE all transactions
router.delete("/", deleteAllTransactions);

// DELETE transaction
router.delete("/:id", deleteTransaction);

// PUT update transaction
router.put("/:id", updateTransaction);

module.exports = router;
