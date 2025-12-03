-- part1_create_tables.sql
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- ACCOUNT
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

-- CUSTOMER
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    account_id INT UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    add_phone VARCHAR(20),
    total_spent DECIMAL(10,2) DEFAULT 0,
    total_order INT DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

-- SHOP
CREATE TABLE Shop (
    shop_id INT PRIMARY KEY,
    account_id INT UNIQUE NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_phone VARCHAR(20),
    address_shop VARCHAR(255),
    rating INT CHECK (rating BETWEEN 0 AND 5),
    shop_status ENUM('Open','Temporarily Close','Closed') DEFAULT 'Open',
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

-- ADMIN
CREATE TABLE Admin (
    admin_id INT PRIMARY KEY,
    account_id INT UNIQUE NOT NULL,
    role ENUM('Core','Moderator','Support') NOT NULL,
    note TEXT,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

-- CATEGORY
CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    FOREIGN KEY (parent_category_id) REFERENCES Category(category_id)
);

-- PRODUCT
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    status ENUM('In stock','Out of stock') DEFAULT 'In stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- PRODUCT ITEM
CREATE TABLE ProductItem (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    shop_id INT NOT NULL,
    order_id INT,
    color VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK(price >= 0),
    stock INT NOT NULL CHECK(stock >= 0),
    image_url VARCHAR(255),
    quantity INT DEFAULT 0,
    price_at_purchase DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id)
);

-- CART
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

-- CART ITEM
CREATE TABLE CartItem (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK(quantity >= 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
    FOREIGN KEY (item_id) REFERENCES ProductItem(item_id)
);

-- SHIPPING
CREATE TABLE Shipping (
    shipping_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    estimated_days INT NOT NULL CHECK(estimated_days >= 0),
    fee DECIMAL(10,2) NOT NULL,
    status ENUM('Active','Inactive') DEFAULT 'Active'
);

-- VOUCHER
CREATE TABLE Voucher (
    voucher_id INT AUTO_INCREMENT PRIMARY KEY,
    discount_type ENUM('Percentage','Amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK(discount_value >=0),
    min_order_value DECIMAL(10,2) DEFAULT 0 CHECK(min_order_value >=0),
    expired_date DATE NOT NULL,
    usage_limit INT DEFAULT 1 CHECK(usage_limit >=1),
    used_count INT DEFAULT 0,
    status ENUM('Active','Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER
CREATE TABLE `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    shipping_id INT NOT NULL,
    voucher_id INT,
    status ENUM('Processing','Shipped','Delivered','Cancelled') DEFAULT 'Processing',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (shipping_id) REFERENCES Shipping(shipping_id),
    FOREIGN KEY (voucher_id) REFERENCES Voucher(voucher_id)
);

-- ORDER ITEM
CREATE TABLE OrderItem (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variantID INT NOT NULL,
    shop_id INT NOT NULL,
    quantity INT NOT NULL CHECK(quantity >= 1),
    price_at_purchase DECIMAL(10,2) NOT NULL CHECK(price_at_purchase >= 0),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
    FOREIGN KEY (variantID) REFERENCES ProductItem(item_id),
    FOREIGN KEY (shop_id) REFERENCES Shop(shop_id)
);

-- REVIEW
CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    target_type ENUM('Shop','Product') NOT NULL,
    target_id INT NOT NULL,
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    image_url VARCHAR(255),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);
