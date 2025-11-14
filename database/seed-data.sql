-- ============================================
-- Seed Data for Restaurant Order Management System
-- Sample Data: Tasty Bakes (Indian Bakery)
-- ============================================

-- Clear existing data (for re-running)
TRUNCATE order_items, orders, customers, menu_items, categories RESTART IDENTITY CASCADE;

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, description) VALUES
('Puffs', 'Savory baked pastries with various fillings'),
('Samosas', 'Crispy fried triangular snacks'),
('Breads & Buns', 'Fresh baked breads and sweet buns'),
('Beverages', 'Hot and cold drinks'),
('Desserts', 'Sweet treats and cakes');

-- ============================================
-- MENU ITEMS
-- ============================================

-- Puffs (category_id = 1)
INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(1, 'Veg Puff', 'Vegetable filled puff pastry', 25.00, true),
(1, 'Chicken Puff', 'Spicy chicken filled puff', 35.00, true),
(1, 'Egg Puff', 'Boiled egg with masala filling', 30.00, true),
(1, 'Paneer Puff', 'Cottage cheese and spices', 40.00, true),
(1, 'Mushroom Puff', 'Mushroom and cheese filling', 45.00, true);

-- Samosas (category_id = 2)
INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(2, 'Veg Samosa', 'Classic potato and peas samosa', 20.00, true),
(2, 'Chicken Samosa', 'Minced chicken samosa', 30.00, true),
(2, 'Keema Samosa', 'Spiced mutton keema', 35.00, false),
(2, 'Cheese Samosa', 'Cheese and corn filling', 25.00, true);

-- Breads & Buns (category_id = 3)
INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(3, 'Masala Bun', 'Spiced butter bun', 15.00, true),
(3, 'Cream Bun', 'Sweet cream filled bun', 20.00, true),
(3, 'Jam Bun', 'Mixed fruit jam bun', 18.00, true),
(3, 'Chocolate Bun', 'Chocolate cream filled', 25.00, true),
(3, 'Garlic Bread', 'Toasted garlic butter bread', 40.00, true);

-- Beverages (category_id = 4)
INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(4, 'Masala Tea', 'Indian spiced tea', 15.00, true),
(4, 'Coffee', 'Hot filter coffee', 20.00, true),
(4, 'Cold Coffee', 'Iced coffee with ice cream', 50.00, true),
(4, 'Mango Lassi', 'Chilled mango yogurt drink', 40.00, true),
(4, 'Lemon Soda', 'Fresh lemon with soda', 25.00, true);

-- Desserts (category_id = 5)
INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(5, 'Black Forest Cake', 'Chocolate cake with cherries (per slice)', 60.00, true),
(5, 'Butterscotch Cake', 'Butterscotch flavored cake (per slice)', 55.00, true),
(5, 'Vanilla Pastry', 'Classic vanilla pastry', 45.00, true),
(5, 'Gulab Jamun', 'Traditional Indian sweet (2 pieces)', 30.00, true),
(5, 'Rasgulla', 'Soft cottage cheese balls in syrup (2 pieces)', 35.00, true);

-- ============================================
-- CUSTOMERS
-- ============================================
INSERT INTO customers (name, phone, email) VALUES
('Rajesh Kumar', '9876543210', 'rajesh.kumar@email.com'),
('Priya Sharma', '9123456789', 'priya.sharma@email.com'),
('Amit Patel', '9988776655', 'amit.patel@email.com'),
('Sneha Reddy', '9876512345', 'sneha.reddy@email.com'),
('Vikram Singh', '9123498765', NULL),
('Ananya Iyer', '9876501234', 'ananya.iyer@email.com'),
('Rohan Desai', '9988123456', NULL),
('Kavya Nair', '9876567890', 'kavya.nair@email.com');

-- ============================================
-- ORDERS
-- ============================================

-- Order 1: Rajesh Kumar - Morning breakfast takeaway
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type, notes) VALUES
(1, '2025-11-14 08:30:00', 95.00, 'delivered', 'takeaway', 'Pack separately please');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(1, 1, 2, 25.00, 50.00),  -- 2 Veg Puffs
(1, 16, 1, 15.00, 15.00),  -- 1 Masala Tea
(1, 6, 1, 20.00, 20.00),   -- 1 Veg Samosa
(1, 11, 2, 15.00, 30.00);  -- 2 Masala Buns

-- Order 2: Priya Sharma - Office party order
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type, notes) VALUES
(2, '2025-11-14 10:15:00', 340.00, 'delivered', 'takeaway', 'Urgent - office meeting');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(2, 2, 5, 35.00, 175.00),  -- 5 Chicken Puffs
(2, 7, 5, 30.00, 150.00),  -- 5 Chicken Samosas
(2, 17, 3, 20.00, 60.00);  -- 3 Coffees

-- Order 3: Amit Patel - Lunch dine-in
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type) VALUES
(3, '2025-11-14 12:45:00', 185.00, 'delivered', 'dine-in');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(3, 4, 2, 40.00, 80.00),   -- 2 Paneer Puffs
(3, 5, 1, 45.00, 45.00),   -- 1 Mushroom Puff
(3, 18, 2, 50.00, 100.00); -- 2 Cold Coffees

-- Order 4: Sneha Reddy - Evening snacks (pending)
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type, notes) VALUES
(4, '2025-11-14 16:20:00', 220.00, 'preparing', 'takeaway', 'Extra spicy please');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(4, 3, 3, 30.00, 90.00),   -- 3 Egg Puffs
(4, 9, 2, 25.00, 50.00),   -- 2 Cheese Samosas
(4, 19, 2, 40.00, 80.00);  -- 2 Mango Lassis

-- Order 5: Vikram Singh - Quick takeaway
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type) VALUES
(5, '2025-11-14 14:30:00', 100.00, 'ready', 'takeaway');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(5, 1, 2, 25.00, 50.00),   -- 2 Veg Puffs
(5, 16, 2, 15.00, 30.00),  -- 2 Masala Teas
(5, 12, 1, 20.00, 20.00);  -- 1 Cream Bun

-- Order 6: Ananya Iyer - Dessert order
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type, notes) VALUES
(6, '2025-11-14 15:00:00', 220.00, 'delivered', 'dine-in', 'Birthday celebration');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(6, 21, 2, 60.00, 120.00),  -- 2 Black Forest Cake slices
(6, 23, 2, 45.00, 90.00),   -- 2 Vanilla Pastries
(6, 17, 1, 20.00, 20.00);   -- 1 Coffee

-- Order 7: Rohan Desai - Large family order (pending)
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type, notes) VALUES
(7, '2025-11-14 17:00:00', 525.00, 'pending', 'takeaway', 'Will pick up at 6 PM');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(7, 1, 5, 25.00, 125.00),   -- 5 Veg Puffs
(7, 2, 5, 35.00, 175.00),   -- 5 Chicken Puffs
(7, 6, 10, 20.00, 200.00),  -- 10 Veg Samosas
(7, 16, 5, 15.00, 75.00);   -- 5 Masala Teas

-- Order 8: Kavya Nair - Sweet treats
INSERT INTO orders (customer_id, order_date, total_amount, status, order_type) VALUES
(8, '2025-11-14 13:15:00', 150.00, 'cancelled', 'takeaway');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(8, 24, 3, 30.00, 90.00),   -- 3 Gulab Jamun
(8, 25, 2, 35.00, 70.00);   -- 2 Rasgulla

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Summary statistics
SELECT 
    'Categories' AS table_name, 
    COUNT(*) AS count 
FROM categories
UNION ALL
SELECT 'Menu Items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items;

-- Menu summary by category
SELECT 
    c.name AS category,
    COUNT(mi.menu_item_id) AS item_count,
    MIN(mi.price) AS min_price,
    MAX(mi.price) AS max_price,
    AVG(mi.price)::DECIMAL(10,2) AS avg_price
FROM categories c
LEFT JOIN menu_items mi ON c.category_id = mi.category_id
GROUP BY c.name
ORDER BY c.name;

-- Order status summary
SELECT 
    status,
    COUNT(*) AS order_count,
    SUM(total_amount)::DECIMAL(10,2) AS total_revenue
FROM orders
GROUP BY status
ORDER BY status;

-- Top 5 selling items
SELECT 
    mi.name,
    c.name AS category,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.subtotal)::DECIMAL(10,2) AS total_revenue
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
JOIN categories c ON mi.category_id = c.category_id
GROUP BY mi.name, c.name
ORDER BY total_quantity_sold DESC
LIMIT 5;

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Total: 5 categories, 25 menu items, 8 customers, 8 orders, 30 order items
-- Revenue: Mix of delivered, preparing, ready, pending, and cancelled orders
-- Realistic Indian bakery data with various order types and scenarios
-- ============================================
