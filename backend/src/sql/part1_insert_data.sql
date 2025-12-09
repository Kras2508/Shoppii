USE ecommerce_db;

-- ==========================
-- DATA SUMMARY
-- ==========================
-- ACCOUNTS (7 total):
--   ID 1: Nguyen Van A (Customer) - c1@gmail.com
--   ID 2: Tran Thi B (Customer) - c2@gmail.com  
--   ID 3: Le Hoai C (Customer) - c3@gmail.com
--   ID 4: Shop ABC (Shop) - s1@gmail.com
--   ID 5: Shop XYZ (Shop) - s2@gmail.com
--   ID 6: Tech Store (Shop) - s3@gmail.com
--   ID 7: Admin Core (Admin) - admin1@gmail.com
--
-- SHOPS (3 total):
--   Shop 4 (Shop ABC): Products 1 Item 1, 2 | Orders from Customer 1,2
--   Shop 5 (Shop XYZ): Product 3 | No orders yet
--   Shop 6 (Tech Store): Products 4,5 | Orders from Customer 1,3
--
-- PRODUCTS (5 total):
--   Product 1: iPhone 14 (Shop 4) - Items 1,2 (Red 128GB, Blue 256GB)
--   Product 2: Samsung Galaxy S22 (Shop 4) - Item 3 (Black 128GB)
--   Product 3: T-Shirt Premium (Shop 5) - Item 4 (White Size M)
--   Product 4: Macbook Air M2 (Shop 6) - Item 5 (Silver 16GB RAM)
--   Product 5: Wireless Headset (Shop 6) - Item 6 (Black Standard)
--
-- ORDERS (4 total):
--   Order 1: Customer 1 → Items 1,2 (Shop 4) - Processing - 1,985,000 VND
--   Order 2: Customer 2 → Item 3 (Shop 4) - Cancelled - 904,000 VND
--   Order 3: Customer 3 → Item 4 (Shop 5) - Delivered - 31,000 VND
--   Order 4: Customer 1 → Item 6 (Shop 6) - Shipped - 84,500 VND
--
-- REVIEWS (5 total):
--   Review 1: Customer 1 → Product 1 (iPhone) - 5★
--   Review 2: Customer 2 → Product 3 (T-Shirt) - 4★
--   Review 3: Customer 1 → Shop 4 (Shop ABC) - 5★
--   Review 4: Customer 3 → Shop 6 (Tech Store) - 5★
--   Review 5: Customer 2 → Product 4 (Macbook) - 5★
--
-- CUSTOMER STATS:
--   Customer 1: 2 orders (2,069,500 VND) - Orders 1,4
--   Customer 2: 1 order cancelled (0 VND) - Order 2
--   Customer 3: 1 order (1,156,000 VND) - Order 3
--
-- SHOP STATS:
--   Shop 4: 2 products, 3 items, 2 orders (1 cancelled), 2 reviews
--   Shop 5: 1 product, 1 item, 1 order, 1 review (for product)
--   Shop 6: 2 products, 2 items, 1 order, 2 reviews (1 shop, 1 product)
-- ==========================

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
UPDATE Customer SET address = '123 HCM Street', add_phone = '0908888888' WHERE customer_id = 1;
UPDATE Customer SET address = '456 HCM Street', add_phone = '0909999999' WHERE customer_id = 2;
UPDATE Customer SET address = '789 Ha Noi Street', add_phone = '0911111111' WHERE customer_id = 3;

-- ==========================
-- 3. SHOP (shop_id = account_id)
-- Trigger trg_account_after_insert đã tự động tạo Shop records
-- Chỉ cần UPDATE thêm thông tin
-- ==========================
UPDATE Shop SET shop_name = 'Shop ABC', shop_phone = '0904444444', address_shop = '12 District 1', rating = 4, shop_status = 'Open' WHERE shop_id = 4;
UPDATE Shop SET shop_name = 'Shop XYZ', shop_phone = '0905555555', address_shop = '45 District 3', rating = 0, shop_status = 'Open' WHERE shop_id = 5;
UPDATE Shop SET shop_name = 'Tech Store', shop_phone = '0906666666', address_shop = '67 District 7', rating = 5, shop_status = 'Open' WHERE shop_id = 6;

-- ==========================
-- 3.1. ADMIN (admin_id = account_id)
-- ==========================
UPDATE Admin SET role = 'Core', note = 'Main administrator' WHERE admin_id = 7;

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
 (1,4,'Red','128GB',1000000,50,'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'),
 (1,4,'Blue','256GB',1200000,30,'https://images.unsplash.com/photo-1664472252707-5ded875aaffe?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
 (2,4,'Black','128GB',900000,20,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
 (3,5,'White','Size M',25000,100,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
 (4,6,'Silver','16GB RAM',1200000,15,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
 (5,6,'Black','Standard',80000,60,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400');

-- ==========================
-- 7. CART
-- Trigger trg_account_after_insert đã tự động tạo Cart cho Customer
-- Không cần INSERT thủ công
-- ==========================
-- INSERT INTO Cart (customer_id) VALUES (1),(2),(3); -- Bỏ qua vì trigger đã tạo

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
 ('GHN',2,5000,'Active'),
 ('J&T',3,4000,'Active'),
 ('Shopee Express',1,6000,'Active'),
 ('Ninja Van',4,4500,'Active');

-- ==========================
-- 10. VOUCHER
-- ==========================
INSERT INTO Voucher (code, discount_type, discount_value, min_order_value, start_date, expired_date, usage_limit, status)
VALUES
 ('DISCOUNT10','Percentage',10,100000,'2025-01-01','2025-12-31',10,'Active'),
 ('SAVE50','Amount',50000,200000,'2025-06-01','2025-12-31',10,'Active'),
 ('NEWYEAR5','Percentage',5,50000,'2025-12-01','2026-01-01',20,'Active'),
 ('EXPIRED100','Amount',100,300000,'2025-10-01','2025-11-30',5,'Expired');

-- ==========================
-- 11. ORDER
-- ==========================
-- Note: total_amount = subtotal + shipping_fee - voucher_discount
INSERT INTO `Order` (customer_id, shipping_id, voucher_id, status, shipping_address, payment_method, note)
VALUES
 (1,1,1,'Delivered','123 HCM Street','COD','Please call before delivery'), -- (1000000 + 1200000) + 5000 - 220000 (10% voucher, đủ min 100k)
 (2,2,NULL,'Cancelled','456 HCM Street','Banking',NULL), -- 900000 + 4000 (shipping)
 (3,3,2,'Delivered','789 Ha Noi Street','Momo','Leave at the door'), -- 25000 + 6000 (shipping) - Voucher không áp dụng (subtotal < min 200k)
 (1,4,NULL,'Delivered','123 HCM Street','ZaloPay',NULL); -- 80000 + 4500 (shipping)

-- ==========================
-- 12. ORDER ITEM (item_id thay vì variantID)
-- ==========================
INSERT INTO OrderItem (order_id, item_id, shop_id, quantity, price_at_purchase)
VALUES
 (1,1,4,1,1000000),
 (1,2,4,1,1200000),
 (2,3,4,1,900000),
 (3,4,5,1,25000),
 (4,6,6,1,80000);
-- ==========================
-- 13. REVIEW
-- Chỉ review sản phẩm/shop từ đơn hàng Delivered
-- Order 1 (Delivered): Customer 1 → Product 1 (item 1,2) → Shop 4
-- Order 3 (Delivered): Customer 3 → Product 3 (item 4) → Shop 5
-- Order 4 (Delivered): Customer 1 → Product 5 (item 6) → Shop 6
-- ==========================
INSERT INTO Review (customer_id, target_type, target_id, rating, comment, image_url)
VALUES
 (1,'Product',1,5,'Excellent product',NULL),         -- Customer 1 bought Product 1 (Order 1)
 (1,'Product',1,3,'Normal',NULL),                    -- Customer 1 bought Product 1 (Order 1)
 (3,'Product',3,4,'Good quality',NULL),              -- Customer 3 bought Product 3 (Order 3)
 (1,'Shop',4,5,'Very professional',NULL),            -- Customer 1 bought from Shop 4 (Order 1)
 (3,'Shop',5,5,'Fast delivery',NULL),                -- Customer 3 bought from Shop 5 (Order 3)
 (1,'Product',5,5,'Great headset',NULL),             -- Customer 1 bought Product 5 (Order 4)
 (1,'Shop',6,4,'Good service',NULL);                 -- Customer 1 bought from Shop 6 (Order 4)