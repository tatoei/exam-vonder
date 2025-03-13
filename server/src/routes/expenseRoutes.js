const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  createExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.get("/", getAllExpenses);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
