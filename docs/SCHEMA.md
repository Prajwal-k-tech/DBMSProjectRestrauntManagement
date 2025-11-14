# Database Schema Documentation
## Restaurant Order Management System

---

## 📊 Quick Overview

This database consists of **5 tables** that manage restaurant operations:

```
┌─────────────┐
│ categories  │
└──────┬──────┘
       │ 1:M
       ▼
┌─────────────┐       ┌─────────────┐
│ menu_items  │       │ customers   │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │ 1:M             1:M │
       │                     ▼
       │              ┌─────────────┐
       │              │   orders    │
       │              └──────┬──────┘
       │                     │ 1:M
       │                     ▼
       │              ┌─────────────┐
       └──────────────┤ order_items │
              1:M     └─────────────┘
```

---

## 1️⃣ categories Table

**Purpose:** Organize menu items into logical groups (e.g., Puffs, Beverages, Desserts)

### Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `category_id` | SERIAL | PRIMARY KEY | Unique category identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Category name |
| `description` | TEXT | - | Optional category description |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When category was created |

### Example Data
```sql
category_id | name       | description
------------|------------|---------------------------
1           | Puffs      | Savory baked pastries
2           | Beverages  | Hot and cold drinks
3           | Desserts   | Sweet treats and cakes
```

---

## 2️⃣ menu_items Table

**Purpose:** Store all items available on the restaurant menu

### Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `menu_item_id` | SERIAL | PRIMARY KEY | Unique item identifier |
| `category_id` | INTEGER | FOREIGN KEY → categories | Which category this item belongs to |
| `name` | VARCHAR(100) | NOT NULL | Item name (e.g., "Veg Puff") |
| `description` | TEXT | - | Optional item description |
| `price` | DECIMAL(10,2) | NOT NULL, > 0 | Item price in rupees |
| `is_available` | BOOLEAN | DEFAULT true | Currently available for ordering? |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When item was added |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Relationships
- **Belongs to ONE category:** `category_id` → `categories(category_id)`
  - If category is deleted, menu items are protected (RESTRICT)
  - If category_id is updated, change cascades to menu items

### Example Data
```sql
menu_item_id | category_id | name         | price | is_available
-------------|-------------|--------------|-------|-------------
1            | 1           | Veg Puff     | 25.00 | true
2            | 1           | Chicken Puff | 35.00 | true
3            | 2           | Masala Tea   | 15.00 | true
4            | 3           | Black Forest | 450.00| false
```

---

## 3️⃣ customers Table

**Purpose:** Store customer contact information for order tracking

### Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `customer_id` | SERIAL | PRIMARY KEY | Unique customer identifier |
| `name` | VARCHAR(100) | NOT NULL | Customer full name |
| `phone` | VARCHAR(15) | NOT NULL, UNIQUE | 10-15 digit phone number |
| `email` | VARCHAR(100) | UNIQUE, optional | Email address (nullable) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When customer registered |

### Business Rules
- Phone numbers must be unique (one account per phone)
- Email is optional but must be valid format if provided
- Phone must contain only digits (10-15 characters)

### Example Data
```sql
customer_id | name        | phone       | email
------------|-------------|-------------|-------------------
101         | John Doe    | 9876543210  | john@example.com
102         | Jane Smith  | 9123456789  | NULL
```

---

## 4️⃣ orders Table

**Purpose:** Store order header information and status

### Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `order_id` | SERIAL | PRIMARY KEY | Unique order identifier |
| `customer_id` | INTEGER | FOREIGN KEY → customers | Which customer placed this order |
| `order_date` | TIMESTAMP | DEFAULT NOW() | When order was placed |
| `total_amount` | DECIMAL(10,2) | NOT NULL, >= 0 | Total bill amount |
| `status` | ENUM | DEFAULT 'pending' | Current order status |
| `order_type` | ENUM | NOT NULL | Dine-in or Takeaway |
| `notes` | TEXT | - | Optional special instructions |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

### Enums
```sql
status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
order_type: 'dine-in' | 'takeaway'
```

### Status Workflow
```
pending → preparing → ready → delivered ✓
  ↓
cancelled ✗
```

### Relationships
- **Belongs to ONE customer:** `customer_id` → `customers(customer_id)`
  - Customers cannot be deleted if they have orders (RESTRICT)

### Example Data
```sql
order_id | customer_id | order_date          | total_amount | status    | order_type
---------|-------------|---------------------|--------------|-----------|------------
1        | 101         | 2025-11-14 10:30:00 | 65.00        | delivered | takeaway
2        | 102         | 2025-11-14 11:15:00 | 140.00       | preparing | dine-in
```

---

## 5️⃣ order_items Table (Junction Table)

**Purpose:** Store individual items within each order (resolves many-to-many relationship between orders and menu_items)

### Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `order_item_id` | SERIAL | PRIMARY KEY | Unique line item identifier |
| `order_id` | INTEGER | FOREIGN KEY → orders | Which order this item belongs to |
| `menu_item_id` | INTEGER | FOREIGN KEY → menu_items | Which menu item was ordered |
| `quantity` | INTEGER | NOT NULL, > 0 | How many of this item |
| `unit_price` | DECIMAL(10,2) | NOT NULL, > 0 | Price at time of order (price freeze) |
| `subtotal` | DECIMAL(10,2) | NOT NULL, > 0 | quantity × unit_price |

### Important Constraints
- `subtotal` MUST equal `quantity × unit_price` (enforced by CHECK constraint)
- UNIQUE constraint on `(order_id, menu_item_id)` - no duplicate items in same order

### Relationships
- **Belongs to ONE order:** `order_id` → `orders(order_id)`
  - If order is deleted, all its items are deleted too (CASCADE)
  
- **References ONE menu_item:** `menu_item_id` → `menu_items(menu_item_id)`
  - Menu items cannot be deleted if referenced in orders (RESTRICT)

### Why unit_price?
We store the price at the time of order (price freezing). Even if the menu item price changes later, historical orders remain accurate.

### Example Data
```sql
order_item_id | order_id | menu_item_id | quantity | unit_price | subtotal
--------------|----------|--------------|----------|------------|----------
1             | 1        | 1            | 2        | 25.00      | 50.00
2             | 1        | 3            | 1        | 15.00      | 15.00
3             | 2        | 2            | 4        | 35.00      | 140.00
```

**Order 1 total:** 50.00 + 15.00 = 65.00 ✓

---

## 🔗 Complete Relationship Summary

### One-to-Many Relationships

1. **categories → menu_items** (1:M)
   - One category has many menu items
   - Each menu item belongs to one category
   - Foreign Key: `menu_items.category_id`

2. **customers → orders** (1:M)
   - One customer places many orders
   - Each order belongs to one customer
   - Foreign Key: `orders.customer_id`

3. **orders → order_items** (1:M)
   - One order contains many order items
   - Each order item belongs to one order
   - Foreign Key: `order_items.order_id`

4. **menu_items → order_items** (1:M)
   - One menu item appears in many order items
   - Each order item references one menu item
   - Foreign Key: `order_items.menu_item_id`

### Many-to-Many (Resolved)
**orders ↔ menu_items** is resolved through the `order_items` junction table:
- One order can have many menu items
- One menu item can appear in many orders
- The junction table stores the quantity and price for each combination

---

## 🎯 Key Features

### Database Constraints
 Primary Keys on all tables  
 Foreign Keys with appropriate CASCADE/RESTRICT  
 CHECK constraints for business rules  
 UNIQUE constraints to prevent duplicates  
 NOT NULL constraints for required fields  

### Automatic Features
 Auto-incrementing IDs (SERIAL)  
 Timestamp tracking (created_at, updated_at)  
 Triggers for automatic timestamp updates  
 Enums for controlled values (status, order_type)  

### Data Integrity
 Prices must be positive  
 Quantities must be positive  
 Subtotals must match calculation  
 Phone numbers must be unique  
 Category names must be unique  

---

##  Sample Queries

### Get all menu items with category names
```sql
SELECT mi.name, mi.price, c.name as category
FROM menu_items mi
JOIN categories c ON mi.category_id = c.category_id
WHERE mi.is_available = true;
```

### Get complete order details
```sql
SELECT o.order_id, c.name as customer, mi.name as item, 
       oi.quantity, oi.subtotal
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
WHERE o.order_id = 1;
```

### Calculate daily sales
```sql
SELECT DATE(order_date) as date, 
       COUNT(*) as total_orders,
       SUM(total_amount) as total_revenue
FROM orders
WHERE status = 'delivered'
GROUP BY DATE(order_date);
```

---

## ️ Normalization Status

This schema is normalized to **Third Normal Form (3NF)**:

 **1NF:** All attributes are atomic, no repeating groups  
 **2NF:** No partial dependencies on composite keys  
 **3NF:** No transitive dependencies between non-key attributes  

See `Normalization-Steps.md` for detailed normalization process.

---

##  Ready for Implementation

This schema is ready to be:
- Converted into an ER Diagram
- Implemented in PostgreSQL
- Used as the foundation for the Restaurant Order Management System

**Total Tables:** 5  
**Total Relationships:** 4  
**Total Constraints:** 20+  
