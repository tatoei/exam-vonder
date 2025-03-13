const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Get all transactions
router.get("/", transactionController.getAllTransactions);

// Create new transaction
router.post("/", transactionController.createTransaction);

// Delete transaction
router.delete("/:id", transactionController.deleteTransaction);

// Get summary
router.get("/summary", transactionController.getSummary);

// Search transactions
router.get("/search", transactionController.searchTransactions);

module.exports = router;
