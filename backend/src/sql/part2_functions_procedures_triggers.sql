-- =============================================
-- Part 2: FUNCTIONS, PROCEDURES, AND TRIGGERS
-- E-Commerce Marketplace Database (Updated)
-- =============================================

USE ecommerce_db;

-- =============================================
-- FUNCTIONS
-- =============================================

-- Drop functions if they exist
DROP FUNCTION IF EXISTS fn_calculate_order_total;
DROP FUNCTION IF EXISTS fn_get_customer_total_spent;
DROP FUNCTION IF EXISTS fn_get_shop_revenue;
DROP FUNCTION IF EXISTS fn_calculate_shop_rating;

DELIMITER $$

-- ---------------------------------------------
-- FUNCTION 1: Calculate Order Total
-- Tính tổng giá trị đơn hàng từ order_item
-- SELECT từ 2 bảng: order_item, order
-- ---------------------------------------------
CREATE FUNCTION fn_calculate_order_total(p_order_id INT)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(15, 2);
    
    SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)
    INTO v_total
    FROM OrderItem oi
    INNER JOIN `Order` o ON oi.order_id = o.order_id
    WHERE oi.order_id = p_order_id;
    
    RETURN v_total;
END$$

-- ---------------------------------------------
-- FUNCTION 2: Get Customer Total Spent
-- Tính tổng chi tiêu của khách hàng
-- SELECT từ 2 bảng: order, customer
-- ---------------------------------------------
CREATE FUNCTION fn_get_customer_total_spent(p_customer_id INT)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total_spent DECIMAL(15, 2);
    
    SELECT COALESCE(SUM(o.total_amount), 0)
    INTO v_total_spent
    FROM `Order` o
    INNER JOIN Customer c ON o.customer_id = c.customer_id
    WHERE o.customer_id = p_customer_id
      AND o.status != 'Cancelled';
    
    RETURN v_total_spent;
END$$

-- ---------------------------------------------
-- FUNCTION 3: Get Shop Revenue
-- Tính tổng doanh thu của shop
-- SELECT từ 3 bảng: order_item, order, shop
-- ---------------------------------------------
CREATE FUNCTION fn_get_shop_revenue(p_shop_id INT)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_revenue DECIMAL(15, 2);
    
    SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)
    INTO v_revenue
    FROM OrderItem oi
    INNER JOIN `Order` o ON oi.order_id = o.order_id
    INNER JOIN Shop s ON oi.shop_id = s.shop_id
    WHERE oi.shop_id = p_shop_id
      AND o.status != 'Cancelled';
    
    RETURN v_revenue;
END$$

-- ---------------------------------------------
-- FUNCTION 4: Calculate Shop Rating
-- Tính rating trung bình của shop từ reviews
-- SELECT từ 2 bảng: review, shop
-- ---------------------------------------------
CREATE FUNCTION fn_calculate_shop_rating(p_shop_id INT)
RETURNS DECIMAL(3, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_avg_rating DECIMAL(3, 2);
    
    SELECT COALESCE(AVG(r.rating), 0)
    INTO v_avg_rating
    FROM Review r
    INNER JOIN Shop s ON r.target_id = s.shop_id
    WHERE r.target_type = 'Shop'
      AND r.target_id = p_shop_id;
    
    RETURN v_avg_rating;
END$$

DELIMITER ;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Drop procedures if they exist
DROP PROCEDURE IF EXISTS sp_get_shop_revenue_report;
DROP PROCEDURE IF EXISTS sp_create_order_from_cart;
DROP PROCEDURE IF EXISTS sp_get_product_statistics;
DROP PROCEDURE IF EXISTS sp_apply_voucher;

DELIMITER $$

-- ---------------------------------------------
-- PROCEDURE 1: Get Shop Revenue Report
-- Lấy báo cáo doanh thu shop theo thời gian
-- Có IF check, WHERE, JOIN, GROUP BY
-- ---------------------------------------------
CREATE PROCEDURE sp_get_shop_revenue_report(
    IN p_shop_id INT,
    IN p_from_date DATE,
    IN p_to_date DATE
)
BEGIN
    -- Validate shop exists
    IF NOT EXISTS (SELECT 1 FROM Shop WHERE shop_id = p_shop_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Shop does not exist';
    END IF;
    
    -- Main revenue summary
    SELECT 
        s.shop_id,
        s.shop_name,
        COUNT(DISTINCT o.order_id) AS total_orders,
        COUNT(oi.order_item_id) AS total_items_sold,
        COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue,
        COALESCE(AVG(oi.quantity * oi.price_at_purchase), 0) AS avg_item_value,
        p_from_date AS from_date,
        p_to_date AS to_date
    FROM Shop s
    LEFT JOIN OrderItem oi ON s.shop_id = oi.shop_id
    LEFT JOIN `Order` o ON oi.order_id = o.order_id
        AND o.order_date BETWEEN p_from_date AND DATE_ADD(p_to_date, INTERVAL 1 DAY)
        AND o.status != 'Cancelled'
    WHERE s.shop_id = p_shop_id
    GROUP BY s.shop_id, s.shop_name;
    
    -- Top selling product items
    SELECT 
        p.product_name,
        pi.color,
        pi.type,
        COUNT(oi.order_item_id) AS times_ordered,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS item_revenue
    FROM Product p
    INNER JOIN ProductItem pi ON p.product_id = pi.product_id
    INNER JOIN OrderItem oi ON pi.item_id = oi.variantID
    INNER JOIN `Order` o ON oi.order_id = o.order_id
    WHERE pi.shop_id = p_shop_id
      AND o.order_date BETWEEN p_from_date AND DATE_ADD(p_to_date, INTERVAL 1 DAY)
      AND o.status != 'Cancelled'
    GROUP BY p.product_name, pi.color, pi.type
    ORDER BY item_revenue DESC
    LIMIT 10;
END$$

-- ---------------------------------------------
-- PROCEDURE 2: Create Order from Cart
-- Tạo đơn hàng từ giỏ hàng
-- Có CASE, IF, FK checks, INSERT, DELETE
-- ---------------------------------------------
CREATE PROCEDURE sp_create_order_from_cart(
    IN p_customer_id INT,
    IN p_shipping_id INT,
    IN p_voucher_id INT,
    IN p_shipping_address VARCHAR(255),
    IN p_payment_method VARCHAR(50),
    OUT p_order_id INT
)
BEGIN
    DECLARE v_subtotal DECIMAL(15, 2) DEFAULT 0;
    DECLARE v_shipping_fee DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_discount DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_total_amount DECIMAL(15, 2) DEFAULT 0;
    DECLARE v_cart_id INT;
    DECLARE v_cart_count INT DEFAULT 0;
    DECLARE v_discount_type VARCHAR(20);
    DECLARE v_discount_value DECIMAL(10, 2);
    DECLARE v_min_order_value DECIMAL(10, 2);
    DECLARE v_usage_limit INT;
    DECLARE v_used_count INT;
    
    -- Validate customer exists
    IF NOT EXISTS (SELECT 1 FROM Customer WHERE customer_id = p_customer_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Customer does not exist';
    END IF;
    
    -- Validate shipping method
    IF NOT EXISTS (SELECT 1 FROM Shipping WHERE shipping_id = p_shipping_id AND status = 'Active') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid or inactive shipping method';
    END IF;
    
    -- Get cart
    SELECT cart_id INTO v_cart_id
    FROM Cart
    WHERE customer_id = p_customer_id;
    
    IF v_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cart not found';
    END IF;
    
    -- Check cart has items
    SELECT COUNT(*) INTO v_cart_count
    FROM CartItem
    WHERE cart_id = v_cart_id;
    
    IF v_cart_count = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cart is empty';
    END IF;
    
    -- Calculate subtotal
    SELECT COALESCE(SUM(ci.quantity * pi.price), 0)
    INTO v_subtotal
    FROM CartItem ci
    INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
    WHERE ci.cart_id = v_cart_id;
    
    -- Get shipping fee
    SELECT fee INTO v_shipping_fee
    FROM Shipping
    WHERE shipping_id = p_shipping_id;
    
    -- Apply voucher if provided
    IF p_voucher_id IS NOT NULL THEN
        SELECT discount_type, discount_value, min_order_value, usage_limit, used_count
        INTO v_discount_type, v_discount_value, v_min_order_value, v_usage_limit, v_used_count
        FROM Voucher
        WHERE voucher_id = p_voucher_id
          AND status = 'Active'
          AND expired_date > CURDATE();
        
        IF v_discount_type IS NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Voucher is invalid or expired';
        END IF;
        
        IF v_subtotal < v_min_order_value THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Order value does not meet voucher minimum requirement';
        END IF;
        
        IF v_usage_limit > 0 AND v_used_count >= v_usage_limit THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Voucher usage limit reached';
        END IF;
        
        -- Calculate discount
        CASE v_discount_type
            WHEN 'Percentage' THEN
                SET v_discount = v_subtotal * (v_discount_value / 100);
            WHEN 'Amount' THEN
                SET v_discount = v_discount_value;
            ELSE
                SET v_discount = 0;
        END CASE;
        
        -- Update voucher usage
        UPDATE Voucher
        SET used_count = used_count + 1
        WHERE voucher_id = p_voucher_id;
    END IF;
    
    -- Calculate total
    SET v_total_amount = v_subtotal + v_shipping_fee - v_discount;
    
    IF v_total_amount < 0 THEN
        SET v_total_amount = 0;
    END IF;
    
    -- Create order
    INSERT INTO `Order` (
        customer_id, shipping_id, voucher_id, status,
        shipping_address, total_amount, payment_method
    ) VALUES (
        p_customer_id, p_shipping_id, p_voucher_id, 'Processing',
        p_shipping_address, v_total_amount, p_payment_method
    );
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Move cart items to order items
    INSERT INTO OrderItem (order_id, variantID, shop_id, quantity, price_at_purchase)
    SELECT 
        p_order_id,
        ci.item_id,
        pi.shop_id,
        ci.quantity,
        pi.price
    FROM CartItem ci
    INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
    WHERE ci.cart_id = v_cart_id;
    
    -- Clear cart
    DELETE FROM CartItem WHERE cart_id = v_cart_id;
    
    -- Update customer stats
    UPDATE Customer
    SET total_order = total_order + 1,
        total_spent = total_spent + v_total_amount
    WHERE customer_id = p_customer_id;
END$$

-- ---------------------------------------------
-- PROCEDURE 3: Get Product Statistics
-- Lấy thống kê sản phẩm với filters
-- Có WHERE, JOIN, GROUP BY
-- ---------------------------------------------
CREATE PROCEDURE sp_get_product_statistics(
    IN p_category_id INT,
    IN p_shop_id INT,
    IN p_min_price DECIMAL(10, 2),
    IN p_max_price DECIMAL(10, 2)
)
BEGIN
    SELECT 
        p.product_id,
        p.product_name,
        c.category_name,
        s.shop_name,
        COUNT(pi.item_id) AS variant_count,
        MIN(pi.price) AS min_price,
        MAX(pi.price) AS max_price,
        SUM(pi.stock) AS total_stock,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue,
        COUNT(DISTINCT r.review_id) AS review_count,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        p.status,
        p.created_at
    FROM Product p
    INNER JOIN Category c ON p.category_id = c.category_id
    INNER JOIN Shop s ON p.shop_id = s.shop_id
    LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
    LEFT JOIN OrderItem oi ON pi.item_id = oi.variantID
    LEFT JOIN `Order` o ON oi.order_id = o.order_id 
        AND o.status != 'Cancelled'
    LEFT JOIN Review r ON p.product_id = r.target_id 
        AND r.target_type = 'Product'
    WHERE 
        (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_shop_id IS NULL OR p.shop_id = p_shop_id)
        AND (p_min_price IS NULL OR pi.price >= p_min_price)
        AND (p_max_price IS NULL OR pi.price <= p_max_price)
    GROUP BY 
        p.product_id, p.product_name, c.category_name, s.shop_name,
        p.status, p.created_at
    ORDER BY total_revenue DESC;
END$$

-- ---------------------------------------------
-- PROCEDURE 4: Apply Voucher
-- Kiểm tra và áp dụng voucher
-- Có IF, CASE, validation
-- ---------------------------------------------
CREATE PROCEDURE sp_apply_voucher(
    IN p_voucher_code INT,
    IN p_order_amount DECIMAL(15, 2),
    OUT p_discount_amount DECIMAL(10, 2),
    OUT p_is_valid TINYINT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_voucher_id INT;
    DECLARE v_discount_type VARCHAR(20);
    DECLARE v_discount_value DECIMAL(10, 2);
    DECLARE v_min_order_value DECIMAL(10, 2);
    DECLARE v_usage_limit INT;
    DECLARE v_used_count INT;
    DECLARE v_expired_date TIMESTAMP;
    DECLARE v_status VARCHAR(20);
    
    SET p_is_valid = 0;
    SET p_discount_amount = 0;
    
    -- Get voucher details
    SELECT 
        voucher_id, discount_type, discount_value, min_order_value,
        usage_limit, used_count, expired_date, status
    INTO 
        v_voucher_id, v_discount_type, v_discount_value, v_min_order_value,
        v_usage_limit, v_used_count, v_expired_date, v_status
    FROM Voucher
    WHERE voucher_id = p_voucher_code;
    
    -- Check if voucher exists
    IF v_voucher_id IS NULL THEN
        SET p_message = 'Voucher code not found';
    -- Check if voucher is active
    ELSEIF v_status != 'Active' THEN
        SET p_message = 'Voucher is not active';
    -- Check if voucher is expired
    ELSEIF v_expired_date < CURDATE() THEN
        SET p_message = 'Voucher has expired';
    -- Check usage limit
    ELSEIF v_usage_limit > 0 AND v_used_count >= v_usage_limit THEN
        SET p_message = 'Voucher usage limit reached';
    -- Check minimum order value
    ELSEIF p_order_amount < v_min_order_value THEN
        SET p_message = CONCAT('Minimum order value is ', v_min_order_value);
    ELSE
        -- Calculate discount
        CASE v_discount_type
            WHEN 'Percentage' THEN
                SET p_discount_amount = p_order_amount * (v_discount_value / 100);
            WHEN 'Amount' THEN
                SET p_discount_amount = v_discount_value;
            ELSE
                SET p_discount_amount = 0;
        END CASE;
        
        -- Ensure discount doesn't exceed order amount
        IF p_discount_amount > p_order_amount THEN
            SET p_discount_amount = p_order_amount;
        END IF;
        
        SET p_is_valid = 1;
        SET p_message = 'Voucher applied successfully';
    END IF;
END$$

DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS trg_order_item_before_insert;
DROP TRIGGER IF EXISTS trg_order_item_after_insert;
DROP TRIGGER IF EXISTS trg_review_before_insert;
DROP TRIGGER IF EXISTS trg_review_after_insert;
DROP TRIGGER IF EXISTS trg_product_item_before_update;
DROP TRIGGER IF EXISTS trg_account_after_insert;

DELIMITER $$

-- ---------------------------------------------
-- TRIGGER 1: Order Item Before Insert
-- Set derived values: price_at_purchase, subtotal
-- Check stock availability
-- ---------------------------------------------
CREATE TRIGGER trg_order_item_before_insert
BEFORE INSERT ON OrderItem
FOR EACH ROW
BEGIN
    DECLARE v_item_price DECIMAL(10, 2);
    DECLARE v_item_stock INT;
    DECLARE v_shop_id INT;
    
    -- Get product item details
    SELECT price, stock, shop_id
    INTO v_item_price, v_item_stock, v_shop_id
    FROM ProductItem
    WHERE item_id = NEW.variantID;
    
    -- Validate item exists
    IF v_item_price IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Product item does not exist';
    END IF;
    
    -- Check stock availability
    IF v_item_stock < NEW.quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient stock for this product item';
    END IF;
    
    -- Set price at purchase if not provided
    IF NEW.price_at_purchase IS NULL OR NEW.price_at_purchase = 0 THEN
        SET NEW.price_at_purchase = v_item_price;
    END IF;
    
    -- Set shop_id if not provided
    IF NEW.shop_id IS NULL OR NEW.shop_id = 0 THEN
        SET NEW.shop_id = v_shop_id;
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 2: Order Item After Insert
-- Update product item stock
-- Update product status if out of stock
-- ---------------------------------------------
CREATE TRIGGER trg_order_item_after_insert
AFTER INSERT ON OrderItem
FOR EACH ROW
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_total_stock INT;
    
    -- Decrease product item stock
    UPDATE ProductItem
    SET stock = stock - NEW.quantity
    WHERE item_id = NEW.variantID;
    
    -- Get product_id and check total stock
    SELECT product_id INTO v_product_id
    FROM ProductItem
    WHERE item_id = NEW.variantID;
    
    SELECT SUM(stock) INTO v_total_stock
    FROM ProductItem
    WHERE product_id = v_product_id;
    
    -- Update product status if all variants are out of stock
    IF v_total_stock <= 0 THEN
        UPDATE Product
        SET status = 'Out of stock'
        WHERE product_id = v_product_id;
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 3: Review Before Insert
-- Validate review rating (1-5)
-- Check if customer can review (purchased product/shopped at shop)
-- ---------------------------------------------
CREATE TRIGGER trg_review_before_insert
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    -- Enforce rating between 1 and 5
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
    
    -- Validate based on target type
    IF NEW.target_type = 'Product' THEN
        -- Check if customer purchased this product
        IF NOT EXISTS (
            SELECT 1
            FROM OrderItem oi
            INNER JOIN `Order` o ON oi.order_id = o.order_id
            INNER JOIN ProductItem pi ON oi.variantID = pi.item_id
            WHERE pi.product_id = NEW.target_id
              AND o.customer_id = NEW.customer_id
              AND o.status = 'Delivered'
        ) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Can only review products from delivered orders';
        END IF;
    ELSEIF NEW.target_type = 'Shop' THEN
        -- Check if customer purchased from this shop
        IF NOT EXISTS (
            SELECT 1
            FROM OrderItem oi
            INNER JOIN `Order` o ON oi.order_id = o.order_id
            WHERE oi.shop_id = NEW.target_id
              AND o.customer_id = NEW.customer_id
              AND o.status = 'Delivered'
        ) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Can only review shops you have purchased from';
        END IF;
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 4: Review After Insert
-- Update shop rating or product rating
-- ---------------------------------------------
CREATE TRIGGER trg_review_after_insert
AFTER INSERT ON Review
FOR EACH ROW
BEGIN
    DECLARE v_avg_rating DECIMAL(3, 2);
    
    IF NEW.target_type = 'Shop' THEN
        -- Update shop rating
        SELECT AVG(rating) INTO v_avg_rating
        FROM Review
        WHERE target_type = 'Shop' AND target_id = NEW.target_id;
        
        UPDATE Shop
        SET rating = COALESCE(v_avg_rating, 0)
        WHERE shop_id = NEW.target_id;
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 5: Product Item Before Update
-- Prevent negative stock
-- Update product status based on stock
-- ---------------------------------------------
CREATE TRIGGER trg_product_item_before_update
BEFORE UPDATE ON ProductItem
FOR EACH ROW
BEGIN
    -- Prevent negative stock
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Product item stock cannot be negative';
    END IF;
    
    -- Prevent negative price
    IF NEW.price < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Product item price cannot be negative';
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 6: Account After Insert
-- Automatically create corresponding subclass record
-- (Customer cart, etc.)
-- ---------------------------------------------
CREATE TRIGGER trg_account_after_insert
AFTER INSERT ON Account
FOR EACH ROW
BEGIN
    -- If customer, create customer record and cart
    IF NEW.role = 'Customer' THEN
        INSERT INTO Customer (customer_id, account_id, address, add_phone, total_spent, total_order)
        VALUES (NEW.account_id, NEW.account_id, NULL, NULL, 0, 0);
        
        INSERT INTO Cart (customer_id)
        VALUES (NEW.account_id);
    
    -- If shop, create shop record
    ELSEIF NEW.role = 'Shop' THEN
        INSERT INTO Shop (shop_id, account_id, shop_name, shop_phone, address_shop, rating, shop_status)
        VALUES (NEW.account_id, NEW.account_id, CONCAT('Shop ', NEW.account_id), NULL, NULL, 0, 'Open');
    
    -- If admin, create admin record
    ELSEIF NEW.role = 'Admin' THEN
        INSERT INTO Admin (admin_id, account_id, role, note)
        VALUES (NEW.account_id, NEW.account_id, 'Support', NULL);
    END IF;
END$$

DELIMITER ;

-- =============================================
-- TEST QUERIES
-- =============================================

-- Test Function 1: Calculate Order Total
SELECT 
    order_id,
    fn_calculate_order_total(order_id) AS calculated_total,
    total_amount
FROM `Order`
LIMIT 5;

-- Test Function 2: Get Customer Total Spent
SELECT 
    c.customer_id,
    a.full_name,
    fn_get_customer_total_spent(c.customer_id) AS calculated_spent,
    c.total_spent
FROM Customer c
INNER JOIN Account a ON c.account_id = a.account_id
LIMIT 5;

-- Test Function 3: Get Shop Revenue
SELECT 
    s.shop_id,
    s.shop_name,
    fn_get_shop_revenue(s.shop_id) AS total_revenue
FROM Shop s
ORDER BY fn_get_shop_revenue(s.shop_id) DESC;

-- Test Function 4: Calculate Shop Rating
SELECT 
    s.shop_id,
    s.shop_name,
    fn_calculate_shop_rating(s.shop_id) AS calculated_rating,
    s.rating AS stored_rating
FROM Shop s;

-- Test Procedure 1: Get Shop Revenue Report
CALL sp_get_shop_revenue_report(1, '2025-01-01', '2025-12-31');

-- Test Procedure 3: Get Product Statistics
CALL sp_get_product_statistics(NULL, NULL, NULL, NULL);

-- Test Procedure 4: Apply Voucher
CALL sp_apply_voucher(1, 600000, @discount, @valid, @message);
SELECT @discount AS discount_amount, @valid AS is_valid, @message AS message;

-- =============================================
-- End of Functions, Procedures, and Triggers Script
-- =============================================
