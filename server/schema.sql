-- ==========================================================
-- Expense Tracker Database Schema & Seed Data
-- ==========================================================

-- 1. Create the Database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- 2. Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Optional: Insert initial sample records for testing (in INR ₹)
INSERT INTO expenses (title, amount, category, date) VALUES
('Grocery Shopping at Supermarket', 3450.00, 'Food & Dining', '2026-08-15'),
('Monthly High-Speed Fiber Internet', 999.00, 'Utilities', '2026-08-01'),
('Metro Card Recharge & Commute', 1200.00, 'Transportation', '2026-08-05'),
('Dinner with Friends & Family', 2480.00, 'Food & Dining', '2026-08-18'),
('Monthly Gym Membership Renewal', 1800.00, 'Health & Fitness', '2026-08-02'),
('Electricity & Power Utility Bill', 2650.00, 'Utilities', '2026-08-10'),
('Movie Tickets & Weekend Snacks', 850.00, 'Entertainment', '2026-08-20'),
('New Ergonomic Office Chair', 8500.00, 'Shopping', '2026-08-12'),
('Apartment House Rent', 18500.00, 'Housing', '2026-08-01'),
('Coffee & Breakfast Treats', 350.00, 'Food & Dining', '2026-08-28'),
('Books & Online Course Subscription', 1499.00, 'Education', '2026-08-22'),
('Pharmacy & Prescription Medicine', 780.00, 'Healthcare', '2026-08-25');
