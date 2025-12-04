USE ecommerce_db;

-- ==========================
-- 1. ACCOUNT
-- ==========================
INSERT INTO Account (email, password, role, full_name, phone, status)
VALUES
 ('c1@gmail.com','1234','Customer','Nguyen Van A','0901111111','Active'),
 ('c2@gmail.com','1234','Customer','Tran Thi B','0902222222','Active'),
 ('c3@gmail.com','1234','Customer','Le Hoai C','0903333333','Active'),
 ('s1@gmail.com','1234','Shop','Shop ABC','0904444444','Active'),
 ('s2@gmail.com','1234','Shop','Shop XYZ','0905555555','Active'),
 ('s3@gmail.com','1234','Shop','Tech Store','0906666666','Active'),
 ('admin1@gmail.com','1234','Admin','Admin Core','0907777777','Active');

-- ==========================
-- 2. CUSTOMER (customer_id = account_id)
-- ==========================
INSERT INTO Customer (customer_id, address, add_phone)
VALUES
 (1,'123 HCM Street','0908888888'),
 (2,'456 HCM Street','0909999999'),
 (3,'789 Ha Noi Street','0911111111');

-- ==========================
-- 3. SHOP (shop_id = account_id)
-- ==========================
INSERT INTO Shop (shop_id, shop_name, shop_phone, address_shop, rating, shop_status)
VALUES
 (4,'Shop ABC','0904444444','12 District 1',5,'Open'),
 (5,'Shop XYZ','0905555555','45 District 3',4,'Open'),
 (6,'Tech Store','0906666666','67 District 7',5,'Open');

-- ==========================
-- 3.1. ADMIN (admin_id = account_id)
-- ==========================
INSERT INTO Admin (admin_id, role, note)
VALUES
 (7,'Core','Main administrator');

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
-- 5. PRODUCT (shop_id references Account with role='Shop')
-- ==========================
INSERT INTO Product (shop_id, category_id, product_name, description, image)
VALUES
 (4,1,'iPhone 14','Brand new iPhone 14','https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'),
 (4,3,'Samsung Galaxy S22','Latest Samsung flagship','https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
 (5,2,'T-Shirt Premium','High-quality cotton shirt','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
 (6,1,'Macbook Air M2','Lightweight Apple laptop','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
 (6,1,'Wireless Headset','Bluetooth headset 2024','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400');

-- ==========================
-- 6. PRODUCT ITEM (variants)
-- ==========================
INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock, image_url)
VALUES
 (1,4,'Red','128GB',1000,50,'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'),
 (1,4,'Blue','256GB',1200,30,'https://images.unsplash.com/photo-1664472252707-5ded875aaffe?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
 (2,4,'Black','128GB',900,20,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
 (3,5,'White','Size M',25,100,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
 (4,6,'Silver','16GB RAM',1200,15,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
 (5,6,'Black','Standard',80,60,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400');

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
 (3,5,3);

-- ==========================
-- 9. SHIPPING
-- ==========================
INSERT INTO Shipping (name, estimated_days, fee, status)
VALUES
 ('GHN',2,5,'Active'),
 ('J&T',3,4,'Active'),
 ('Shopee Express',1,6,'Active'),
 ('Ninja Van',4,4.5,'Active');

-- ==========================
-- 10. VOUCHER
-- ==========================
INSERT INTO Voucher (discount_type, discount_value, min_order_value, expired_date, usage_limit, status)
VALUES
 ('Percentage',10,100,'2025-12-31',10,'Active'),
 ('Amount',50,200,'2025-12-31',10,'Active'),
 ('Percentage',5,50,'2026-01-01',20,'Active'),
 ('Amount',100,300,'2025-11-30',5,'Expired');

-- ==========================
-- 11. ORDER
-- ==========================
INSERT INTO `Order` (customer_id, shipping_id, voucher_id, status, shipping_address, total_amount, payment_method)
VALUES
 (1,1,1,'Processing','123 HCM Street',1100,'Cash'),
 (2,2,NULL,'Cancelled','456 HCM Street',900,'Bank Transfer'),
 (3,3,2,'Delivered','789 Ha Noi Street',1300,'Credit Card'),
 (1,4,NULL,'Shipped','123 HCM Street',80,'Momo');

-- ==========================
-- 12. ORDER ITEM (item_id thay vì variantID)
-- ==========================
INSERT INTO OrderItem (order_id, item_id, shop_id, quantity, price_at_purchase)
VALUES
 (1,1,4,1,1000),
 (1,2,4,1,1200),
 (2,3,4,1,900),
 (3,4,6,1,1200),
 (4,6,6,1,80);

-- ==========================
-- 13. REVIEW
-- ==========================
INSERT INTO Review (customer_id, target_type, target_id, rating, comment, image_url)
VALUES
 (1,'Product',1,5,'Excellent product',NULL),
 (2,'Product',3,4,'Good quality',NULL),
 (1,'Shop',4,5,'Very professional',NULL),
 (3,'Shop',6,5,'Fast delivery',NULL),
 (2,'Product',4,5,'Laptop runs smoothly',NULL);
