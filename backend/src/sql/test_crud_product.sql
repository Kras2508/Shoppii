-- =============================================
-- TEST CRUD PROCEDURES FOR PRODUCT & PRODUCT ITEM
-- Flow: Add Product → Add Item → Update Item → Update Product → Delete Product (cascade)
-- =============================================

USE ecommerce_db;

-- ==========================
-- INITIAL STATE CHECK
-- ==========================
SELECT '=== INITIAL STATE ===' AS info;
SELECT COUNT(*) AS product_count FROM Product;
SELECT COUNT(*) AS item_count FROM ProductItem;

-- ==========================
-- TEST 1: ADD PRODUCT (sp_add_product)
-- ==========================
SELECT '=== TEST 1: sp_add_product ===' AS test_name;

-- Test 1.1: Add product successfully
CALL sp_add_product(
    @p_shop_id := 4,           -- Shop 4
    @p_category_id := 1,       -- Electronics
    @p_product_name := 'iPhone 15 Pro Max',
    @p_description := 'Latest Apple flagship phone',
    @p_image := '/images/iphone15.jpg',
    @p_new_product_id,
    @p_status
);

SELECT 
    'Test 1.1: Add Product Success' AS test_case,
    @p_new_product_id AS product_id,
    @p_status AS status
    -- Expected: product_id > 0, status = 'Success'
;

-- Verify product created
SELECT * FROM Product WHERE product_id = @p_new_product_id;
-- Expected: 1 row with product_name = 'iPhone 15 Pro Max'

-- Test 1.2: Add product with invalid shop (should fail)
CALL sp_add_product(
    999,                       -- Non-existent shop
    1,
    'Test Product',
    'Description',
    '/image.jpg',
    @p_product_id_2,
    @p_status_2
);

SELECT 
    'Test 1.2: Add Product Invalid Shop' AS test_case,
    @p_product_id_2 AS product_id,
    @p_status_2 AS status
    -- Expected: product_id = -1, status = 'Error: Shop not found'
;

-- Test 1.3: Add product with invalid category (should fail)
CALL sp_add_product(
    4,
    999,                       -- Non-existent category
    'Test Product',
    'Description',
    '/image.jpg',
    @p_product_id_3,
    @p_status_3
);

SELECT 
    'Test 1.3: Add Product Invalid Category' AS test_case,
    @p_product_id_3 AS product_id,
    @p_status_3 AS status
    -- Expected: product_id = -1, status = 'Error: Category not found'
;

-- ==========================
-- TEST 2: ADD PRODUCT ITEM (sp_add_product_item)
-- Items for Product created in Test 1.1
-- ==========================
SELECT '=== TEST 2: sp_add_product_item ===' AS test_name;

-- Test 2.1: Add item variant 1 (Black, 256GB)
CALL sp_add_product_item(
    @p_new_product_id,         -- Product from Test 1.1
    4,                         -- Shop 4
    'Black',                   -- Color
    '256GB',                   -- Type/Storage
    29999000,                  -- Price
    50,                        -- Stock
    '/images/iphone15-black-256gb.jpg',
    @p_item_id_1,
    @p_item_status_1
);

SELECT 
    'Test 2.1: Add Item 1 (Black, 256GB)' AS test_case,
    @p_item_id_1 AS item_id,
    @p_item_status_1 AS status
    -- Expected: item_id > 0, status = 'Success'
;

-- Verify item created
SELECT * FROM ProductItem WHERE item_id = @p_item_id_1;
-- Expected: 1 row with color = 'Black', type = '256GB', price = 29999000, stock = 50

-- Test 2.2: Add item variant 2 (Gold, 512GB)
CALL sp_add_product_item(
    @p_new_product_id,
    4,
    'Gold',
    '512GB',
    34999000,
    30,
    '/images/iphone15-gold-512gb.jpg',
    @p_item_id_2,
    @p_item_status_2
);

SELECT 
    'Test 2.2: Add Item 2 (Gold, 512GB)' AS test_case,
    @p_item_id_2 AS item_id,
    @p_item_status_2 AS status
    -- Expected: item_id > 0, status = 'Success'
;

-- Test 2.3: Add item with invalid product (should fail)
CALL sp_add_product_item(
    999,                       -- Non-existent product
    4,
    'Red',
    '256GB',
    25000000,
    20,
    '/image.jpg',
    @p_item_id_3,
    @p_item_status_3
);

SELECT 
    'Test 2.3: Add Item Invalid Product' AS test_case,
    @p_item_id_3 AS item_id,
    @p_item_status_3 AS status
    -- Expected: item_id = -1, status = 'Error: Product not found'
;

-- Test 2.4: Add item with invalid price (should fail)
CALL sp_add_product_item(
    @p_new_product_id,
    4,
    'Silver',
    '1TB',
    -5000,                     -- Negative price
    15,
    '/image.jpg',
    @p_item_id_4,
    @p_item_status_4
);

SELECT 
    'Test 2.4: Add Item Invalid Price' AS test_case,
    @p_item_id_4 AS item_id,
    @p_item_status_4 AS status
    -- Expected: item_id = -1, status = 'Error: Price must be > 0'
;

-- Test 2.5: Add item with invalid stock (should fail)
CALL sp_add_product_item(
    @p_new_product_id,
    4,
    'Silver',
    '1TB',
    39999000,
    -10,                       -- Negative stock
    '/image.jpg',
    @p_item_id_5,
    @p_item_status_5
);

SELECT 
    'Test 2.5: Add Item Invalid Stock' AS test_case,
    @p_item_id_5 AS item_id,
    @p_item_status_5 AS status
    -- Expected: item_id = -1, status = 'Error: Stock cannot be negative'
;

-- ==========================
-- TEST 3: UPDATE PRODUCT ITEM (sp_update_product_item)
-- ==========================
SELECT '=== TEST 3: sp_update_product_item ===' AS test_name;

-- Test 3.1: Update item price and stock (item_id_1)
CALL sp_update_product_item(
    @p_item_id_1,              -- Black 256GB item
    28999000,                  -- New price (discount)
    45,                        -- New stock
    '/images/iphone15-black-256gb-updated.jpg',
    @p_success_1,
    @p_message_1
);

SELECT 
    'Test 3.1: Update Item 1 Price & Stock' AS test_case,
    @p_success_1 AS success,
    @p_message_1 AS message,
    (SELECT price FROM ProductItem WHERE item_id = @p_item_id_1) AS new_price,
    (SELECT stock FROM ProductItem WHERE item_id = @p_item_id_1) AS new_stock
    -- Expected: success = 1, message = 'Item updated successfully', new_price = 28999000, new_stock = 45
;

-- Test 3.2: Update only stock (price NULL)
CALL sp_update_product_item(
    @p_item_id_2,              -- Gold 512GB item
    NULL,                      -- Keep current price
    25,                        -- New stock (sold 5)
    NULL,
    @p_success_2,
    @p_message_2
);

SELECT 
    'Test 3.2: Update Item 2 Stock Only' AS test_case,
    @p_success_2 AS success,
    @p_message_2 AS message,
    (SELECT stock FROM ProductItem WHERE item_id = @p_item_id_2) AS new_stock
    -- Expected: success = 1, message = 'Item updated successfully', new_stock = 25
;

-- Test 3.3: Update with invalid item (should fail)
CALL sp_update_product_item(
    999,                       -- Non-existent item
    30000000,
    50,
    '/image.jpg',
    @p_success_3,
    @p_message_3
);

SELECT 
    'Test 3.3: Update Invalid Item' AS test_case,
    @p_success_3 AS success,
    @p_message_3 AS message
    -- Expected: success = 0, message = 'Error: Item not found'
;

-- Test 3.4: Update with negative price (should fail)
CALL sp_update_product_item(
    @p_item_id_1,
    -5000,                     -- Negative price
    50,
    '/image.jpg',
    @p_success_4,
    @p_message_4
);

SELECT 
    'Test 3.4: Update Invalid Price' AS test_case,
    @p_success_4 AS success,
    @p_message_4 AS message
    -- Expected: success = 0, message = 'Error: Price must be > 0'
;

-- ==========================
-- TEST 4: UPDATE PRODUCT (sp_update_product)
-- ==========================
SELECT '=== TEST 4: sp_update_product ===' AS test_name;

-- Test 4.1: Update product name and status
CALL sp_update_product(
    @p_new_product_id,         -- iPhone 15 Pro Max
    'iPhone 15 Pro Max (New Generation)',  -- New name
    'Latest Apple flagship with advanced features',  -- New description
    '/images/iphone15-new.jpg',
    'In stock',
    @p_success_5,
    @p_message_5
);

SELECT 
    'Test 4.1: Update Product Name & Description' AS test_case,
    @p_success_5 AS success,
    @p_message_5 AS message,
    (SELECT product_name FROM Product WHERE product_id = @p_new_product_id) AS new_name
    -- Expected: success = 1, message = 'Product updated successfully', new_name = 'iPhone 15 Pro Max (New Generation)'
;

-- Test 4.2: Update product status to "Out of stock"
CALL sp_update_product(
    @p_new_product_id,
    NULL,                      -- Keep current name
    NULL,
    NULL,
    'Out of stock',            -- Change status
    @p_success_6,
    @p_message_6
);

SELECT 
    'Test 4.2: Update Product Status' AS test_case,
    @p_success_6 AS success,
    @p_message_6 AS message,
    (SELECT status FROM Product WHERE product_id = @p_new_product_id) AS new_status
    -- Expected: success = 1, message = 'Product updated successfully', new_status = 'Out of stock'
;

-- Test 4.3: Update non-existent product (should fail)
CALL sp_update_product(
    999,                       -- Non-existent product
    'Test',
    'Desc',
    '/img.jpg',
    'In stock',
    @p_success_7,
    @p_message_7
);

SELECT 
    'Test 4.3: Update Invalid Product' AS test_case,
    @p_success_7 AS success,
    @p_message_7 AS message
    -- Expected: success = 0, message = 'Error: Product not found'
;

-- ==========================
-- TEST 5: DELETE PRODUCT ITEM (sp_delete_product_item)
-- ==========================
SELECT '=== TEST 5: sp_delete_product_item ===' AS test_name;

-- Test 5.1: Delete single item variant
CALL sp_delete_product_item(
    @p_item_id_1,              -- Delete Black 256GB variant
    @p_success_8,
    @p_message_8
);

SELECT 
    'Test 5.1: Delete Product Item' AS test_case,
    @p_success_8 AS success,
    @p_message_8 AS message
    -- Expected: success = 1, message = 'Item deleted successfully'
;

-- Verify item deleted
SELECT 
    'Verify item deleted' AS verification,
    COUNT(*) AS remaining_items
FROM ProductItem 
WHERE item_id = @p_item_id_1
    -- Expected: 0 (item completely deleted)
;

-- Product should still exist (only item deleted)
SELECT 
    'Product should still exist' AS verification,
    COUNT(*) AS product_exists
FROM Product 
WHERE product_id = @p_new_product_id
    -- Expected: 1 (product still exists)
;

-- Test 5.2: Delete non-existent item (should fail)
CALL sp_delete_product_item(
    999,                       -- Non-existent item
    @p_success_9,
    @p_message_9
);

SELECT 
    'Test 5.2: Delete Invalid Item' AS test_case,
    @p_success_9 AS success,
    @p_message_9 AS message
    -- Expected: success = 0, message = 'Error: Item not found'
;

-- ==========================
-- TEST 6: DELETE PRODUCT (sp_delete_product) - CASCADE
-- Deleting Product should cascade delete all ProductItems
-- ==========================
SELECT '=== TEST 6: sp_delete_product ===' AS test_name;

-- Before delete: Check all items
SELECT 
    'Before Delete - Items Count' AS info,
    COUNT(*) AS items_before_delete
FROM ProductItem
WHERE product_id = @p_new_product_id
    -- Expected: 1 (only item_id_2 remains, item_id_1 was deleted in Test 5.1)
;

-- Delete product (should cascade delete all items)
CALL sp_delete_product(
    @p_new_product_id,         -- Delete iPhone 15 Pro Max
    @p_success_10,
    @p_message_10
);

SELECT 
    'Test 6.1: Delete Product (CASCADE)' AS test_case,
    @p_success_10 AS success,
    @p_message_10 AS message
    -- Expected: success = 1, message contains 'Product deleted. Removed 1 variant(s)'
;

-- After delete: Verify product deleted
SELECT 
    'After Delete - Product Deleted' AS verification,
    COUNT(*) AS product_exists
FROM Product
WHERE product_id = @p_new_product_id
    -- Expected: 0 (product completely deleted)
;

-- After delete: Verify all items cascade deleted
SELECT 
    'After Delete - Items Cascade Deleted' AS verification,
    COUNT(*) AS items_after_delete
FROM ProductItem
WHERE product_id = @p_new_product_id
    -- Expected: 0 (all items cascade deleted)
;

-- Test 6.2: Delete non-existent product (should fail)
CALL sp_delete_product(
    999,                       -- Non-existent product
    @p_success_11,
    @p_message_11
);

SELECT 
    'Test 6.2: Delete Invalid Product' AS test_case,
    @p_success_11 AS success,
    @p_message_11 AS message
    -- Expected: success = 0, message = 'Error: Product not found'
;

-- ==========================
-- FINAL STATE CHECK
-- ==========================
SELECT '=== FINAL STATE ===' AS info;
SELECT COUNT(*) AS product_count FROM Product;
SELECT COUNT(*) AS item_count FROM ProductItem;