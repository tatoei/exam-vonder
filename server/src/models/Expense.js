const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    income: {
      type: String,
      default: "$0.00",
    },
    expense: {
      type: String,
      default: "$0.00",
    },
    balance: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
