-- --------------------------------------------------------
-- FRESH FULL SETUP SCRIPT
-- RUN THIS IN MYSQL WORKBENCH TO RESET EVERYTHING
-- --------------------------------------------------------

-- 1. Drop the database if it exists (Starting Fresh)
DROP DATABASE IF EXISTS expense_tracker;

-- 2. Create the Database
CREATE DATABASE expense_tracker;
USE expense_tracker;

-- 3. Create 'users' table (Stores Signup Details)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create 'expenses' table (Stores Expense Logs)
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Links to the user who added the expense
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    note VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- OPTIONAL: Insert a dummy test user (password: 123456)
-- You can remove this if you want to only register via the app
-- --------------------------------------------------------
-- INSERT INTO users (username, email, password_hash) 
-- VALUES ('testuser', 'test@example.com', '$2a$10$examplehashplaceholder');
