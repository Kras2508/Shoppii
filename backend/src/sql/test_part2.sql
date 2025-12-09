-- =============================================
-- PART 2: TEST QUERIES
-- Để verify Functions, Procedures, Triggers hoạt động đúng
-- =============================================

USE ecommerce_db;

-- ==========================
-- INITIAL DATA STATE
-- ==========================
-- Expected data:
-- - Account 1-3: Customers (customer_id = account_id)
-- - Account 4-6: Shops (shop_id = account_id)
-- - Account 7: Admin
-- - 5 Products across 3 shops
-- - 4 Orders total
-- - 7 Reviews (product + shop reviews)
-- ==========================

-- =============================================
-- TEST FUNCTIONS
-- =============================================

-- ==========================
-- TEST 1: FUNCTION fn_calculate_order_total
-- ==========================
SELECT '=== TEST 1: fn_calculate_order_total ===' AS test_name;

SELECT fn_calculate_order_total(1) AS result;
-- Expected: 1985000.00
-- Calculation: (1000000 + 1200000) + 5000 - 220000 = 1985000

SELECT fn_calculate_order_total(2) AS result;
-- Expected: 904000.00
-- Calculation: 900000 + 4000 = 904000

SELECT fn_calculate_order_total(3) AS result;
-- Expected: 31000.00
-- Calculation: 25000 + 6000 = 31000

SELECT fn_calculate_order_total(4) AS result;
-- Expected: 84500.00
-- Calculation: 80000 + 4500 = 84500

-- ==========================
-- TEST 2: FUNCTION fn_get_customer_total_spent
-- ==========================
SELECT '=== TEST 2: fn_get_customer_total_spent ===' AS test_name;

SELECT fn_get_customer_total_spent(1) AS result;
-- Expected: 2069500.00
-- Customer 1 orders: 1 (1985000) + 4 (84500)

SELECT fn_get_customer_total_spent(2) AS result;
-- Expected: 0.00
-- Customer 2 only has cancelled order

SELECT fn_get_customer_total_spent(3) AS result;
-- Expected: 31000.00
-- Customer 3: Order 3 (31000)

-- ==========================
-- TEST 3: FUNCTION fn_get_shop_revenue
-- ==========================
SELECT '=== TEST 3: fn_get_shop_revenue ===' AS test_name;

SELECT fn_get_shop_revenue(4) AS result;
-- Expected: 2200000.00
-- Shop 4: Order 2 items from poduct 1 (1 000 000 + 1 200 000) - voucher (220 000) = 1 980 000

SELECT fn_get_shop_revenue(5) AS result;
-- Expected: 25000.00
-- Shop 5: Order 3 item (25 000 * qty 1) = 25000

SELECT fn_get_shop_revenue(6) AS result;
-- Expected: 80000.00
-- Shop 6: Order 4 item 6 (80000)

-- ==========================
-- TEST 4: FUNCTION fn_calculate_shop_rating
-- ==========================
SELECT '=== TEST 4: fn_calculate_shop_rating ===' AS test_name;

SELECT fn_calculate_shop_rating(4) AS result;
-- Expected: 4.00
-- Reviews 3,6 for Shop 4: (5+3)/2 = 4.00

SELECT fn_calculate_shop_rating(5) AS result;
-- Expected: 0.00
-- No shop reviews for Shop 5

SELECT fn_calculate_shop_rating(6) AS result;
-- Expected: 5.00
-- Review 4 for Shop 6: 5 stars

-- ==========================
-- TEST 5: FUNCTION fn_calculate_product_rating
-- ==========================
SELECT '=== TEST 5: fn_calculate_product_rating ===' AS test_name;

SELECT fn_calculate_product_rating(1) AS result;
-- Expected: 4.50
-- Reviews 1,7 for Product 1: (5+4)/2 = 4.50

SELECT fn_calculate_product_rating(2) AS result;
-- Expected: 0.00
-- No reviews for Product 2

SELECT fn_calculate_product_rating(3) AS result;
-- Expected: 4.00
-- Review 2 for Product 3: 4 stars

SELECT fn_calculate_product_rating(4) AS result;
-- Expected: 0.00
-- No reviews for Product 4

SELECT fn_calculate_product_rating(5) AS result;
-- Expected: 5.00
--  Review 5 for Product 5: 5 stars

-- ==========================
-- TEST 5.1: FUNCTION fn_get_order_total_items_with_cursor
-- ==========================
SELECT '=== TEST 5.1: fn_get_order_total_items_with_cursor ===' AS test_name;

SELECT fn_get_order_total_items_with_cursor(1) AS result;
-- Expected: 2
-- Order 1 has 2 items (qty 1 + qty 1 = 2 total)

SELECT fn_get_order_total_items_with_cursor(2) AS result;
-- Expected: 1
-- Order 2 has 1 item (qty 1)

SELECT fn_get_order_total_items_with_cursor(3) AS result;
-- Expected: 1
-- Order 3 has 1 item (qty 1)

SELECT fn_get_order_total_items_with_cursor(4) AS result;
-- Expected: 1
-- Order 4 has 1 item (qty 1)

SELECT fn_get_order_total_items_with_cursor(999) AS result;
-- Expected: 0
-- Order 999 does not exist

-- =============================================
-- TEST PROCEDURES
-- =============================================

-- ==========================
-- TEST 6: PROCEDURE sp_get_shop_revenue_report
-- ==========================
SELECT '=== TEST 6: sp_get_shop_revenue_report ===' AS test_name;

SELECT 'Shop 4 - Full year 2025 report:' AS description;
CALL sp_get_shop_revenue_report(4, '2025-01-01', '2025-12-31');
-- Expected OUTPUT 1:
-- | shop_id | shop_name | total_orders | total_items_sold | total_revenue | avg_item_value |
-- | 4       | Shop ABC  | 1            | 2                | 2200000       | 1100000        |
-- Expected OUTPUT 2: iPhone variants (Red, Blue)

SELECT '' AS space;
SELECT 'Shop 5 - Full year 2025 report:' AS description;
CALL sp_get_shop_revenue_report(5, '2025-01-01', '2025-12-31');
-- Expected OUTPUT 1:
-- | shop_id | shop_name | total_orders | total_items_sold | total_revenue | avg_item_value |
-- | 5       | Shop XYZ  | 1            | 1                | 25000         | 25000          |
-- Expected OUTPUT 2: T-Shirt

SELECT '' AS space;
SELECT 'Shop 6 - Full year 2025 report:' AS description;
CALL sp_get_shop_revenue_report(6, '2025-01-01', '2025-12-31');
-- Expected OUTPUT 1:
-- | shop_id | shop_name | total_orders | total_items_sold | total_revenue | avg_item_value |
-- | 6       | Tech Store| 1            | 1                | 80000         | 80000          |
-- Expected OUTPUT 2: Wireless Headset

-- ==========================
-- TEST 7: PROCEDURE sp_get_category_hierarchy
-- ==========================
SELECT '=== TEST 7: sp_get_category_hierarchy ===' AS test_name;

CALL sp_get_category_hierarchy();
-- Expected OUTPUT:
-- | category_id | category_name | level | path                  |
-- | 1           | Electronics   | 0     | Electronics           |
-- | 3           | Phones        | 1     |   Phones              |
-- | 4           | Laptops       | 1     |   Laptops             |
-- | 2           | Fashion       | 0     | Fashion               |
-- | 5           | Clothes       | 1     |   Clothes             |

-- ==========================
-- TEST 8: PROCEDURE sp_get_category_all_children
-- ==========================
SELECT '=== TEST 8: sp_get_category_all_children ===' AS test_name;

SELECT 'Get all children of Electronics (category_id=1):' AS description;
CALL sp_get_category_all_children(1);
-- Expected OUTPUT:
-- | category_id | category_name | level |
-- | 1           | Electronics   | 0     |
-- | 3           | Phones        | 1     |
-- | 4           | Laptops       | 1     |

SELECT '' AS space;
SELECT 'Get all children of Fashion (category_id=2):' AS description;
CALL sp_get_category_all_children(2);
-- Expected OUTPUT:
-- | category_id | category_name | level |
-- | 2           | Fashion       | 0     |
-- | 5           | Clothes       | 1     |

-- ==========================
-- TEST 9: PROCEDURE sp_get_category_all_parents
-- ==========================
SELECT '=== TEST 9: sp_get_category_all_parents ===' AS test_name;

SELECT 'Get all parents of Phones (category_id=3):' AS description;
CALL sp_get_category_all_parents(3);
-- Expected OUTPUT:
-- | category_id | category_name | level |
-- | 3           | Phones        | 0     |
-- | 1           | Electronics   | 1     |

SELECT '' AS space;
SELECT 'Get all parents of Clothes (category_id=5):' AS description;
CALL sp_get_category_all_parents(5);
-- Expected OUTPUT:
-- | category_id | category_name | level |
-- | 5           | Clothes       | 0     |
-- | 2           | Fashion       | 1     |

-- ==========================
-- TEST 10: PROCEDURE sp_create_order_from_cart
-- ==========================
SELECT '=== TEST 10: sp_create_order_from_cart ===' AS test_name;

-- Setup: Add items to Customer 1's cart
DELETE FROM CartItem WHERE cart_id = 1;
INSERT INTO CartItem (cart_id, item_id, quantity) VALUES (1, 1, 1);
INSERT INTO CartItem (cart_id, item_id, quantity) VALUES (1, 4, 2);

SELECT 'Before creating order - Cart items:' AS info;
SELECT ci.cart_id, ci.item_id, ci.quantity, pi.product_id, pi.price 
FROM CartItem ci
INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
WHERE ci.cart_id = 1;
-- Expected: 2 rows (item 1, item 4)

CALL sp_create_order_from_cart(1, 1, NULL, '123 Updated Street', 'Banking', 'Test from cart', @new_order_id);

SELECT 'New order created:' AS info;
SELECT @new_order_id AS order_id;
-- Expected: New order_id (likely 5+)

SELECT 'After creating order - Order details:' AS info;
SELECT order_id, customer_id, status, payment_method, shipping_address FROM `Order` WHERE order_id = @new_order_id;
-- Expected: status='Processing', payment_method='Banking'

SELECT 'Order items:' AS info;
SELECT order_id, item_id, shop_id, quantity, price_at_purchase FROM OrderItem WHERE order_id = @new_order_id;
-- Expected: 2 rows (items from cart)

SELECT 'Cart after order - Should be empty:' AS info;
SELECT COUNT(*) AS remaining_items FROM CartItem WHERE cart_id = 1;
-- Expected: 0 (cart items deleted after order creation)

-- ==========================
-- TEST 11: PROCEDURE sp_apply_voucher
-- ==========================
SELECT '=== TEST 11: sp_apply_voucher ===' AS test_name;

SELECT 'Test 11.1: Valid percentage voucher (DISCOUNT10)' AS test_case;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher('DISCOUNT10', 500000, @discount, @valid, @msg);
SELECT @discount AS discount_amount, @valid AS is_valid, @msg AS message;
-- Expected: discount=50000, is_valid=1, message='Voucher applied successfully'

SELECT 'Test 11.2: Valid amount voucher (SAVE50) - Order meets min' AS test_case;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher('SAVE50', 300000, @discount, @valid, @msg);
SELECT @discount AS discount_amount, @valid AS is_valid, @msg AS message;
-- Expected: discount=50000, is_valid=1, message='Voucher applied successfully'

SELECT 'Test 11.3: Valid amount voucher (SAVE50) - Order below min' AS test_case;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher('SAVE50', 150000, @discount, @valid, @msg);
SELECT @discount AS discount_amount, @valid AS is_valid, @msg AS message;
-- Expected: discount=0, is_valid=0, message mentions min order value

SELECT 'Test 11.4: Non-existent voucher (should fail validation)' AS test_case;
SET @discount = 0;
SET @valid = FALSE;
SET @msg = '';
CALL sp_apply_voucher('NONEXISTENT', 500000, @discount, @valid, @msg);
SELECT @discount AS discount_amount, @valid AS is_valid, @msg AS message;
-- Expected: discount=0, is_valid=0, message='Voucher code not found'

-- =============================================
-- TEST TRIGGERS
-- =============================================

-- ==========================
-- TEST 7: TRIGGER trg_account_after_insert
-- ==========================
SELECT '=== TEST 7: trg_account_after_insert ===' AS test_name;

-- Test 7.1: Create new Customer account (trigger auto-creates Customer + Cart)
INSERT INTO Account (email, password, role, full_name, phone, status)
VALUES ('trigger_test_customer@gmail.com', '1234', 'Customer', 'Trigger Test Cust', '0999999999', 'Active');
SET @test_cust_id = LAST_INSERT_ID();

SELECT 'Customer record created by trigger:' AS info;
SELECT customer_id, total_spent, total_order FROM Customer WHERE customer_id = @test_cust_id;
-- Expected: customer_id = @test_cust_id, total_spent = 0, total_order = 0

SELECT 'Cart record created by trigger:' AS info;
SELECT cart_id, customer_id FROM Cart WHERE customer_id = @test_cust_id;
-- Expected: cart_id exists, customer_id = @test_cust_id

-- Test 7.2: Create new Shop account (trigger auto-creates Shop record)
INSERT INTO Account (email, password, role, full_name, phone, status)
VALUES ('trigger_test_shop@gmail.com', '1234', 'Shop', 'Trigger Test Shop', '0988888888', 'Active');
SET @test_shop_id = LAST_INSERT_ID();

SELECT 'Shop record created by trigger:' AS info;
SELECT shop_id, shop_name, rating FROM Shop WHERE shop_id = @test_shop_id;
-- Expected: shop_id = @test_shop_id, shop_name = 'Shop <id>', rating = 0

-- Test 7.3: Create new Admin account (trigger auto-creates Admin record)
INSERT INTO Account (email, password, role, full_name, phone, status)
VALUES ('trigger_test_admin@gmail.com', '1234', 'Admin', 'Trigger Test Admin', '0977777777', 'Active');
SET @test_admin_id = LAST_INSERT_ID();

SELECT 'Admin record created by trigger:' AS info;
SELECT admin_id, role FROM Admin WHERE admin_id = @test_admin_id;
-- Expected: admin_id = @test_admin_id, role = 'Support'

-- ==========================
-- TEST 8: TRIGGER trg_order_item_before_insert
-- ==========================
SELECT '=== TEST 8: trg_order_item_before_insert ===' AS test_name;

-- Create test order
INSERT INTO `Order` (customer_id, shipping_id, status, shipping_address, payment_method)
VALUES (1, 1, 'Processing', '123 Test St', 'COD');
SET @test_order = LAST_INSERT_ID();

-- Test: Insert OrderItem without price_at_purchase (trigger auto-fills from ProductItem)
SELECT 'Before trigger - ProductItem 4 details:' AS info;
SELECT item_id, price, shop_id FROM ProductItem WHERE item_id = 4;
-- Expected: price = 25000, shop_id = 5

INSERT INTO OrderItem (order_id, item_id, quantity) VALUES (@test_order, 4, 1);

SELECT 'After trigger - OrderItem auto-filled:' AS info;
SELECT order_id, item_id, shop_id, quantity, price_at_purchase FROM OrderItem WHERE order_id = @test_order;
-- Expected: shop_id = 5, price_at_purchase = 25000 (auto-filled by trigger)

-- ==========================
-- TEST 9: TRIGGER trg_order_item_after_insert
-- ==========================
SELECT '=== TEST 9: trg_order_item_after_insert ===' AS test_name;

SELECT 'Before trigger - ProductItem 4 stock:' AS info;
SELECT item_id, stock FROM ProductItem WHERE item_id = 4;
-- Expected: stock = 100 (before the previous OrderItem insert)

SELECT 'After trigger - ProductItem 4 stock decreased:' AS info;
SELECT item_id, stock FROM ProductItem WHERE item_id = 4;
-- Expected: stock = 99 (decreased by 1 from previous insert)

-- Insert another item to verify stock decrease
-- INSERT INTO OrderItem (order_id, item_id, quantity) VALUES (@test_order, 4, 1000);
INSERT INTO OrderItem (order_id, item_id, quantity) VALUES (@test_order, 4, 2);

SELECT 'After second trigger - ProductItem 4 stock:' AS info;
SELECT item_id, stock FROM ProductItem WHERE item_id = 4;
-- Expected: stock = 97 (99 - 2 = 97)

-- ==========================
-- TEST 10: TRIGGER trg_review_before_insert (VALIDATION)
-- ==========================
SELECT '=== TEST 10: trg_review_before_insert ===' AS test_name;

SELECT 'Test 10.1: Insert review with invalid rating (should fail)' AS test_case;
-- Uncomment to test error:
-- INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
-- VALUES (1, 'Product', 1, 6, 'Invalid rating > 5');
-- Expected ERROR: Rating must be between 1 and 5

SELECT 'Test 10.2: Insert review without purchasing product (should fail)' AS test_case;
-- Uncomment to test error:
-- INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
-- VALUES (1, 'Product', 2, 5, 'Never bought Product 2');
-- Expected ERROR: Can only review products from delivered orders

SELECT 'Test 10.3: Valid product review (success)' AS test_case;
-- Customer 3 purchased Product 3 (T-Shirt) in delivered Order 3
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES (3, 'Product', 3, 5, 'Great T-Shirt quality!');
-- Expected: Review inserted successfully

SELECT 'Review inserted:' AS info;
SELECT review_id, customer_id, target_id, rating FROM Review 
WHERE customer_id = 3 AND target_id = 3 AND target_type = 'Product' 
ORDER BY review_id DESC LIMIT 1;
-- Expected: New review with rating = 5

-- ==========================
-- TEST 11: TRIGGER trg_review_after_insert
-- ==========================
SELECT '=== TEST 11: trg_review_after_insert ===' AS test_name;

SELECT 'Before review - Product 3 rating:' AS info;
SELECT product_id, rating FROM Product WHERE product_id = 3;
-- Expected: rating = 4.00 (from Review 2 only, before new review)

SELECT 'After review insert - Product 3 rating updated:' AS info;
SELECT product_id, rating FROM Product WHERE product_id = 3;
-- Expected: rating = 4.50 (average of (4+5)/2 = 4.50, now with 2 reviews)

-- Insert shop review to test shop rating update
SELECT 'Before shop review - Shop 5 rating:' AS info;
SELECT shop_id, rating FROM Shop WHERE shop_id = 5;
-- Expected: rating = 0.00 (no shop reviews yet)

-- Customer 3 purchased from Shop 5 in Order 3, can review shop
INSERT INTO Review (customer_id, target_type, target_id, rating, comment)
VALUES (3, 'Shop', 5, 5, 'Excellent shop service!');
-- Expected: Review inserted successfully

SELECT 'After shop review - Shop 5 rating updated:' AS info;
SELECT shop_id, rating FROM Shop WHERE shop_id = 5;
-- Expected: rating = 5.00 (trigger auto-calculated from review)

-- ==========================
-- TEST 12: TRIGGER trg_product_item_before_update
-- ==========================
SELECT '=== TEST 12: trg_product_item_before_update ===' AS test_name;

SELECT 'Test 12.1: Update stock to negative (should fail)' AS test_case;
-- Uncomment to test error:
-- UPDATE ProductItem SET stock = -10 WHERE item_id = 1;
-- Expected ERROR: Product item stock cannot be negative

SELECT 'Test 12.2: Update price to negative (should fail)' AS test_case;
-- Uncomment to test error:
-- UPDATE ProductItem SET price = -1000 WHERE item_id = 1;
-- Expected ERROR: Product item price cannot be negative

SELECT 'Test 12.3: Valid update - increase stock' AS test_case;
SELECT item_id, stock FROM ProductItem WHERE item_id = 1;
-- Expected: stock = 50 (before update)

UPDATE ProductItem SET stock = 150 WHERE item_id = 1;

SELECT 'After update - stock increased:' AS info;
SELECT item_id, stock FROM ProductItem WHERE item_id = 1;
-- Expected: stock = 150 (successfully updated)

-- Restore to original
UPDATE ProductItem SET stock = 50 WHERE item_id = 1;

-- ==========================
-- CLEANUP TEST DATA
-- ==========================
SELECT '=== CLEANUP TEST DATA ===' AS title;

-- Delete test reviews
DELETE FROM Review WHERE customer_id = 3 AND target_type = 'Product' AND comment = 'Great T-Shirt quality!';
DELETE FROM Review WHERE customer_id = 3 AND target_type = 'Shop' AND comment = 'Excellent shop service!';

-- Delete test order and order items
DELETE FROM OrderItem WHERE order_id = @test_order;
DELETE FROM `Order` WHERE order_id = @test_order;

-- Delete test accounts
DELETE FROM Cart WHERE customer_id = @test_cust_id;
DELETE FROM Customer WHERE customer_id = @test_cust_id;
DELETE FROM Shop WHERE shop_id = @test_shop_id;
DELETE FROM Admin WHERE admin_id = @test_admin_id;
DELETE FROM Account WHERE account_id IN (@test_cust_id, @test_shop_id, @test_admin_id);

-- Restore product/shop ratings to original values
UPDATE Product SET rating = ROUND(fn_calculate_product_rating(product_id), 2);
UPDATE Shop SET rating = ROUND(fn_calculate_shop_rating(shop_id), 2);

SELECT 'Cleanup completed' AS info;

-- ==========================
-- FINAL VERIFICATION
-- ==========================
SELECT '=== FINAL VERIFICATION ===' AS title;

SELECT 
    (SELECT COUNT(*) FROM Account) AS total_accounts,
    (SELECT COUNT(*) FROM Customer) AS total_customers,
    (SELECT COUNT(*) FROM Shop) AS total_shops,
    (SELECT COUNT(*) FROM Admin) AS total_admins,
    (SELECT COUNT(*) FROM Product) AS total_products,
    (SELECT COUNT(*) FROM Review) AS total_reviews,
    (SELECT COUNT(*) FROM `Order`) AS total_orders,
    (SELECT COUNT(*) FROM OrderItem) AS total_order_items;
