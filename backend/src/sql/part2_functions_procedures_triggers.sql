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
DROP PROCEDURE IF EXISTS sp_get_category_hierarchy;
DROP PROCEDURE IF EXISTS sp_get_category_all_children;
DROP PROCEDURE IF EXISTS sp_get_category_all_parents;

DELIMITER $$

-- ---------------------------------------------
-- FUNCTION 1: Calculate Order Total
-- Tính tổng giá trị đơn hàng = subtotal + shipping_fee - discount
-- SELECT từ 4 bảng: order_item, order, shipping, voucher
-- ---------------------------------------------
CREATE FUNCTION fn_calculate_order_total(p_order_id INT)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_subtotal DECIMAL(15, 2);
    DECLARE v_shipping_fee DECIMAL(10, 2);
    DECLARE v_discount DECIMAL(10, 2);
    DECLARE v_discount_type VARCHAR(20);
    DECLARE v_discount_value DECIMAL(10, 2);
    DECLARE v_min_order_value DECIMAL(10, 2);
    DECLARE v_total DECIMAL(15, 2);
    
    -- Calculate subtotal from order items
    SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)
    INTO v_subtotal 
    FROM OrderItem oi
    WHERE oi.order_id = p_order_id;
    
    -- Get shipping fee
    SELECT COALESCE(sh.fee, 0)
    INTO v_shipping_fee
    FROM `Order` o
    LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
    WHERE o.order_id = p_order_id;
    
    -- Get voucher discount with min_order_value check
    SELECT v.discount_type, COALESCE(v.discount_value, 0), COALESCE(v.min_order_value, 0)
    INTO v_discount_type, v_discount_value, v_min_order_value
    FROM `Order` o
    LEFT JOIN Voucher v ON o.voucher_id = v.voucher_id
    WHERE o.order_id = p_order_id;
    
    -- Calculate discount amount (only if subtotal meets minimum requirement)
    SET v_discount = 0;
    IF v_discount_type IS NOT NULL AND v_subtotal >= v_min_order_value THEN
        IF v_discount_type = 'Percentage' THEN
            SET v_discount = v_subtotal * (v_discount_value / 100);
        ELSEIF v_discount_type = 'Amount' THEN
            SET v_discount = v_discount_value;
        END IF;
    END IF;
    
    -- Calculate total = subtotal + shipping - discount
    SET v_total = v_subtotal + v_shipping_fee - v_discount;
    
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
    
    SELECT COALESCE(SUM(fn_calculate_order_total(o.order_id)), 0)
    INTO v_total_spent
    FROM `Order` o
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
    DECLARE v_subtotal DECIMAL(15, 2);
    DECLARE v_discount_total DECIMAL(15, 2);
    
    -- Tính tổng doanh thu shop (OrderItem + Shipping - Voucher discount)
    -- Chỉ tính các đơn hàng không bị cancelled
    
    -- Tính subtotal từ OrderItem
    SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)
    INTO v_subtotal
    FROM OrderItem oi
    INNER JOIN `Order` o ON oi.order_id = o.order_id
    WHERE oi.shop_id = p_shop_id AND o.status != 'Cancelled';
    
    -- Tính voucher discount (chỉ áp dụng nếu đủ min_order_value)
    SELECT COALESCE(SUM(
        CASE 
            WHEN v.discount_type = 'Percentage' AND v_subtotal >= COALESCE(v.min_order_value, 0) 
                 THEN v_subtotal * v.discount_value / 100
            WHEN v.discount_type = 'Amount' AND v_subtotal >= COALESCE(v.min_order_value, 0)
                 THEN v.discount_value
            ELSE 0
        END
    ), 0)
    INTO v_discount_total
    FROM `Order` o
    LEFT JOIN Voucher v ON o.voucher_id = v.voucher_id
    WHERE o.order_id IN (
        SELECT DISTINCT oi.order_id 
        FROM OrderItem oi 
        WHERE oi.shop_id = p_shop_id
    )
    AND o.status != 'Cancelled';
    
    SET v_revenue = v_subtotal - v_discount_total;
    
    IF v_revenue < 0 THEN
        SET v_revenue = 0;
    END IF;
    
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

-- ---------------------------------------------
-- FUNCTION 5: Calculate Product Rating
-- Tính rating trung bình của product từ reviews
-- SELECT từ 2 bảng: review, product
-- ---------------------------------------------
CREATE FUNCTION fn_calculate_product_rating(p_product_id INT)
RETURNS DECIMAL(3, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_avg_rating DECIMAL(3, 2);
    
    SELECT COALESCE(AVG(r.rating), 0)
    INTO v_avg_rating
    FROM Review r
    WHERE r.target_type = 'Product'
      AND r.target_id = p_product_id;
    
    RETURN v_avg_rating;
END$$

-- ---------------------------------------------
-- FUNCTION 6: Get Order Total Items with Cursor & Loop
-- Tính tổng số lượng items trong 1 order bằng CURSOR + LOOP
-- Dùng cursor để lặp qua từng OrderItem
-- SELECT từ 2 bảng: order_item, order
-- ---------------------------------------------
CREATE FUNCTION fn_get_order_total_items_with_cursor(p_order_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total_items INT DEFAULT 0;
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_item_quantity INT;
    
    -- Declare cursor for OrderItems
    DECLARE order_items_cursor CURSOR FOR
        SELECT quantity
        FROM OrderItem
        WHERE order_id = p_order_id;
    
    -- Declare continue handler for cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    -- Validate order exists
    IF NOT EXISTS (SELECT 1 FROM `Order` WHERE order_id = p_order_id) THEN
        RETURN 0;
    END IF;
    
    -- Open cursor
    OPEN order_items_cursor;
    
    -- Loop through each item
    item_loop: LOOP
        FETCH order_items_cursor INTO v_item_quantity;
        
        IF v_done THEN
            LEAVE item_loop;
        END IF;
        
        SET v_total_items = v_total_items + v_item_quantity;
    END LOOP item_loop;
    
    -- Close cursor
    CLOSE order_items_cursor;
    
    RETURN v_total_items;
END$$

DELIMITER ;

-- =============================================
-- RECURSION PROCEDURES FOR CATEGORY HIERARCHY
-- =============================================

DELIMITER $$

-- ---------------------------------------------
-- PROCEDURE: Get Category Hierarchy (All Parents & Children)
-- Hiển thị toàn bộ hierarchy từ parent xuống child
-- Dùng WITH RECURSIVE để lấy tất cả cấp độ
-- Ví dụ: Electronics → Phones (Electronics là cha của Phones)
-- ---------------------------------------------
CREATE PROCEDURE sp_get_category_hierarchy()
BEGIN
    WITH RECURSIVE category_tree AS (
        -- Anchor: Lấy tất cả danh mục root (parent_category_id IS NULL)
        SELECT 
            category_id,
            category_name,
            parent_category_id,
            0 AS level,
            CAST(category_name AS CHAR(500)) AS path
        FROM Category
        WHERE parent_category_id IS NULL
        
        UNION ALL
        
        -- Recursive: Lấy tất cả danh mục con
        SELECT 
            c.category_id,
            c.category_name,
            c.parent_category_id,
            ct.level + 1,
            CONCAT(ct.path, ' → ', c.category_name)
        FROM Category c
        INNER JOIN category_tree ct ON c.parent_category_id = ct.category_id
        WHERE ct.level < 10  -- Tránh infinite loop, giới hạn 10 cấp độ
    )
    SELECT 
        category_id,
        category_name,
        parent_category_id,
        level,
        path,
        REPEAT('  ', level) AS indent
    FROM category_tree
    ORDER BY path;
END$$

-- ---------------------------------------------
-- PROCEDURE: Get All Children of a Category (Recursion)
-- Lấy tất cả danh mục con của 1 danh mục
-- Ví dụ: Nhập Electronics → ra Phones, Laptops, ...
-- Dùng recursion để lấy con, cháu, chắu, ...
-- ---------------------------------------------
CREATE PROCEDURE sp_get_category_all_children(IN p_category_id INT)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Category WHERE category_id = p_category_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Category does not exist';
    END IF;
    
    WITH RECURSIVE children_tree AS (
        -- Anchor: Lấy danh mục gốc
        SELECT 
            category_id,
            category_name,
            parent_category_id,
            0 AS level
        FROM Category
        WHERE category_id = p_category_id
        
        UNION ALL
        
        -- Recursive: Lấy tất cả danh mục con cấp dưới
        SELECT 
            c.category_id,
            c.category_name,
            c.parent_category_id,
            ct.level + 1
        FROM Category c
        INNER JOIN children_tree ct ON c.parent_category_id = ct.category_id
        WHERE ct.level < 10
    )
    SELECT 
        category_id,
        category_name,
        parent_category_id,
        level,
        REPEAT('  ', level) AS indent
    FROM children_tree
    ORDER BY level, category_name;
END$$

-- ---------------------------------------------
-- PROCEDURE: Get All Parents of a Category (Reverse Recursion)
-- Lấy tất cả danh mục cha của 1 danh mục
-- Ví dụ: Nhập Phones → ra Electronics (cha) → NULL (root)
-- Dùng recursion ngược để lấy cha, ông, tổ, ...
-- ---------------------------------------------
CREATE PROCEDURE sp_get_category_all_parents(IN p_category_id INT)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Category WHERE category_id = p_category_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Category does not exist';
    END IF;
    
    WITH RECURSIVE parents_tree AS (
        -- Anchor: Lấy danh mục gốc
        SELECT 
            category_id,
            category_name,
            parent_category_id,
            0 AS level
        FROM Category
        WHERE category_id = p_category_id
        
        UNION ALL
        
        -- Recursive: Lấy tất cả danh mục cha cấp trên
        SELECT 
            c.category_id,
            c.category_name,
            c.parent_category_id,
            pt.level + 1
        FROM Category c
        INNER JOIN parents_tree pt ON pt.parent_category_id = c.category_id
        WHERE pt.level < 10
    )
    SELECT 
        category_id,
        category_name,
        parent_category_id,
        level,
        REPEAT('  ', level) AS indent
    FROM parents_tree
    ORDER BY level DESC, category_name;
END$$

DELIMITER ;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Drop procedures if they exist
DROP PROCEDURE IF EXISTS sp_get_shop_revenue_report;
DROP PROCEDURE IF EXISTS sp_create_order_from_cart;
DROP PROCEDURE IF EXISTS sp_apply_voucher;
DROP PROCEDURE IF EXISTS sp_get_product_list;

DELIMITER $$

-- ---------------------------------------------
-- PROCEDURE: Get Product List with Filters
-- Lấy danh sách sản phẩm với filter, search, sort, pagination
-- > 2 bảng: Product, Shop, Category, ProductItem, Review
-- Aggregate: MIN, MAX, SUM, COUNT, AVG
-- GROUP BY, HAVING, ORDER BY
-- ---------------------------------------------
CREATE PROCEDURE sp_get_product_list(
    IN p_search VARCHAR(255),
    IN p_category_id INT,
    IN p_shop_id INT,
    IN p_min_price DECIMAL(15,2),
    IN p_max_price DECIMAL(15,2),
    IN p_status VARCHAR(50),
    IN p_sort_by VARCHAR(50),
    IN p_sort_order VARCHAR(10),
    IN p_page INT,
    IN p_limit INT,
    OUT p_total_count INT
)
BEGIN
    DECLARE v_offset INT;
    DECLARE v_order_clause VARCHAR(100);
    
    SET v_offset = (p_page - 1) * p_limit;
    
    -- Determine sort order
    SET v_order_clause = CASE p_sort_by
        WHEN 'price' THEN CONCAT('min_price ', COALESCE(p_sort_order, 'ASC'))
        WHEN 'rating' THEN CONCAT('avg_rating ', COALESCE(p_sort_order, 'DESC'))
        WHEN 'created_at' THEN CONCAT('p.created_at ', COALESCE(p_sort_order, 'DESC'))
        ELSE 'p.created_at DESC'
    END;
    
    -- Get total count first
    SELECT COUNT(DISTINCT p.product_id) INTO p_total_count
    FROM Product p
    INNER JOIN Shop s ON p.shop_id = s.shop_id
    INNER JOIN Category c ON p.category_id = c.category_id
    LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
    WHERE 1=1
        AND (p_search IS NULL OR p.product_name LIKE CONCAT('%', p_search, '%') OR p.description LIKE CONCAT('%', p_search, '%'))
        AND (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_shop_id IS NULL OR p.shop_id = p_shop_id)
        AND (p_status IS NULL OR p.status = p_status);
    
    -- Main query with filters and aggregations
    SET @sql = CONCAT('
        SELECT 
            p.product_id,
            p.product_name,
            p.description,
            p.image,
            p.status,
            p.created_at,
            p.shop_id,
            s.shop_name,
            s.rating as shop_rating,
            c.category_id,
            c.category_name,
            MIN(pi.price) as min_price,
            MAX(pi.price) as max_price,
            SUM(pi.stock) as total_stock,
            COUNT(DISTINCT pi.item_id) as variant_count,
            COALESCE((
                SELECT AVG(r.rating)
                FROM Review r
                WHERE r.target_id = p.product_id AND r.target_type = "Product"
            ), 0) as avg_rating,
            COALESCE((
                SELECT COUNT(*)
                FROM Review r
                WHERE r.target_id = p.product_id AND r.target_type = "Product"
            ), 0) as review_count
        FROM Product p
        INNER JOIN Shop s ON p.shop_id = s.shop_id
        INNER JOIN Category c ON p.category_id = c.category_id
        LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
        WHERE 1=1',
        CASE WHEN p_search IS NOT NULL THEN 
            CONCAT(' AND (p.product_name LIKE "%', p_search, '%" OR p.description LIKE "%', p_search, '%")')
        ELSE '' END,
        CASE WHEN p_category_id IS NOT NULL THEN CONCAT(' AND p.category_id = ', p_category_id) ELSE '' END,
        CASE WHEN p_shop_id IS NOT NULL THEN CONCAT(' AND p.shop_id = ', p_shop_id) ELSE '' END,
        CASE WHEN p_status IS NOT NULL THEN CONCAT(' AND p.status = "', p_status, '"') ELSE '' END,
        ' GROUP BY p.product_id, p.product_name, p.description, p.image, p.status, 
                   p.created_at, p.shop_id, s.shop_name, s.rating, c.category_id, c.category_name',
        CASE WHEN p_min_price IS NOT NULL THEN CONCAT(' HAVING min_price >= ', p_min_price) ELSE '' END,
        CASE WHEN p_max_price IS NOT NULL THEN 
            CONCAT(CASE WHEN p_min_price IS NOT NULL THEN ' AND' ELSE ' HAVING' END, ' max_price <= ', p_max_price)
        ELSE '' END,
        ' ORDER BY ', v_order_clause,
        ' LIMIT ', p_limit, ' OFFSET ', v_offset
    );
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

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
    WHERE s.shop_id = p_shop_id
      AND (o.order_id IS NULL OR o.status != 'Cancelled')
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
    INNER JOIN OrderItem oi ON pi.item_id = oi.item_id
    INNER JOIN `Order` o ON oi.order_id = o.order_id
        AND o.status != 'Cancelled'
        AND o.order_date BETWEEN p_from_date AND DATE_ADD(p_to_date, INTERVAL 1 DAY)
    WHERE pi.shop_id = p_shop_id
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
    IN p_note TEXT,
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
        shipping_address, total_amount, payment_method, note
    ) VALUES (
        p_customer_id, p_shipping_id, p_voucher_id, 'Processing',
        p_shipping_address, v_total_amount, p_payment_method, p_note
    );
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Move cart items to order items (WITHOUT trigger to avoid conflict)
    -- Store cart items in temporary table first
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_cart_items (
        item_id INT,
        shop_id INT,
        quantity INT,
        price DECIMAL(10, 2)
    );
    
    INSERT INTO temp_cart_items (item_id, shop_id, quantity, price)
    SELECT ci.item_id, pi.shop_id, ci.quantity, pi.price
    FROM CartItem ci
    INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
    WHERE ci.cart_id = v_cart_id;
    
    -- Insert into OrderItem from temp table
    INSERT INTO OrderItem (order_id, item_id, shop_id, quantity, price_at_purchase)
    SELECT p_order_id, item_id, shop_id, quantity, price
    FROM temp_cart_items;
    
    -- Update stock manually (instead of trigger)
    UPDATE ProductItem pi
    INNER JOIN temp_cart_items tci ON pi.item_id = tci.item_id
    SET pi.stock = pi.stock - tci.quantity;
    
    -- Drop temp table
    DROP TEMPORARY TABLE IF EXISTS temp_cart_items;
    
    -- Clear cart
    DELETE FROM CartItem WHERE cart_id = v_cart_id;
    
    -- Update customer stats
    UPDATE Customer
    SET total_order = total_order + 1,
        total_spent = total_spent + v_total_amount
    WHERE customer_id = p_customer_id;
END$$

-- ---------------------------------------------
-- PROCEDURE 3: Apply Voucher
-- Kiểm tra và áp dụng voucher
-- Có IF, CASE, validation
-- ---------------------------------------------
CREATE PROCEDURE sp_apply_voucher(
    IN p_voucher_code VARCHAR(50),
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
    
    -- Get voucher details by code
    SELECT 
        voucher_id, discount_type, discount_value, min_order_value,
        usage_limit, used_count, expired_date, status
    INTO 
        v_voucher_id, v_discount_type, v_discount_value, v_min_order_value,
        v_usage_limit, v_used_count, v_expired_date, v_status
    FROM Voucher
    WHERE code = p_voucher_code;
    
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
DROP TRIGGER IF EXISTS trg_customer_before_insert;
DROP TRIGGER IF EXISTS trg_shop_before_insert;
DROP TRIGGER IF EXISTS trg_order_after_update;

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
    WHERE item_id = NEW.item_id;
    
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
    WHERE item_id = NEW.item_id;
    
    -- Get product_id and check total stock
    SELECT product_id INTO v_product_id
    FROM ProductItem
    WHERE item_id = NEW.item_id;
    
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
            INNER JOIN ProductItem pi ON oi.item_id = pi.item_id
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
    
    ELSEIF NEW.target_type = 'Product' THEN
        -- Update product rating
        SELECT AVG(rating) INTO v_avg_rating
        FROM Review
        WHERE target_type = 'Product' AND target_id = NEW.target_id;
        
        UPDATE Product
        SET rating = COALESCE(v_avg_rating, 0)
        WHERE product_id = NEW.target_id;
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
        INSERT INTO Customer (customer_id, address, add_phone, total_spent, total_order)
        VALUES (NEW.account_id, NULL, NULL, 0, 0);
        
        INSERT INTO Cart (customer_id)
        VALUES (NEW.account_id);
    
    -- If shop, create shop record
    ELSEIF NEW.role = 'Shop' THEN
        INSERT INTO Shop (shop_id, shop_name, shop_phone, address_shop, rating)
        VALUES (NEW.account_id, CONCAT('Shop ', NEW.account_id), NULL, NULL, 0);
    
    -- If admin, create admin record
    ELSEIF NEW.role = 'Admin' THEN
        INSERT INTO Admin (admin_id, role, note)
        VALUES (NEW.account_id, 'Support', NULL);
    END IF;
END$$

-- ---------------------------------------------
-- TRIGGER 7: Customer Before Insert
-- Auto-generate customer_code with CUST prefix (CUST00001, CUST00002, ...)
-- Row-based constraint: links customer_code with customer_id
-- ---------------------------------------------
CREATE TRIGGER trg_customer_before_insert
BEFORE INSERT ON Customer
FOR EACH ROW
BEGIN
    -- Generate customer_code from customer_id
    SET NEW.customer_code = CONCAT('CUST', LPAD(NEW.customer_id, 5, '0'));
END$$

-- ---------------------------------------------
-- TRIGGER 8: Shop Before Insert
-- Auto-generate shop_code with SHOP prefix (SHOP00001, SHOP00002, ...)
-- Row-based constraint: links shop_code with shop_id
-- ---------------------------------------------
CREATE TRIGGER trg_shop_before_insert
BEFORE INSERT ON Shop
FOR EACH ROW
BEGIN
    -- Generate shop_code from shop_id
    SET NEW.shop_code = CONCAT('SHOP', LPAD(NEW.shop_id, 5, '0'));
END$$

-- ---------------------------------------------
-- TRIGGER 9: Order After Update
-- Restore stock when order is cancelled
-- Update product status back to Active if stock available
-- ---------------------------------------------
CREATE TRIGGER trg_order_after_update
AFTER UPDATE ON `Order`
FOR EACH ROW
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_total_stock INT;
    
    -- If order status changed from non-Cancelled to Cancelled, restore stock
    IF OLD.status != 'Cancelled' AND NEW.status = 'Cancelled' THEN
        -- Create a cursor to iterate through order items
        BEGIN
            DECLARE done INT DEFAULT FALSE;
            DECLARE v_item_id INT;
            DECLARE v_quantity INT;
            
            DECLARE item_cursor CURSOR FOR
                SELECT item_id, quantity
                FROM OrderItem
                WHERE order_id = NEW.order_id;
            
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
            
            OPEN item_cursor;
            
            restore_loop: LOOP
                FETCH item_cursor INTO v_item_id, v_quantity;
                IF done THEN
                    LEAVE restore_loop;
                END IF;
                
                -- Restore stock for this item
                UPDATE ProductItem
                SET stock = stock + v_quantity
                WHERE item_id = v_item_id;
                
                -- Get product_id
                SELECT product_id INTO v_product_id
                FROM ProductItem
                WHERE item_id = v_item_id;
                
                -- Check total stock for this product
                SELECT SUM(stock) INTO v_total_stock
                FROM ProductItem
                WHERE product_id = v_product_id;
                
                -- Update product status back to Active if stock is available
                IF v_total_stock > 0 THEN
                    UPDATE Product
                    SET status = 'Active'
                    WHERE product_id = v_product_id AND status = 'Out of stock';
                END IF;
            END LOOP;
            
            CLOSE item_cursor;
        END;
    END IF;
END$$

-- =============================================
-- CRUD PROCEDURES (Add/Update/Delete)
-- =============================================

-- ==== PRODUCT CRUD ====

-- sp_add_product: INSERT new product
-- Returns: product_id if success, -1 if error
CREATE PROCEDURE sp_add_product(
    IN p_shop_id INT,
    IN p_category_id INT,
    IN p_product_name VARCHAR(255),
    IN p_description TEXT,
    IN p_image VARCHAR(255),
    OUT p_product_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_product_id = -1;
        SET p_status = 'Error: Invalid shop or category ID';
    END;
    
    SET p_product_id = -1;
    SET p_status = 'Error';
    
    -- Validate shop exists
    IF NOT EXISTS (SELECT 1 FROM Shop WHERE shop_id = p_shop_id) THEN
        SET p_status = 'Error: Shop not found';
    ELSEIF NOT EXISTS (SELECT 1 FROM Category WHERE category_id = p_category_id) THEN
        SET p_status = 'Error: Category not found';
    ELSE
        -- Insert product
        INSERT INTO Product (shop_id, category_id, product_name, description, image, status)
        VALUES (p_shop_id, p_category_id, p_product_name, p_description, p_image, 'In stock');
        
        SET p_product_id = LAST_INSERT_ID();
        SET p_status = 'Success';
    END IF;
END$$

-- sp_update_product: UPDATE product info
CREATE PROCEDURE sp_update_product(
    IN p_product_id INT,
    IN p_product_name VARCHAR(255),
    IN p_description TEXT,
    IN p_image VARCHAR(255),
    IN p_status VARCHAR(50),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_success = FALSE;
        SET p_message = 'Error: Database error';
    END;
    
    IF NOT EXISTS (SELECT 1 FROM Product WHERE product_id = p_product_id) THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Product not found';
    ELSE
        UPDATE Product
        SET product_name = COALESCE(p_product_name, product_name),
            description = COALESCE(p_description, description),
            image = COALESCE(p_image, image),
            status = COALESCE(p_status, status)
        WHERE product_id = p_product_id;
        
        SET p_success = TRUE;
        SET p_message = 'Product updated successfully';
    END IF;
END$$

-- sp_delete_product: DELETE product and all related items
CREATE PROCEDURE sp_delete_product(
    IN p_product_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE v_affected_items INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_success = FALSE;
        SET p_message = 'Error: Database error';
    END;
    
    IF NOT EXISTS (SELECT 1 FROM Product WHERE product_id = p_product_id) THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Product not found';
    ELSE
        -- Get count of affected items
        SELECT COUNT(*) INTO v_affected_items FROM ProductItem WHERE product_id = p_product_id;
        
        -- Delete product (CASCADE deletes ProductItems)
        DELETE FROM Product WHERE product_id = p_product_id;
        
        SET p_success = TRUE;
        SET p_message = CONCAT('Product deleted. Removed ', v_affected_items, ' variant(s)');
    END IF;
END$$

-- ==== PRODUCT ITEM (VARIANT) CRUD ====

-- sp_add_product_item: INSERT product variant
CREATE PROCEDURE sp_add_product_item(
    IN p_product_id INT,
    IN p_shop_id INT,
    IN p_color VARCHAR(50),
    IN p_type VARCHAR(50),
    IN p_price DECIMAL(15,2),
    IN p_stock INT,
    IN p_image_url VARCHAR(255),
    OUT p_item_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_item_id = -1;
        SET p_status = 'Error: Invalid input';
    END;
    
    SET p_item_id = -1;
    SET p_status = 'Error';
    
    IF NOT EXISTS (SELECT 1 FROM Product WHERE product_id = p_product_id) THEN
        SET p_status = 'Error: Product not found';
    ELSEIF p_price <= 0 THEN
        SET p_status = 'Error: Price must be > 0';
    ELSEIF p_stock < 0 THEN
        SET p_status = 'Error: Stock cannot be negative';
    ELSE
        INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock, image_url)
        VALUES (p_product_id, p_shop_id, p_color, p_type, p_price, p_stock, p_image_url);
        
        SET p_item_id = LAST_INSERT_ID();
        SET p_status = 'Success';
    END IF;
END$$

-- sp_update_product_item: UPDATE variant
CREATE PROCEDURE sp_update_product_item(
    IN p_item_id INT,
    IN p_price DECIMAL(15,2),
    IN p_stock INT,
    IN p_image_url VARCHAR(255),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_success = FALSE;
        SET p_message = 'Error: Database error';
    END;
    
    IF NOT EXISTS (SELECT 1 FROM ProductItem WHERE item_id = p_item_id) THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Item not found';
    ELSEIF p_price IS NOT NULL AND p_price <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Price must be > 0';
    ELSEIF p_stock IS NOT NULL AND p_stock < 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Stock cannot be negative';
    ELSE
        UPDATE ProductItem
        SET price = COALESCE(p_price, price),
            stock = COALESCE(p_stock, stock),
            image_url = COALESCE(p_image_url, image_url)
        WHERE item_id = p_item_id;
        
        SET p_success = TRUE;
        SET p_message = 'Item updated successfully';
    END IF;
END$$

-- sp_delete_product_item: DELETE variant
CREATE PROCEDURE sp_delete_product_item(
    IN p_item_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_success = FALSE;
        SET p_message = 'Error: Database error';
    END;
    
    IF NOT EXISTS (SELECT 1 FROM ProductItem WHERE item_id = p_item_id) THEN
        SET p_success = FALSE;
        SET p_message = 'Error: Item not found';
    ELSE
        DELETE FROM ProductItem WHERE item_id = p_item_id;
        
        SET p_success = TRUE;
        SET p_message = 'Item deleted successfully';
    END IF;
END$$