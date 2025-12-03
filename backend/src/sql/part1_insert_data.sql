USE ecommerce_db;

-- ==========================
-- 1. ACCOUNT
-- ==========================
INSERT INTO Account (email, password, role, full_name, phone)
VALUES
 ('c1@mail.com','1234','Customer','Nguyen Van A','0901111111'),
 ('c2@mail.com','1234','Customer','Tran Thi B','0902222222'),
 ('c3@mail.com','1234','Customer','Le Hoai C','0903333333'),
 ('s1@mail.com','1234','Shop','Shop ABC','0904444444'),
 ('s2@mail.com','1234','Shop','Shop XYZ','0905555555'),
 ('s3@mail.com','1234','Shop','Tech Store','0906666666'),
 ('admin1@mail.com','1234','Admin','Admin Core','0907777777');

-- ==========================
-- 2. CUSTOMER
-- ==========================
INSERT INTO Customer (customer_id, account_id, address, add_phone)
VALUES
 (1,1,'123 HCM Street','0908888888'),
 (2,2,'456 HCM Street','0909999999'),
 (3,3,'789 Ha Noi Street','0911111111');

-- ==========================
-- 3. SHOP
-- ==========================
INSERT INTO Shop (shop_id, account_id, shop_name, shop_phone, address_shop, rating)
VALUES
 (1,4,'Shop ABC','0904444444','12 District 1',5),
 (2,5,'Shop XYZ','0905555555','45 District 3',4),
 (3,6,'Tech Store','0906666666','67 District 7',5);

-- ==========================
-- 4. CATEGORY
-- ==========================
INSERT INTO Category (category_name, parent_category_id)
VALUES
 ('Electronics',NULL),
 ('Fashion',NULL),
 ('Phones',1),
 ('Laptops',1),
 ('Clothes',2);

-- ==========================
-- 5. PRODUCT
-- ==========================
INSERT INTO Product (shop_id, category_id, product_name, description)
VALUES
 (1,1,'iPhone 14','Brand new iPhone 14'),
 (1,3,'Samsung Galaxy S22','Latest Samsung flagship'),
 (2,5,'T-Shirt Premium','High-quality cotton shirt'),
 (3,4,'Macbook Air M2','Lightweight Apple laptop'),
 (3,1,'Wireless Headset','Bluetooth headset 2024');

-- ==========================
-- 6. PRODUCT ITEM (variants)
-- ==========================
INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock)
VALUES
 (1,1,'Red','128GB',1000,50),
 (1,1,'Blue','256GB',1200,30),
 (2,1,'Black','128GB',900,20),
 (3,2,'White','Size M',25,100),
 (4,3,'Silver','16GB RAM',1200,15),
 (5,3,'Black','Standard',80,60);

-- ==========================
-- 7. CART
-- ==========================
INSERT INTO Cart (customer_id)
VALUES
 (1),(2),(3);

-- ==========================
-- 8. CART ITEM
-- ==========================
INSERT INTO CartItem (cart_id, item_id, quantity)
VALUES
 (1,1,1),
 (1,2,2),
 (2,3,1),
 (3,4,3);

-- ==========================
-- 9. SHIPPING
-- ==========================
INSERT INTO Shipping (name, estimated_days, fee)
VALUES
 ('GHN',2,5),
 ('J&T',3,4),
 ('Shopee Express',1,6),
 ('Ninja Van',4,4.5);

-- ==========================
-- 10. VOUCHER
-- ==========================
INSERT INTO Voucher (discount_type, discount_value, min_order_value, expired_date)
VALUES
 ('Percentage',10,100,'2025-12-31'),
 ('Amount',50,200,'2025-12-31'),
 ('Percentage',5,50,'2026-01-01');

-- ==========================
-- 11. ORDER
-- ==========================
INSERT INTO `Order` (customer_id, shipping_id, voucher_id, shipping_address, total_amount, payment_method)
VALUES
 (1,1,1,'123 HCM Street',1100,'Cash'),
 (2,2,NULL,'456 HCM Street',900,'Bank Transfer'),
 (3,3,2,'789 Ha Noi Street',1300,'Credit Card'),
 (1,4,NULL,'123 HCM Street',80,'Momo');

-- ==========================
-- 12. ORDER ITEM
-- ==========================
INSERT INTO OrderItem (order_id, variantID, shop_id, quantity, price_at_purchase)
VALUES
 (1,1,1,1,1000),
 (1,2,1,1,1200),
 (2,3,1,1,900),
 (3,5,3,1,1200),
 (4,6,3,1,80);

-- ==========================
-- 13. REVIEW
-- ==========================
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES
 (1,'Product',1,5,'Excellent product'),
 (2,'Product',3,4,'Good quality'),
 (1,'Shop',1,5,'Very professional'),
 (3,'Shop',3,5,'Fast delivery'),
 (2,'Product',4,5,'Laptop runs smoothly');
