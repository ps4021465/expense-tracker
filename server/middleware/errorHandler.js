/**
 * Centralized Error Handling Middleware for Express & MySQL
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error Captured:', err);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MySQL specific error codes
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection refused. Ensure MySQL service is running.';
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    statusCode = 500;
    message = 'Database table not found. Please run schema.sql to initialize the database table.';
  } else if (err.code === 'ER_BAD_DB_ERROR') {
    statusCode = 500;
    message = 'Database does not exist. Please create "expense_tracker" database using schema.sql.';
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    statusCode = 401;
    message = 'Database access denied. Check your DB_USER and DB_PASSWORD in .env.';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry detected.';
  } else if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
    statusCode = 400;
    message = 'Invalid data provided for database fields.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, rawError: err.code })
  });
};

module.exports = errorHandler;
