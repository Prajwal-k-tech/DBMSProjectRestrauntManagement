--Restraunt order management system

-- cleaning up existing objects
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS order_status_enum CASCADE;
DROP TYPE IF EXISTS order_type_enum CASCADE;

--custom types for order status and type, we need order status to track progress
CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'preparing',
    'ready',
    'delivered',
    'cancelled'
);
--order type to distinguish between dine-in and takeaway
CREATE TYPE order_type_enum AS ENUM (
    'dine-in',
    'takeaway'
);

--Categories table, this is to categorize the type of menu items 
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_category_name CHECK (LENGTH(TRIM(name)) > 0)
);

-- menu items table to keep track of items available in the menu
CREATE TABLE menu_items (
    menu_item_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(category_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_menu_item_name CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT uq_menu_item_name UNIQUE (name, category_id)
);
    -- customer table to store customer details 
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(name)) > 0),
    phone VARCHAR(15) NOT NULL UNIQUE CHECK (phone ~ '^[0-9]{10,15}$'),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders tables to track the orders 
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status_enum DEFAULT 'pending',
    order_type order_type_enum NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_items table to track items within each order
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(menu_item_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal > 0),
    
    CONSTRAINT chk_subtotal_matches CHECK (subtotal = quantity * unit_price),
    CONSTRAINT uq_order_item UNIQUE (order_id, menu_item_id)
);
-- triggers for automation 
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_menu_items_update
    BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_orders_update
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

--Views to simplify common queries
-- Complete order details
CREATE VIEW vw_order_details AS
SELECT 
    o.order_id,
    o.order_date,
    o.status,
    o.total_amount,
    c.name AS customer_name,
    c.phone AS customer_phone,
    mi.name AS item_name,
    oi.quantity,
    oi.subtotal
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id;

-- Menu with categories
CREATE VIEW vw_menu AS
SELECT 
    mi.menu_item_id,
    mi.name,
    mi.price,
    mi.is_available,
    c.name AS category
FROM menu_items mi
JOIN categories c ON mi.category_id = c.category_id;

-- SCHEMA COMPLETE
-- Total: 5 tables, 4 relationships, 2 views
-- Normalized to 3NF
