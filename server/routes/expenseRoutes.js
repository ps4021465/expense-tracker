const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary
} = require('../controllers/expenseController');

// Expense summary route (MUST come before /:id to prevent matching 'summary' as an ID)
router.get('/summary', getSummary);

// Expense collection routes
router.route('/')
  .get(getExpenses)
  .post(createExpense);

// Single expense routes
router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
