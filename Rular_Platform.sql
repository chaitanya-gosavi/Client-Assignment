-- Create the database
CREATE DATABASE IF NOT EXISTS rural_platform;
USE rural_platform;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    headline VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Products
INSERT INTO products (name, price, image_url) VALUES
('Fresh Bread', 30, 'https://img.icons8.com/ios-filled/50/000000/bread.png'),
('Butter', 50, 'https://img.icons8.com/ios-filled/50/000000/butter.png'),
('Milk', 25, 'https://img.icons8.com/ios-filled/50/000000/milk-bottle.png'),
('Eggs', 40, 'https://img.icons8.com/ios-filled/50/000000/eggs.png'),
('Rice', 60, 'https://img.icons8.com/ios-filled/50/000000/rice-bowl.png'),
('Vegetables', 35, 'https://img.icons8.com/ios-filled/50/000000/vegetarian-food-symbol.png');

-- Sample Services
INSERT INTO services (name, icon_url) VALUES
('Grocery Delivery', 'https://img.icons8.com/ios-filled/50/000000/grocery-bag.png'),
('Healthcare Access', 'https://img.icons8.com/ios-filled/50/000000/doctor-male.png'),
('Farming Tools', 'https://img.icons8.com/ios-filled/50/000000/tractor.png'),
('Education Support', 'https://img.icons8.com/ios-filled/50/000000/school.png'),
('Water Supply', 'https://img.icons8.com/ios-filled/50/000000/water.png');

-- Sample News
INSERT INTO news (headline) VALUES
('New water supply project launched in Village A.'),
('Mobile health camps scheduled for next week.'),
('Government announces subsidy for farming equipment.');