const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Create a MySQL Connection Pool using mysql2/promise
 * Connection pooling improves performance by reusing existing connections
 * instead of opening and closing connections on every request.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_tracker',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // Keep MySQL DATE formatted as 'YYYY-MM-DD' strings
});

/**
 * Test database connectivity on startup
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database:', process.env.DB_NAME || 'expense_tracker');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database!');
    console.error('   Error Details:', error.message);
    console.error('👉 Please make sure:');
    console.error('   1. MySQL server is running (e.g. via XAMPP, WAMP, MySQL Workbench, or service).');
    console.error('   2. Database "expense_tracker" exists (run server/schema.sql to create it).');
    console.error('   3. Credentials in server/.env match your MySQL setup.');
  }
};

module.exports = {
  pool,
  testConnection
};
