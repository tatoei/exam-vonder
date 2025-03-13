const Expense = require("../models/Expense");

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const { date, item, transactionType, amount } = req.body;

    // Get current balance
    const lastExpense = await Expense.findOne().sort({ date: -1 });
    const currentBalance = lastExpense
      ? parseFloat(lastExpense.balance.replace("$", ""))
      : 0;

    // Calculate new balance
    const amountNum = parseFloat(amount);
    let newBalance;
    let incomeAmount = "$0.00";
    let expenseAmount = "$0.00";

    if (transactionType === "income") {
      newBalance = currentBalance + amountNum;
      incomeAmount = `$${amountNum.toFixed(2)}`;
    } else {
      newBalance = currentBalance - amountNum;
      expenseAmount = `$${amountNum.toFixed(2)}`;
    }

    const expense = new Expense({
      date,
      item,
      income: incomeAmount,
      expense: expenseAmount,
      balance: `$${newBalance.toFixed(2)}`,
    });

    await expense.save();
    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Recalculate balances for remaining expenses
    const expenses = await Expense.find().sort({ date: 1 });
    let balance = 0;
    for (const exp of expenses) {
      const income = parseFloat(exp.income.replace("$", "")) || 0;
      const expense = parseFloat(exp.expense.replace("$", "")) || 0;
      balance = balance + income - expense;
      exp.balance = `$${balance.toFixed(2)}`;
      await exp.save();
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
