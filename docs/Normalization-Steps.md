# Database Normalization Process

## Restaurant Order Management System

This document demonstrates the normalization of the database schema from an unnormalized form to Third Normal Form (3NF).

---

## Table of Contents
1. [Unnormalized Form (UNF)](#unnormalized-form-unf)
2. [First Normal Form (1NF)](#first-normal-form-1nf)
3. [Second Normal Form (2NF)](#second-normal-form-2nf)
4. [Third Normal Form (3NF)](#third-normal-form-3nf)
5. [Final Schema Summary](#final-schema-summary)

---

## Unnormalized Form (UNF)

### Initial Data Structure (Before Normalization)

Consider a typical restaurant order stored in a single flat structure:

```
Order Information:
├─ order_id: 1
├─ order_date: 2025-11-14 10:30:00
├─ customer_name: John Doe
├─ customer_phone: 9876543210
├─ customer_email: john@example.com
├─ order_status: delivered
├─ order_type: takeaway
├─ order_notes: Extra spicy
├─ items: [
│    {item_name: "Veg Puff", category: "Puffs", price: 25.00, quantity: 2},
│    {item_name: "Masala Tea", category: "Beverages", price: 15.00, quantity: 1}
│  ]
├─ total_amount: 65.00
```

**Problems with this structure:**
- **Repeating groups**: Multiple items in a single order (violates atomicity)
-  **Data redundancy**: Customer info repeated for every order
-  **Update anomalies**: Changing customer phone requires updating all their orders
-  **Insertion anomalies**: Cannot add a customer without an order
-  **Deletion anomalies**: Deleting an order removes customer information

---

## First Normal Form (1NF)

### Definition
> A table is in 1NF if:
> 1. All attributes contain **atomic (indivisible) values**
> 2. Each column contains values of a **single type**
> 3. Each row is **unique** (has a primary key)
> 4. No **repeating groups** or arrays

### Transformation to 1NF

**Step 1:** Eliminate repeating groups by creating a separate row for each item.

**Before (UNF):** One row with multiple items
```
Order(order_id, order_date, customer_name, phone, email, status, type, 
      items[item_name, category, price, quantity], total_amount)
```

**After (1NF):** Separate row for each order item
```
OrderData Table:
┌──────────┬─────────────┬───────────────┬──────────────┬────────────────────┬───────────┬────────────┬────────────┬───────────┬────────────┬────────┬──────────┐
│ order_id │ order_date  │ customer_name │ phone        │ email              │ status    │ order_type │ item_name  │ category  │ price      │ qty    │ subtotal │
├──────────┼─────────────┼───────────────┼──────────────┼────────────────────┼───────────┼────────────┼────────────┼───────────┼────────────┼────────┼──────────┤
│ 1        │ 2025-11-14  │ John Doe      │ 9876543210   │ john@example.com   │ delivered │ takeaway   │ Veg Puff   │ Puffs     │ 25.00      │ 2      │ 50.00    │
│ 1        │ 2025-11-14  │ John Doe      │ 9876543210   │ john@example.com   │ delivered │ takeaway   │ Masala Tea │ Beverages │ 15.00      │ 1      │ 15.00    │
└──────────┴─────────────┴───────────────┴──────────────┴────────────────────┴───────────┴────────────┴────────────┴───────────┴────────────┴────────┴──────────┘
```

**Primary Key:** Composite key `(order_id, item_name)`

** Achieved:**
- Each cell contains only atomic values
- No repeating groups
- Each row is unique

** Remaining Issues:**
- Data redundancy (customer info, order info repeated for each item)
- Partial dependencies exist (explained in 2NF)

---

## Second Normal Form (2NF)

### Definition
> A table is in 2NF if:
> 1. It is in **1NF**
> 2. All **non-key attributes** are fully functionally dependent on the **entire primary key** (no partial dependencies)

### Identifying Partial Dependencies

In our 1NF table with composite key `(order_id, item_name)`:

**Partial Dependencies (BAD):**
```
order_id → order_date, customer_name, phone, email, status, order_type
item_name → category, price
```

These attributes depend on **part** of the primary key, not the whole key.

**Full Dependencies (GOOD):**
```
(order_id, item_name) → quantity, subtotal
```

### Transformation to 2NF

**Step 2:** Decompose table to eliminate partial dependencies.

**Split into 3 tables:**

#### Table 1: Orders
```
orders(order_id, customer_name, phone, email, order_date, status, order_type, total_amount)
Primary Key: order_id
```

**Example Data:**
```
┌──────────┬───────────────┬──────────────┬────────────────────┬─────────────┬───────────┬────────────┬──────────────┐
│ order_id │ customer_name │ phone        │ email              │ order_date  │ status    │ order_type │ total_amount │
├──────────┼───────────────┼──────────────┼────────────────────┼─────────────┼───────────┼────────────┼──────────────┤
│ 1        │ John Doe      │ 9876543210   │ john@example.com   │ 2025-11-14  │ delivered │ takeaway   │ 65.00        │
└──────────┴───────────────┴──────────────┴────────────────────┴─────────────┴───────────┴────────────┴──────────────┘
```

#### Table 2: Menu Items
```
menu_items(item_name, category, price, is_available)
Primary Key: item_name
```

**Example Data:**
```
┌────────────┬───────────┬───────┬──────────────┐
│ item_name  │ category  │ price │ is_available │
├────────────┼───────────┼───────┼──────────────┤
│ Veg Puff   │ Puffs     │ 25.00 │ true         │
│ Masala Tea │ Beverages │ 15.00 │ true         │
└────────────┴───────────┴───────┴──────────────┘
```

#### Table 3: Order Items (Junction Table)
```
order_items(order_id, item_name, quantity, unit_price, subtotal)
Primary Key: (order_id, item_name)
Foreign Keys: order_id → orders(order_id)
              item_name → menu_items(item_name)
```

**Example Data:**
```
┌──────────┬────────────┬──────────┬────────────┬──────────┐
│ order_id │ item_name  │ quantity │ unit_price │ subtotal │
├──────────┼────────────┼──────────┼────────────┼──────────┤
│ 1        │ Veg Puff   │ 2        │ 25.00      │ 50.00    │
│ 1        │ Masala Tea │ 1        │ 15.00      │ 15.00    │
└──────────┴────────────┴──────────┴────────────┴──────────┘
```

** Achieved:**
- Eliminated partial dependencies
- Each non-key attribute depends on the full primary key

** Remaining Issues:**
- Transitive dependencies still exist (explained in 3NF)

---

## Third Normal Form (3NF)

### Definition
> A table is in 3NF if:
> 1. It is in **2NF**
> 2. No **transitive dependencies** exist (non-key attributes should not depend on other non-key attributes)

### Identifying Transitive Dependencies

In our `orders` table:
```
orders(order_id, customer_name, phone, email, order_date, status, order_type, total_amount)
```

**Transitive Dependency:**
```
order_id → customer_name
customer_name → phone, email

Therefore: order_id → phone, email (through customer_name)
```

**Problem:** Customer attributes (phone, email) depend on `customer_name`, which is not a candidate key.

In our `menu_items` table:
```
menu_items(item_name, category, price, is_available)
```

**Transitive Dependency:**
```
item_name → category
category → (category_description) if we had one
```

**Problem:** Category is repeated for multiple items, leading to redundancy.

### Transformation to 3NF

**Step 3:** Decompose tables to eliminate transitive dependencies.

#### Split Orders Table

**Before:**
```
orders(order_id, customer_name, phone, email, order_date, status, order_type, total_amount)
```

**After:**

**Table: customers**
```
customers(customer_id, name, phone, email, created_at)
Primary Key: customer_id
```

**Example Data:**
```
┌─────────────┬──────────┬────────────┬──────────────────┬─────────────┐
│ customer_id │ name     │ phone      │ email            │ created_at  │
├─────────────┼──────────┼────────────┼──────────────────┼─────────────┤
│ 101         │ John Doe │ 9876543210 │ john@example.com │ 2025-11-10  │
└─────────────┴──────────┴────────────┴──────────────────┴─────────────┘
```

**Table: orders (revised)**
```
orders(order_id, customer_id, order_date, total_amount, status, order_type, notes)
Primary Key: order_id
Foreign Key: customer_id → customers(customer_id)
```

**Example Data:**
```
┌──────────┬─────────────┬─────────────┬──────────────┬───────────┬────────────┐
│ order_id │ customer_id │ order_date  │ total_amount │ status    │ order_type │
├──────────┼─────────────┼─────────────┼──────────────┼───────────┼────────────┤
│ 1        │ 101         │ 2025-11-14  │ 65.00        │ delivered │ takeaway   │
└──────────┴─────────────┴─────────────┴──────────────┴───────────┴────────────┘
```

#### Split Menu Items Table

**Before:**
```
menu_items(item_name, category, price, is_available)
```

**After:**

**Table: categories**
```
categories(category_id, name, description, created_at)
Primary Key: category_id
```

**Example Data:**
```
┌─────────────┬───────────┬──────────────────────────────┐
│ category_id │ name      │ description                  │
├─────────────┼───────────┼──────────────────────────────┤
│ 1           │ Puffs     │ Savory baked pastries        │
│ 2           │ Beverages │ Hot and cold drinks          │
└─────────────┴───────────┴──────────────────────────────┘
```

**Table: menu_items (revised)**
```
menu_items(menu_item_id, category_id, name, description, price, is_available)
Primary Key: menu_item_id
Foreign Key: category_id → categories(category_id)
```

**Example Data:**
```
┌──────────────┬─────────────┬────────────┬──────────────────────────┬───────┬──────────────┐
│ menu_item_id │ category_id │ name       │ description              │ price │ is_available │
├──────────────┼─────────────┼────────────┼──────────────────────────┼───────┼──────────────┤
│ 1            │ 1           │ Veg Puff   │ Vegetable-filled puff    │ 25.00 │ true         │
│ 2            │ 2           │ Masala Tea │ Spiced Indian tea        │ 15.00 │ true         │
└──────────────┴─────────────┴────────────┴──────────────────────────┴───────┴──────────────┘
```

#### Update Order Items Table

**Table: order_items (revised)**
```
order_items(order_item_id, order_id, menu_item_id, quantity, unit_price, subtotal)
Primary Key: order_item_id
Foreign Keys: order_id → orders(order_id)
              menu_item_id → menu_items(menu_item_id)
```

**Example Data:**
```
┌───────────────┬──────────┬──────────────┬──────────┬────────────┬──────────┐
│ order_item_id │ order_id │ menu_item_id │ quantity │ unit_price │ subtotal │
├───────────────┼──────────┼──────────────┼──────────┼────────────┼──────────┤
│ 1             │ 1        │ 1            │ 2        │ 25.00      │ 50.00    │
│ 2             │ 1        │ 2            │ 1        │ 15.00      │ 15.00    │
└───────────────┴──────────┴──────────────┴──────────┴────────────┴──────────┘
```

** Achieved:**
- Eliminated all transitive dependencies
- Each table represents a single entity
- Minimal data redundancy
- Better data integrity

---

## Final Schema Summary

### Normalized Tables (3NF)

1. **categories**
   - Primary Key: `category_id`
   - Attributes: `name`, `description`, `created_at`
   - Purpose: Store menu categories

2. **menu_items**
   - Primary Key: `menu_item_id`
   - Foreign Key: `category_id` → `categories`
   - Attributes: `name`, `description`, `price`, `is_available`
   - Purpose: Store menu items with pricing

3. **customers**
   - Primary Key: `customer_id`
   - Attributes: `name`, `phone`, `email`, `created_at`
   - Purpose: Store customer information

4. **orders**
   - Primary Key: `order_id`
   - Foreign Key: `customer_id` → `customers`
   - Attributes: `order_date`, `total_amount`, `status`, `order_type`, `notes`
   - Purpose: Store order headers

5. **order_items**
   - Primary Key: `order_item_id`
   - Foreign Keys: `order_id` → `orders`, `menu_item_id` → `menu_items`
   - Attributes: `quantity`, `unit_price`, `subtotal`
   - Purpose: Store individual items in each order (junction table)

### Relationships

```
categories (1) ──────< (M) menu_items
                           
customers (1) ───────< (M) orders
                           
orders (1) ──────────< (M) order_items
                           
menu_items (1) ──────< (M) order_items
```

### Benefits of 3NF Schema

 **No Data Redundancy**: Each piece of information stored once  
 **No Update Anomalies**: Updating data is consistent  
 **No Insertion Anomalies**: Can add entities independently  
 **No Deletion Anomalies**: Deleting data doesn't lose unrelated information  
 **Data Integrity**: Enforced through foreign keys and constraints  
 **Scalability**: Easy to extend with new features  
 **Query Performance**: Properly indexed for common operations  

---

## Verification Checklist

### 1NF Verification 
- [x] All attributes are atomic
- [x] No repeating groups
- [x] Each table has a primary key
- [x] Columns contain values of same type

### 2NF Verification 
- [x] Table is in 1NF
- [x] No partial dependencies
- [x] All non-key attributes fully depend on primary key

### 3NF Verification 
- [x] Table is in 2NF
- [x] No transitive dependencies
- [x] Non-key attributes don't depend on other non-key attributes

---

## Conclusion

The database schema has been successfully normalized to **Third Normal Form (3NF)**, ensuring:
- Minimal redundancy
- Maximum data integrity
- Efficient query performance
- Maintainability and scalability

This normalized structure forms the foundation of the Restaurant Order Management System.
