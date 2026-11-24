
const Transaction = require("../models/Transaction");

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, date, category } = req.body;

    const transaction = new Transaction({
      title,
      amount,
      type,
      date,
      category,
    });

    const savedTransaction = await transaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete all transactions
const deleteAllTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany({});

    res.status(200).json({
      message: "All transactions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

    if (!updatedTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  deleteAllTransactions,
};
