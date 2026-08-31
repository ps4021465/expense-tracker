const { pool } = require('../config/db');

/**
 * Helper function for input validation
 */
const validateExpenseInput = ({ title, amount, category, date }) => {
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required and must not be empty.');
  }

  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push('Amount is required and must be a positive number greater than 0.');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required.');
  }

  if (!date || isNaN(Date.parse(date))) {
    errors.push('A valid date is required (format YYYY-MM-DD).');
  }

  return errors;
};

/**
 * @route   GET /api/expenses
 * @desc    Fetch all expenses with optional filtering & search
 * @access  Public
 */
const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, search, sortBy = 'date', order = 'DESC' } = req.query;

    let query = 'SELECT id, title, amount, category, date, created_at FROM expenses WHERE 1=1';
    const params = [];

    // Filter by category
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filter by start date
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    // Filter by end date
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    // Search by title or category keyword
    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    // Validate sorting column to prevent SQL injection
    const allowedSortFields = ['date', 'amount', 'title', 'category', 'id'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const validOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${validSortBy} ${validOrder}, id DESC`;

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/expenses/:id
 * @desc    Fetch single expense by ID
 * @access  Public
 */
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/expenses
 * @desc    Add a new expense
 * @access  Public
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validate input fields
    const validationErrors = validateExpenseInput({ title, amount, category, date });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const cleanTitle = title.trim();
    const cleanAmount = parseFloat(amount).toFixed(2);
    const cleanCategory = category.trim();
    const cleanDate = date.split('T')[0]; // Format as YYYY-MM-DD

    const query = 'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [cleanTitle, cleanAmount, cleanCategory, cleanDate]);

    // Fetch the newly created expense
    const [newExpense] = await pool.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an existing expense
 * @access  Public
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    // Check if expense exists
    const [existing] = await pool.query('SELECT id FROM expenses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${id} not found.`
      });
    }

    // Validate input fields
    const validationErrors = validateExpenseInput({ title, amount, category, date });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const cleanTitle = title.trim();
    const cleanAmount = parseFloat(amount).toFixed(2);
    const cleanCategory = category.trim();
    const cleanDate = date.split('T')[0];

    const query = 'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?';
    await pool.query(query, [cleanTitle, cleanAmount, cleanCategory, cleanDate, id]);

    // Fetch updated record
    const [updatedRows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedRows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Public
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    // Check if expense exists
    const [existing] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${id} not found.`
      });
    }

    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: existing[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/expenses/summary
 * @desc    Get total spend, category-wise breakdown, and monthly breakdown (SQL GROUP BY and SUM)
 * @access  Public
 */
const getSummary = async (req, res, next) => {
  try {
    // 1. Overall stats (total spend, total transactions, average transaction)
    const overallQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) AS totalSpend,
        COUNT(*) AS totalTransactions,
        COALESCE(AVG(amount), 0) AS avgSpend,
        COALESCE(MAX(amount), 0) AS maxSpend,
        COALESCE(MIN(amount), 0) AS minSpend
      FROM expenses
    `;
    const [overallStats] = await pool.query(overallQuery);

    // 2. Category-wise breakdown (SQL GROUP BY category & SUM)
    const categoryQuery = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) AS totalAmount,
        COUNT(*) AS count
      FROM expenses
      GROUP BY category
      ORDER BY totalAmount DESC
    `;
    const [categoryBreakdown] = await pool.query(categoryQuery);

    // 3. Monthly trend breakdown (SQL GROUP BY month)
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month,
        DATE_FORMAT(date, '%b %Y') AS monthLabel,
        COALESCE(SUM(amount), 0) AS totalAmount,
        COUNT(*) AS count
      FROM expenses
      GROUP BY month, monthLabel
      ORDER BY month ASC
    `;
    const [monthlyBreakdown] = await pool.query(monthlyQuery);

    // 4. Current month spend
    const currentMonthQuery = `
      SELECT COALESCE(SUM(amount), 0) AS currentMonthSpend
      FROM expenses
      WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE(), '%Y-%m')
    `;
    const [currentMonthResult] = await pool.query(currentMonthQuery);

    const stats = overallStats[0] || {};
    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    res.status(200).json({
      success: true,
      summary: {
        totalSpend: Number(stats.totalSpend || 0),
        totalTransactions: Number(stats.totalTransactions || 0),
        avgSpend: Number(stats.avgSpend || 0),
        maxSpend: Number(stats.maxSpend || 0),
        minSpend: Number(stats.minSpend || 0),
        currentMonthSpend: Number(currentMonthResult[0]?.currentMonthSpend || 0),
        topCategory: topCategory ? {
          category: topCategory.category,
          amount: Number(topCategory.totalAmount),
          count: Number(topCategory.count)
        } : null,
        categoryBreakdown: categoryBreakdown.map(item => ({
          category: item.category,
          totalAmount: Number(item.totalAmount),
          count: Number(item.count)
        })),
        monthlyBreakdown: monthlyBreakdown.map(item => ({
          month: item.month,
          monthLabel: item.monthLabel,
          totalAmount: Number(item.totalAmount),
          count: Number(item.count)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary
};
