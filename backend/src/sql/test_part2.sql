-- =============================================
-- PART 2: TEST QUERIES
-- Để verify Functions, Procedures, Triggers hoạt động đúng
-- =============================================

USE ecommerce_db;

-- =============================================
-- TEST FUNCTIONS
-- =============================================

SELECT '========================================' AS header;
SELECT 'TESTING FUNCTIONS' AS header;
SELECT '========================================' AS header;

-- TEST 1: fn_calculate_order_total
SELECT '' AS space;
SELECT '✅ TEST FUNCTION 1: fn_calculate_order_total' AS test_name;
SELECT 
    o.order_id,
    o.customer_id,
    fn_calculate_order_total(o.order_id) AS calculated_total,
    o.total_amount AS stored_total,
    CASE 
        WHEN ABS(fn_calculate_order_total(o.order_id) - o.total_amount) < 0.01 
        THEN '✅ MATCH' 
        ELSE '❌ MISMATCH' 
    END AS validation_status
FROM `Order` o
LIMIT 5;

-- TEST 2: fn_get_customer_total_spent
SELECT '' AS space;
SELECT '✅ TEST FUNCTION 2: fn_get_customer_total_spent' AS test_name;
SELECT 
    c.customer_id,
    a.full_name,
    fn_get_customer_total_spent(c.customer_id) AS calculated_spent,
    c.total_spent AS stored_spent,
    CASE 
        WHEN ABS(fn_get_customer_total_spent(c.customer_id) - c.total_spent) < 0.01 
        THEN '✅ MATCH' 
        ELSE '❌ MISMATCH' 
    END AS validation_status
FROM Customer c
INNER JOIN Account a ON c.account_id = a.account_id
LIMIT 5;

-- TEST 3: fn_get_shop_revenue
SELECT '' AS space;
SELECT '✅ TEST FUNCTION 3: fn_get_shop_revenue' AS test_name;
SELECT 
    s.shop_id,
    s.shop_name,
    fn_get_shop_revenue(s.shop_id) AS total_revenue,
    CONCAT('$', FORMAT(fn_get_shop_revenue(s.shop_id), 2)) AS formatted_revenue
FROM Shop s
ORDER BY fn_get_shop_revenue(s.shop_id) DESC;

-- TEST 4: fn_calculate_shop_rating
SELECT '' AS space;
SELECT '✅ TEST FUNCTION 4: fn_calculate_shop_rating' AS test_name;
SELECT 
    s.shop_id,
    s.shop_name,
    fn_calculate_shop_rating(s.shop_id) AS calculated_rating,
    s.rating AS stored_rating,
    CASE 
        WHEN ABS(fn_calculate_shop_rating(s.shop_id) - s.rating) < 0.01 
        THEN '✅ MATCH' 
        ELSE '⚠️ DIFFERENT' 
    END AS validation_status
FROM Shop s;

-- =============================================
-- TEST PROCEDURES
-- =============================================

SELECT '' AS space;
SELECT '========================================' AS header;
SELECT 'TESTING PROCEDURES' AS header;
SELECT '========================================' AS header;

-- TEST 5: sp_get_shop_revenue_report
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 1: sp_get_shop_revenue_report' AS test_name;
SELECT 'Parameters: shop_id=1, from_date=2025-01-01, to_date=2025-12-31' AS note;
CALL sp_get_shop_revenue_report(1, '2025-01-01', '2025-12-31');

-- TEST 6: sp_get_product_statistics (all products)
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 3: sp_get_product_statistics (no filters)' AS test_name;
CALL sp_get_product_statistics(NULL, NULL, NULL, NULL);

-- TEST 7: sp_get_product_statistics (with filters)
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 3: sp_get_product_statistics (shop_id=1, price 10000-100000)' AS test_name;
CALL sp_get_product_statistics(NULL, 1, 10000, 100000);

-- TEST 8: sp_apply_voucher (valid voucher)
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 4: sp_apply_voucher (valid)' AS test_name;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher(1, 500000, @discount, @valid, @msg);
SELECT 
    @discount AS discount_amount, 
    @valid AS is_valid, 
    @msg AS message;

-- TEST 9: sp_apply_voucher (order too small)
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 4: sp_apply_voucher (order too small)' AS test_name;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher(1, 50000, @discount, @valid, @msg);
SELECT 
    @discount AS discount_amount, 
    @valid AS is_valid, 
    @msg AS message;

-- TEST 10: sp_create_order_from_cart
SELECT '' AS space;
SELECT '✅ TEST PROCEDURE 2: sp_create_order_from_cart' AS test_name;
SELECT '⚠️ WARNING: This will modify database (create order, clear cart)' AS warning;
SELECT 'Comment out if you dont want to test it' AS note;
/*
-- First, add some items to cart
INSERT INTO CartItem (cart_id, item_id, quantity) 
VALUES (1, 1, 2);

-- Then create order
CALL sp_create_order_from_cart(1, 1, NULL, '123 Test Street', 'Credit Card', @new_order_id);
SELECT @new_order_id AS new_order_id;

-- Verify order was created
SELECT * FROM `Order` WHERE order_id = @new_order_id;
SELECT * FROM OrderItem WHERE order_id = @new_order_id;
*/

-- =============================================
-- TEST TRIGGERS
-- =============================================

SELECT '' AS space;
SELECT '========================================' AS header;
SELECT 'TESTING TRIGGERS' AS header;
SELECT '========================================' AS header;

-- TEST 11: trg_order_item_before_insert (DERIVED VALUE)
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 1: trg_order_item_before_insert' AS test_name;
SELECT 'Testing: price_at_purchase and shop_id auto-fill' AS description;
SELECT '⚠️ This test will INSERT data - comment out if not testing' AS warning;
/*
-- Get current price of item #1
SELECT item_id, price, shop_id FROM ProductItem WHERE item_id = 1;

-- Insert without price_at_purchase (trigger should set it)
INSERT INTO OrderItem (order_id, variantID, quantity)
VALUES (1, 1, 1);

-- Verify trigger set the price
SELECT 
    order_item_id,
    variantID,
    quantity,
    price_at_purchase,
    shop_id,
    'Trigger should have set price_at_purchase and shop_id' AS note
FROM OrderItem 
WHERE order_item_id = LAST_INSERT_ID();
*/

-- TEST 12: trg_review_before_insert (ENFORCE RULE - rating 1-5)
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 3: trg_review_before_insert (rating validation)' AS test_name;
SELECT 'Testing: Rating must be between 1 and 5' AS description;
SELECT '⚠️ This test will try to INSERT invalid data - should fail' AS warning;
/*
-- This should FAIL with error "Rating must be between 1 and 5"
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES (1, 'Product', 1, 6, 'Invalid rating test');
*/

-- TEST 13: trg_review_before_insert (ENFORCE RULE - must purchase)
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 3: trg_review_before_insert (purchase validation)' AS test_name;
SELECT 'Testing: Can only review purchased products' AS description;
SELECT '⚠️ This test will try to INSERT invalid data - should fail' AS warning;
/*
-- This should FAIL with error "Can only review products from delivered orders"
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES (1, 'Product', 999, 5, 'Product not purchased test');
*/

-- TEST 14: trg_product_item_before_update (ENFORCE RULE)
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 5: trg_product_item_before_update' AS test_name;
SELECT 'Testing: Stock cannot be negative' AS description;
SELECT '⚠️ This test will try to UPDATE to invalid data - should fail' AS warning;
/*
-- This should FAIL with error "Product item stock cannot be negative"
UPDATE ProductItem SET stock = -10 WHERE item_id = 1;

-- This should FAIL with error "Product item price cannot be negative"
UPDATE ProductItem SET price = -100 WHERE item_id = 1;
*/

-- TEST 15: trg_account_after_insert (DERIVED VALUE)
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 6: trg_account_after_insert' AS test_name;
SELECT 'Testing: Auto-create Customer record and Cart' AS description;
SELECT '⚠️ This test will INSERT data - comment out if not testing' AS warning;
/*
-- Create new customer account (trigger should auto-create Customer + Cart)
INSERT INTO Account (email, password, role, full_name, phone, status)
VALUES ('test@test.com', 'password123', 'Customer', 'Test User', '0123456789', 'Active');

SET @new_account_id = LAST_INSERT_ID();

-- Verify trigger created Customer record
SELECT * FROM Customer WHERE account_id = @new_account_id;

-- Verify trigger created Cart
SELECT * FROM Cart WHERE customer_id = @new_account_id;
*/

-- TEST 16: trg_order_item_after_insert
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 2: trg_order_item_after_insert' AS test_name;
SELECT 'Testing: Stock decreases after order' AS description;
SELECT 'Check stock before and after inserting OrderItem' AS note;
/*
-- Check stock before
SELECT item_id, stock FROM ProductItem WHERE item_id = 1;

-- Insert order item (trigger should decrease stock)
INSERT INTO OrderItem (order_id, variantID, quantity, price_at_purchase, shop_id)
VALUES (1, 1, 5, 100000, 1);

-- Check stock after (should be decreased by 5)
SELECT item_id, stock FROM ProductItem WHERE item_id = 1;
*/

-- TEST 17: trg_review_after_insert
SELECT '' AS space;
SELECT '✅ TEST TRIGGER 4: trg_review_after_insert' AS test_name;
SELECT 'Testing: Shop rating updates after new review' AS description;
/*
-- Check shop rating before
SELECT shop_id, shop_name, rating FROM Shop WHERE shop_id = 1;

-- Add a review (trigger should update shop rating)
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES (1, 'Shop', 1, 5, 'Test review');

-- Check shop rating after (should be recalculated)
SELECT shop_id, shop_name, rating FROM Shop WHERE shop_id = 1;
*/

-- =============================================
-- SUMMARY REPORT
-- =============================================

SELECT '' AS space;
SELECT '========================================' AS header;
SELECT 'SUMMARY REPORT' AS header;
SELECT '========================================' AS header;

-- Count all objects
SELECT 
    'Functions' AS object_type,
    COUNT(*) AS total_count
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'ecommerce_db' AND ROUTINE_TYPE = 'FUNCTION'

UNION ALL

SELECT 
    'Procedures' AS object_type,
    COUNT(*) AS total_count
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'ecommerce_db' AND ROUTINE_TYPE = 'PROCEDURE'

UNION ALL

SELECT 
    'Triggers' AS object_type,
    COUNT(*) AS total_count
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'ecommerce_db';

-- List all functions
SELECT '' AS space;
SELECT 'Functions:' AS list_header;
SELECT ROUTINE_NAME 
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'ecommerce_db' AND ROUTINE_TYPE = 'FUNCTION'
ORDER BY ROUTINE_NAME;

-- List all procedures
SELECT '' AS space;
SELECT 'Procedures:' AS list_header;
SELECT ROUTINE_NAME 
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'ecommerce_db' AND ROUTINE_TYPE = 'PROCEDURE'
ORDER BY ROUTINE_NAME;

-- List all triggers
SELECT '' AS space;
SELECT 'Triggers:' AS list_header;
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'ecommerce_db'
ORDER BY TRIGGER_NAME;

SELECT '' AS space;
SELECT '========================================' AS footer;
SELECT '✅ ALL TESTS COMPLETED' AS footer;
SELECT '========================================' AS footer;
