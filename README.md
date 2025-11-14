````markdown
# Restaurant Order Management System 🍽️
## DBMS Lab Project

**Status:** ✅ **100% COMPLETE** - All Tests Passed (20/20)

**Tech Stack:** Next.js 15.5.6 | TypeScript | PostgreSQL 16.10 | Tailwind CSS 3

**Quick Start:**
```bash
npm run dev              # Start dev server at http://localhost:3000
```

---

## 📊 Project Statistics

- **15 TypeScript Files** - Clean, modular code
- **8 API Endpoints** - RESTful with raw SQL
- **4 Frontend Pages** - Responsive UI
- **5 Database Tables** - Normalized to 3NF
- **384 Lines of SQL** - Schema + seed data
- **68 Database Rows** - Sample data for testing
- **100% Test Pass Rate** - All systems operational

---

## Requirement Analysis

### System Overview
The Restaurant Order Management System is a comprehensive database-driven application designed to streamline restaurant operations, focusing on order processing, menu management, and customer relationship management. This system serves as a back-office tool for restaurant staff (managers, cashiers, waiters) to efficiently handle day-to-day operations.

### Target Users
- **Restaurant Managers**: Oversee overall operations, manage menu items, view reports
- **Cashiers**: Process orders, handle billing, manage customer information
- **Waiters**: Take customer orders, update order status
- **Kitchen Staff**: View pending orders, update preparation status

### Core Functional Requirements

#### 1. Menu Management
**Purpose**: Maintain a dynamic, categorized menu with pricing and availability tracking.

**Key Features**:
- Create, Read, Update, Delete (CRUD) operations for menu items
- Organize menu items into categories (e.g., Puffs, Beverages, Desserts)
- Set and modify prices for individual items
- Toggle item availability (mark items as available/unavailable)
- Store item descriptions for customer reference

**Business Rules**:
- Each menu item must belong to exactly one category
- Item prices must be positive values
- Item names must be unique within their category
- Unavailable items should not appear in active order forms

#### 2. Customer Management
**Purpose**: Maintain customer records for order tracking and relationship management.

**Key Features**:
- Register new customers with contact information
- Store customer details: name, phone number, email
- View customer order history
- Track customer spending patterns

**Business Rules**:
- Phone numbers must be unique (one account per phone)
- Customer name is mandatory
- Email is optional but must be valid format if provided
- Customer records cannot be deleted if they have existing orders

#### 3. Order Processing
**Purpose**: Handle complete order lifecycle from placement to completion.

**Key Features**:
- Create new orders with multiple menu items
- Associate orders with customers
- Specify order type (Dine-in or Takeaway)
- Add multiple items with quantities to a single order
- Calculate order totals automatically
- Update order status through workflow stages
- Add notes/special instructions to orders

**Order Status Workflow**:
```
Pending → Preparing → Ready → Delivered
   ↓
Cancelled (can occur at any stage before delivery)
```

**Business Rules**:
- Every order must be linked to a customer
- Order must contain at least one item
- Quantity for each item must be positive
- Unit price is captured at order time (price freezing)
- Total amount must equal sum of all order items
- Order status follows defined workflow
- Cancelled orders retain historical data

#### 4. Billing and Payment Tracking
**Purpose**: Generate accurate bills and maintain financial records.

**Key Features**:
- Automatic bill generation based on order items
- Real-time total calculation
- Order summary with itemized breakdown
- Historical billing records

**Business Rules**:
- Bill total = sum of (quantity × unit_price) for all items
- Bills are immutable once order is completed
- Each order generates exactly one bill

#### 5. Reporting and Analytics (Optional/Basic)
**Purpose**: Provide insights into restaurant operations.

**Key Features**:
- Daily sales totals
- Popular menu items by order frequency
- Customer order counts
- Revenue by category

### Non-Functional Requirements

#### 1. Data Integrity
- Enforce referential integrity through foreign key constraints
- Prevent orphaned records
- Maintain data consistency across related tables
- Use transactions for multi-step operations

#### 2. Performance
- Index frequently queried columns (customer phone, order date, item availability)
- Optimize queries for order history and sales reports
- Use views for complex, frequently-accessed data combinations

#### 3. Usability
- Clean, intuitive user interface for staff
- Minimal training required for basic operations
- Clear error messages and validation feedback
- Mobile-responsive design for tablet use

#### 4. Scalability
- Database design supports growth in menu items, customers, and orders
- Normalized schema (3NF) prevents data redundancy
- Modular code structure allows feature additions

### System Constraints

#### Technical Constraints
- Database: PostgreSQL (local installation)
- Must use raw SQL queries (visible in codebase for academic requirements)
- Frontend: Minimal but functional web interface
- No authentication system (assumed trusted staff environment)

#### Business Constraints
- System is for staff use only (not customer-facing)
- Single-location restaurant (no multi-branch support)
- Cash-based operations (no online payment integration)
- English language only

### Out of Scope
The following features are explicitly excluded from this version:
- Customer-facing ordering interface (e.g., mobile app, kiosk)
- Online payment processing
- Delivery management and rider tracking
- Inventory/stock management
- Employee attendance and payroll
- Table reservation system
- Multi-location/franchise support
- Advanced analytics and business intelligence
- Customer loyalty programs
- Integration with third-party delivery platforms

### Success Criteria
The system will be considered successful if it:
1. ✅ Allows staff to create and manage orders efficiently
2. ✅ Maintains accurate menu with real-time availability
3. ✅ Stores complete customer and order history
4. ✅ Generates accurate bills automatically
5. ✅ Enforces all business rules through database constraints
6. ✅ Provides clear, normalized database schema (3NF)
7. ✅ Displays SQL implementation clearly for academic evaluation

---

## System Features Summary

| Module | Key Operations | User Role |
|--------|---------------|-----------|
| **Menu Management** | Add, Edit, Delete, View items | Manager |
| **Customer Management** | Register, View, Search customers | Cashier, Waiter |
| **Order Processing** | Create, Update, Cancel orders | Cashier, Waiter |
| **Order Status** | Update workflow status | Kitchen Staff, Waiter |
| **Billing** | View bills, Order totals | Cashier |
| **Reports** | Sales summary, Popular items | Manager |

---

## Use Case Examples

### Use Case 1: Taking a New Order
1. Waiter searches for existing customer or registers new customer
2. Creates new order, specifies order type (dine-in/takeaway)
3. Adds menu items with quantities to the order
4. System calculates total automatically
5. Order is placed with status "Pending"
6. Kitchen receives order notification

### Use Case 2: Managing Menu Items
1. Manager logs into system
2. Navigates to menu management
3. Adds new item: "Chocolate Croissant" under "Desserts" category
4. Sets price: ₹80
5. Item becomes available for ordering immediately

### Use Case 3: Processing Order Completion
1. Kitchen staff marks order as "Preparing"
2. Once ready, updates status to "Ready"
3. Waiter serves customer, marks as "Delivered"
4. System finalizes the order record
5. Bill is generated and stored

---

---

## 🚀 Quick Reference

### **API Endpoints**
```bash
# Dashboard stats
GET /api/stats

# Menu items
GET /api/menu?category_id=1&available=true
POST /api/menu
GET /api/menu/[id]

# Categories
GET /api/categories

# Orders
GET /api/orders?status=pending
POST /api/orders
GET /api/orders/[id]
PATCH /api/orders/[id]

# Customers
GET /api/customers
POST /api/customers
GET /api/customers/[id]
```

### **Frontend Pages**
- `/` - Dashboard with statistics
- `/menu` - Browse menu items
- `/orders` - View and manage orders
- `/customers` - Customer management

### **Database Commands**
```bash
# Connect to database
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db

# Common queries
SELECT * FROM categories;
SELECT * FROM menu_items WHERE is_available = true;
SELECT * FROM orders WHERE status = 'pending';
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # 8 API routes (Backend)
│   ├── menu/          # Menu page
│   ├── orders/        # Orders page
│   ├── customers/     # Customers page
│   ├── layout.tsx     # Navigation layout
│   └── page.tsx       # Dashboard
├── lib/
│   └── db.ts          # PostgreSQL connection
└── types/
    └── database.ts    # TypeScript types

database/
├── schema.sql         # Table definitions
└── seed-data.sql      # Sample data

docs/
├── INSTALLATION.md    # Setup guide
├── PROJECT.md         # Requirements
├── SCHEMA.md          # Database schema
└── PROJECT-SUMMARY.md # Complete summary
```

---

## 🎯 Key Features Implemented

✅ **Menu Management** - CRUD operations for menu items
✅ **Order Processing** - Create orders with transactions
✅ **Customer Management** - Track customer information
✅ **Dashboard Analytics** - Real-time statistics
✅ **Status Workflow** - Order status tracking
✅ **Price Freezing** - Capture prices at order time
✅ **Data Validation** - CHECK constraints and business rules
✅ **Performance** - Indexes on frequently queried columns
✅ **Type Safety** - Full TypeScript coverage

---

## 📚 Documentation

- **TESTING-REPORT.md** - Comprehensive test results (20 tests)
- **MANUAL-TESTING-GUIDE.md** - Step-by-step testing instructions
- **docs/INSTALLATION.md** - Complete setup guide
- **docs/SCHEMA.md** - Database schema documentation
- **docs/PROJECT-SUMMARY.md** - Full project overview

---

## 🛠️ Technologies

**Backend:**
- Next.js 15.5.6 (App Router, Server Components)
- TypeScript 5.6.3
- node-postgres (pg) 8.13.1

**Frontend:**
- React 19.0.0
- Tailwind CSS 3.4.15
- Client & Server Components

**Database:**
- PostgreSQL 16.10
- 5 tables normalized to 3NF
- Foreign keys, indexes, triggers, views

**Development:**
- npm scripts for database setup
- Hot reload development server
- ESLint for code quality

---

## 📈 Database Schema (3NF)

```
categories (5 rows)
    ↓
menu_items (24 rows)
    ↓
order_items (23 rows) ←→ orders (8 rows)
                              ↑
                         customers (8 rows)
```

**Total: 68 rows across 5 tables**

---

## 🔍 Sample Queries

```sql
-- Top selling items
SELECT mi.name, SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
GROUP BY mi.name
ORDER BY total_sold DESC
LIMIT 5;

-- Revenue by order type
SELECT order_type, SUM(total_amount) as revenue
FROM orders
WHERE status = 'delivered'
GROUP BY order_type;

-- Customer spending
SELECT c.name, COUNT(o.order_id) as orders, SUM(o.total_amount) as spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;
```

---

*Project completed and tested. Ready for submission. Due: November 15, 2025*

````
