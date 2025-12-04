-- part1_create_tables.sql
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- ==========================
-- CREATE USER sManager
-- ==========================
DROP USER IF EXISTS 'sManager'@'localhost';
CREATE USER 'sManager'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON *.* TO 'sManager'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- ==========================
-- TABLES
-- ==========================

-- ACCOUNT (Superclass)
CREATE TABLE Account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Customer','Shop','Admin') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status ENUM('Active','Ban') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CUSTOMER (Subclass of Account, 1-1 relationship)
-- customer_id = account_id (same key)
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    address VARCHAR(255),
    add_phone VARCHAR(20),
    total_spent DECIMAL(15,2) DEFAULT 0,
    total_order INT DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- SHOP (Subclass of Account, 1-1 relationship)
-- shop_id = account_id (same key)
CREATE TABLE Shop (
    shop_id INT PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    shop_phone VARCHAR(20),
    address_shop VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    shop_status ENUM('Open','Temporarily Close','Closed') DEFAULT 'Open',
    FOREIGN KEY (shop_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- ADMIN (Subclass of Account, 1-1 relationship)
-- admin_id = account_id (same key)
CREATE TABLE Admin (
    admin_id INT PRIMARY KEY,
    role ENUM('Core','Moderator','Support') NOT NULL,
    note TEXT,
    FOREIGN KEY (admin_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- CATEGORY (1-N recursive relationship)
CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    FOREIGN KEY (parent_category_id) REFERENCES Category(category_id) ON DELETE SET NULL
);

-- PRODUCT (Shop 1-N Product, Category 1-N Product)
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    status ENUM('In stock','Out of stock') DEFAULT 'In stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- PRODUCT ITEM (Product 1-N ProductItem)
-- Represents variants (color, size, etc.)
-- Removed order_id, quantity, price_at_purchase (these belong in OrderItem)
CREATE TABLE ProductItem (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    shop_id INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(15,2) NOT NULL CHECK(price >= 0),
    stock INT NOT NULL CHECK(stock >= 0),
    image_url VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id) ON DELETE CASCADE
);

-- CART (Customer 1-1 Cart)
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- CART ITEM (Cart N-M ProductItem through CartItem)
CREATE TABLE CartItem (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK(quantity >= 1),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES ProductItem(item_id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (cart_id, item_id)
);

-- SHIPPING (Order N-1 Shipping)
CREATE TABLE Shipping (
    shipping_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    estimated_days INT NOT NULL CHECK(estimated_days >= 0),
    fee DECIMAL(10,2) NOT NULL CHECK(fee >= 0),
    status ENUM('Active','Inactive') DEFAULT 'Active'
);

-- VOUCHER (Order N-1 Voucher)
CREATE TABLE Voucher (
    voucher_id INT AUTO_INCREMENT PRIMARY KEY,
    discount_type ENUM('Percentage','Amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK(discount_value >= 0),
    min_order_value DECIMAL(15,2) DEFAULT 0 CHECK(min_order_value >= 0),
    expired_date DATE NOT NULL,
    usage_limit INT DEFAULT 1 CHECK(usage_limit >= 1),
    used_count INT DEFAULT 0,
    status ENUM('Active','Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER (Customer 1-N Order)
CREATE TABLE `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    shipping_id INT NOT NULL,
    voucher_id INT,
    status ENUM('Processing','Shipped','Delivered','Cancelled') DEFAULT 'Processing',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address VARCHAR(255) NOT NULL,
    total_amount DECIMAL(15,2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (shipping_id) REFERENCES Shipping(shipping_id),
    FOREIGN KEY (voucher_id) REFERENCES Voucher(voucher_id) ON DELETE SET NULL
);

-- ORDER ITEM (Order M-N ProductItem through OrderItem)
-- Also: Shop 1-N OrderItem
CREATE TABLE OrderItem (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    shop_id INT NOT NULL,
    quantity INT NOT NULL CHECK(quantity >= 1),
    price_at_purchase DECIMAL(15,2) NOT NULL CHECK(price_at_purchase >= 0),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES ProductItem(item_id),
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id)
);

-- REVIEW (Customer 1-N Review, Product/Shop 1-N Review)
-- target_type + target_id identifies which entity is being reviewed
CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    target_type ENUM('Shop','Product') NOT NULL,
    target_id INT NOT NULL,
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    image_url VARCHAR(255),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);