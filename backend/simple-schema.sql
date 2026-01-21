-- Simple schema for testing without authentication
DROP DATABASE IF EXISTS expense_tracker;
CREATE DATABASE expense_tracker;
USE expense_tracker;

-- Create expenses table without user_id for testing
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    note VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO expenses (amount, category, date, note) VALUES
(150.00, 'Food', '2026-01-20', 'Lunch at restaurant'),
(50.00, 'Travel', '2026-01-19', 'Uber ride'),
(1200.00, 'Rent', '2026-01-01', 'Monthly rent'),
(200.00, 'Shopping', '2026-01-18', 'Groceries'),
(75.00, 'Others', '2026-01-17', 'Miscellaneous');
