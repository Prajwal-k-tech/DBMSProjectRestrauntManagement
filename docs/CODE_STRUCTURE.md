# Code Structure Documentation
## Restaurant Order Management System

This document explains the architecture, file organization, and code structure of the project.

---

## 📁 Directory Structure

```
dbmsproj/
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # Backend API routes
│   │   │   ├── categories/       # Category endpoints
│   │   │   ├── customers/        # Customer CRUD endpoints
│   │   │   │   └── [id]/         # Customer by ID
│   │   │   ├── menu/             # Menu item CRUD endpoints
│   │   │   │   └── [id]/         # Menu item by ID
│   │   │   ├── orders/           # Order CRUD endpoints
│   │   │   │   └── [id]/         # Order by ID
│   │   │   └── stats/            # Dashboard statistics
│   │   ├── customers/            # Customer management page
│   │   ├── menu/                 # Menu management page
│   │   ├── orders/               # Order management page
│   │   ├── globals.css           # Global styles (Catppuccin Mocha)
│   │   ├── layout.tsx            # Root layout with navigation
│   │   └── page.tsx              # Dashboard page
│   ├── lib/                      # Utility libraries
│   │   └── db.ts                 # PostgreSQL connection pool
│   └── types/                    # TypeScript type definitions
│       └── database.ts           # Database interface types
├── database/                     # Database files
│   ├── schema.sql                # Table definitions
│   └── seed-data.sql             # Sample data
├── docs/                         # Documentation
│   ├── Normalization-Steps.md    # Database normalization
│   ├── PROJECT.md                # Project requirements
│   └── SCHEMA.md                 # Database schema details
├── scripts/                      # Setup scripts
│   ├── install-postgresql.sh     # PostgreSQL installation
│   └── setup-database.sh         # Database initialization
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Node dependencies
```

---

## 🏗️ Architecture Overview

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Next.js 15.5.6 | Server & client components |
| **Backend** | Next.js API Routes | RESTful API with TypeScript |
| **Database** | PostgreSQL 16.10 | Relational database with constraints |
| **Styling** | Tailwind CSS 3.4.15 | Utility-first CSS framework |
| **Language** | TypeScript 5.6.3 | Type-safe development |
| **Theme** | Catppuccin Mocha | Dark mode color palette |

### **Design Patterns**

1. **Server-Side Rendering (SSR)**: Dashboard loads data on server
2. **Client-Side Rendering (CSR)**: Interactive pages use `'use client'`
3. **API-First Design**: Frontend calls backend via REST APIs
4. **Type Safety**: Shared types between frontend and backend
5. **Transaction Management**: Multi-step operations use BEGIN/COMMIT
6. **Connection Pooling**: Reusable database connections

---

## 📄 File-by-File Breakdown

### **Frontend Pages**

#### `src/app/page.tsx` - Dashboard
**Type**: Server Component (SSR)
**Purpose**: Display restaurant statistics and analytics

**Key Features**:
- 4 summary cards (total orders, revenue, customers, menu items)
- Orders by status chart
- Revenue by type breakdown
- Top selling items
- Recent orders list

**Data Fetching**: Direct database queries using `query()` function

**Code Structure**:
```typescript
async function Dashboard() {
  // Execute 8 parallel database queries
  const [stats, ordersByStatus, revenueByType, ...] = await Promise.all([...]);
  
  // Render dashboard UI with Catppuccin Mocha colors
  return <div>...</div>;
}
```

---

#### `src/app/menu/page.tsx` - Menu Management
**Type**: Client Component
**Purpose**: Browse, add, edit, delete menu items

**State Management**:
- `menuItems`: List of menu items from API
- `categories`: List of categories for filtering
- `selectedCategory`: Current filter
- `showModal`: Toggle add/edit modal
- `editingItem`: Item being edited (null for add)
- `formData`: Form inputs (name, category, price, description, availability)

**Key Features**:
- Category filter buttons
- Add menu item button (opens modal)
- Menu item cards with:
  - Item name, price, description
  - Availability badge (clickable toggle)
  - Edit button (opens modal with pre-filled data)
  - Delete button (confirms before deleting)
- Add/Edit modal form with validation

**API Calls**:
```typescript
fetchMenuItems()    // GET /api/menu?category_id=X
fetchCategories()   // GET /api/categories
handleSubmit()      // POST /api/menu OR PUT /api/menu/[id]
handleDelete()      // DELETE /api/menu/[id]
toggleAvailability() // PUT /api/menu/[id] (is_available toggle)
```

**Code Structure**:
```typescript
export default function MenuPage() {
  // State hooks
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  // ...

  // Data fetching
  const fetchMenuItems = async () => { /* ... */ };

  // CRUD operations
  const handleSubmit = async () => { /* POST or PUT */ };
  const handleDelete = async () => { /* DELETE */ };

  // UI rendering
  return (
    <div>
      {/* Header with Add button */}
      {/* Category filters */}
      {/* Menu items grid */}
      {/* Modal form */}
    </div>
  );
}
```

---

#### `src/app/orders/page.tsx` - Order Management
**Type**: Client Component
**Purpose**: View, create, update orders

**State Management**:
- `orders`: List of orders
- `statusFilter`: Filter by order status
- `showCreateModal`: Toggle create order modal
- `customers`: List for order creation dropdown
- `menuItems`: List for adding items to order
- `selectedCustomer`: Customer ID for new order
- `selectedItems`: Array of {menu_item_id, quantity, name, price}
- `orderType`: 'dine-in' or 'takeaway'
- `orderNotes`: Special instructions

**Key Features**:
- Create Order button (opens modal)
- Status filter buttons (All, Pending, Preparing, Ready, Delivered, Cancelled)
- Order cards showing:
  - Order ID, customer name, phone
  - Order date, type, item count
  - Total amount
  - Status badge
  - Status update dropdown
- Create order modal with:
  - Customer selection dropdown
  - Order type toggle (Dine-in/Takeaway)
  - Menu items grid (click to add)
  - Selected items list with quantity controls
  - Total calculation
  - Notes textarea

**API Calls**:
```typescript
fetchOrders()           // GET /api/orders?status=X
fetchCustomers()        // GET /api/customers
fetchMenuItems()        // GET /api/menu
createOrder()           // POST /api/orders
updateOrderStatus()     // PATCH /api/orders/[id]
```

**Complex Logic**:
```typescript
// Add item or increase quantity
const addItemToOrder = (menuItem) => {
  const existing = selectedItems.find(item => item.menu_item_id === menuItem.menu_item_id);
  if (existing) {
    // Increase quantity
    setSelectedItems(items.map(item => 
      item.menu_item_id === menuItem.menu_item_id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  } else {
    // Add new item
    setSelectedItems([...selectedItems, { ...menuItem, quantity: 1 }]);
  }
};

// Calculate total
const calculateTotal = () => {
  return selectedItems.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0
  );
};
```

---

#### `src/app/customers/page.tsx` - Customer Management
**Type**: Client Component
**Purpose**: View, search, add, edit customers

**State Management**:
- `customers`: List of customers with order stats
- `searchTerm`: Search input value
- `showModal`: Toggle add/edit modal
- `editingCustomer`: Customer being edited (null for add)
- `formData`: Form inputs (name, phone, email)

**Key Features**:
- Add Customer button (opens modal)
- Search bar (by name, phone, or email)
- Customer cards grid showing:
  - Customer avatar (first letter)
  - Name, ID, phone, email
  - Order count and total spent
  - Member since date
  - Edit button
- Add/Edit modal form with validation (10-digit phone)

**API Calls**:
```typescript
fetchCustomers()  // GET /api/customers?search=X
handleSubmit()    // POST /api/customers OR PUT /api/customers/[id]
```

---

### **Backend API Routes**

#### API Route Structure
All API routes follow Next.js App Router conventions:
- `route.ts` files export HTTP method handlers: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use `NextRequest` and `NextResponse` for request/response handling
- Return JSON with `{ success: boolean, data?: any, error?: string }`

---

#### `src/app/api/stats/route.ts` - Dashboard Statistics
**Method**: `GET`
**Purpose**: Aggregate statistics for dashboard

**Queries Executed**:
```typescript
// 1. Total orders
SELECT COUNT(*) FROM orders

// 2. Total revenue
SELECT SUM(total_amount) FROM orders WHERE status = 'delivered'

// 3. Total customers
SELECT COUNT(*) FROM customers

// 4. Total menu items
SELECT COUNT(*) FROM menu_items WHERE is_available = true

// 5. Orders by status
SELECT status, COUNT(*) FROM orders GROUP BY status

// 6. Revenue by order type
SELECT order_type, SUM(total_amount) FROM orders WHERE status = 'delivered' GROUP BY order_type

// 7. Top selling items
SELECT mi.name, SUM(oi.quantity) as sold
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
GROUP BY mi.name
ORDER BY sold DESC
LIMIT 5

// 8. Recent orders
SELECT o.*, c.name, c.phone
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
ORDER BY o.order_date DESC
LIMIT 5
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 8,
    "totalRevenue": "1234.56",
    "totalCustomers": 8,
    "totalMenuItems": 24,
    "ordersByStatus": [...],
    "revenueByType": [...],
    "topSellingItems": [...],
    "recentOrders": [...]
  }
}
```

---

#### `src/app/api/menu/route.ts` - Menu Items
**Methods**: `GET`, `POST`

**GET** - Fetch menu items
**Query Parameters**:
- `category_id`: Filter by category (optional)
- `available`: Filter by availability (optional)

**SQL**:
```sql
SELECT 
  mi.menu_item_id, mi.category_id, mi.name, mi.description,
  mi.price, mi.is_available, mi.created_at, mi.updated_at,
  c.name as category_name
FROM menu_items mi
JOIN categories c ON mi.category_id = c.category_id
WHERE 1=1
  AND mi.category_id = $1  -- if category_id provided
  AND mi.is_available = $2 -- if available provided
ORDER BY c.category_id, mi.name
```

**POST** - Create menu item
**Request Body**:
```json
{
  "category_id": 1,
  "name": "Veg Burger",
  "description": "Delicious veggie patty",
  "price": 80,
  "is_available": true
}
```

**Validation**:
- `category_id`, `name`, `price` are required
- `price` must be a positive number

**SQL**:
```sql
INSERT INTO menu_items (category_id, name, description, price, is_available)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
```

---

#### `src/app/api/menu/[id]/route.ts` - Single Menu Item
**Methods**: `GET`, `PUT`, `DELETE`

**GET** - Fetch single item
**SQL**:
```sql
SELECT mi.*, c.name as category_name
FROM menu_items mi
JOIN categories c ON mi.category_id = c.category_id
WHERE mi.menu_item_id = $1
```

**PUT** - Update menu item
**Request Body**: Same as POST
**SQL**:
```sql
UPDATE menu_items
SET 
  category_id = $1,
  name = $2,
  description = $3,
  price = $4,
  is_available = $5,
  updated_at = CURRENT_TIMESTAMP
WHERE menu_item_id = $6
RETURNING *
```

**DELETE** - Delete menu item
**Business Logic**: Check if item is referenced in any orders before deleting

**SQL**:
```sql
-- Check usage
SELECT COUNT(*) FROM order_items WHERE menu_item_id = $1

-- If count = 0, proceed with delete
DELETE FROM menu_items WHERE menu_item_id = $1 RETURNING *

-- If count > 0, return error:
{ 
  "success": false, 
  "error": "Cannot delete menu item. It is referenced in X order(s). Consider marking it as unavailable instead."
}
```

---

#### `src/app/api/orders/route.ts` - Orders
**Methods**: `GET`, `POST`

**GET** - Fetch orders
**Query Parameters**:
- `status`: Filter by status (optional)
- `customer_id`: Filter by customer (optional)

**SQL**:
```sql
SELECT 
  o.*,
  c.name as customer_name,
  c.phone as customer_phone,
  COUNT(oi.order_item_id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE 1=1
  AND o.status = $1        -- if status provided
  AND o.customer_id = $2   -- if customer_id provided
GROUP BY o.order_id, c.customer_id
ORDER BY o.order_date DESC
```

**POST** - Create order with items (Transaction)
**Request Body**:
```json
{
  "customer_id": 1,
  "order_type": "dine-in",
  "notes": "Extra spicy",
  "items": [
    { "menu_item_id": 5, "quantity": 2 },
    { "menu_item_id": 12, "quantity": 1 }
  ]
}
```

**Transaction Flow**:
```sql
BEGIN;

-- 1. Calculate total by fetching prices
SELECT price FROM menu_items WHERE menu_item_id = $1;  -- for each item

-- 2. Insert order
INSERT INTO orders (customer_id, total_amount, status, order_type, notes)
VALUES ($1, $2, 'pending', $3, $4)
RETURNING *;

-- 3. Insert order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;  -- for each item

COMMIT;
-- (ROLLBACK on any error)
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order_id": 9,
    "customer_id": 1,
    "total_amount": "180.00",
    "status": "pending",
    "order_type": "dine-in",
    "items": [
      {
        "order_item_id": 24,
        "menu_item_id": 5,
        "quantity": 2,
        "unit_price": "35.00",
        "subtotal": "70.00"
      }
    ]
  }
}
```

---

#### `src/app/api/orders/[id]/route.ts` - Single Order
**Methods**: `GET`, `PATCH`, `DELETE`

**GET** - Fetch order details with items
**SQL**:
```sql
-- Order details
SELECT o.*, c.name, c.phone, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_id = $1

-- Order items
SELECT oi.*, mi.name, mi.description, cat.name as category_name
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
JOIN categories cat ON mi.category_id = cat.category_id
WHERE oi.order_id = $1
```

**PATCH** - Update order status
**Request Body**:
```json
{
  "status": "preparing",
  "notes": "Rush order"
}
```

**Validation**: Status must be one of: `pending`, `preparing`, `ready`, `delivered`, `cancelled`

**SQL**:
```sql
UPDATE orders
SET 
  status = $1,
  notes = COALESCE($2, notes)
WHERE order_id = $3
RETURNING *
```

**DELETE** - Delete order with items (Transaction)
**SQL**:
```sql
BEGIN;

DELETE FROM order_items WHERE order_id = $1;
DELETE FROM orders WHERE order_id = $1 RETURNING *;

COMMIT;
```

---

#### `src/app/api/customers/route.ts` - Customers
**Methods**: `GET`, `POST`

**GET** - Fetch customers with stats
**Query Parameters**:
- `search`: Search by name, phone, or email (optional)

**SQL**:
```sql
SELECT 
  c.*,
  COUNT(o.order_id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE (c.name ILIKE $1 OR c.phone LIKE $1 OR c.email ILIKE $1)  -- if search provided
GROUP BY c.customer_id
ORDER BY c.name
```

**POST** - Create customer
**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com"
}
```

**Validation**:
- `name` and `phone` are required
- `phone` must be 10 digits
- `phone` must be unique (check before insert)

**SQL**:
```sql
-- Check uniqueness
SELECT customer_id FROM customers WHERE phone = $1

-- If not exists, insert
INSERT INTO customers (name, phone, email)
VALUES ($1, $2, $3)
RETURNING *
```

---

#### `src/app/api/customers/[id]/route.ts` - Single Customer
**Methods**: `GET`, `PUT`, `DELETE`

**GET** - Fetch customer with stats
**SQL**:
```sql
SELECT 
  c.*,
  COUNT(o.order_id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_spent,
  MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id = $1
GROUP BY c.customer_id
```

**PUT** - Update customer
**Request Body**: Same as POST (all fields optional)
**SQL**:
```sql
UPDATE customers
SET 
  name = COALESCE($1, name),
  phone = COALESCE($2, phone),
  email = COALESCE($3, email)
WHERE customer_id = $4
RETURNING *
```

**DELETE** - Delete customer
**Business Logic**: Check if customer has orders before deleting

**SQL**:
```sql
-- Check usage
SELECT COUNT(*) FROM orders WHERE customer_id = $1

-- If count = 0, proceed
DELETE FROM customers WHERE customer_id = $1 RETURNING *

-- If count > 0, return error:
{ "success": false, "error": "Cannot delete customer with existing orders" }
```

---

#### `src/app/api/categories/route.ts` - Categories
**Method**: `GET`

**Purpose**: Fetch all categories with item counts

**SQL**:
```sql
SELECT 
  c.*,
  COUNT(mi.menu_item_id) as item_count
FROM categories c
LEFT JOIN menu_items mi ON c.category_id = mi.category_id
GROUP BY c.category_id
ORDER BY c.name
```

---

### **Core Libraries**

#### `src/lib/db.ts` - Database Connection
**Purpose**: PostgreSQL connection pool management

**Configuration**:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'restaurant_user',
  password: 'restaurant123',
  database: 'restaurant_db',
  max: 20,        // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Key Functions**:
```typescript
// Execute query with parameters
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});
```

**Usage in API Routes**:
```typescript
import { query } from '@/lib/db';

const result = await query(
  'SELECT * FROM menu_items WHERE category_id = $1',
  [categoryId]
);
```

---

#### `src/types/database.ts` - TypeScript Types
**Purpose**: Shared type definitions for database entities

**Key Interfaces**:
```typescript
// Base entity types
export interface Category {
  category_id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface MenuItem {
  menu_item_id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  email: string | null;
  created_at: Date;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway';

export interface Order {
  order_id: number;
  customer_id: number;
  order_date: Date;
  total_amount: number;
  status: OrderStatus;
  order_type: OrderType;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// View types for joined queries
export interface MenuItemWithCategory extends MenuItem {
  category_name: string;
}

export interface OrderWithCustomer extends Order {
  customer_name: string;
  customer_phone: string;
}
```

**Usage**:
```typescript
import { MenuItem, OrderWithCustomer } from '@/types/database';

const menuItems: MenuItem[] = result.rows;
const orders: OrderWithCustomer[] = result.rows;
```

---

### **Styling**

#### `tailwind.config.js` - Tailwind Configuration
**Purpose**: Configure Tailwind CSS with Catppuccin Mocha colors

**Custom Colors**:
```javascript
theme: {
  extend: {
    colors: {
      mocha: {
        base: '#1e1e2e',      // Background
        mantle: '#181825',    // Secondary background
        crust: '#11111b',     // Tertiary background
        text: '#cdd6f4',      // Primary text
        subtext0: '#a6adc8',  // Secondary text
        subtext1: '#bac2de',  // Tertiary text
        surface0: '#313244',  // Card background
        surface1: '#45475a',  // Elevated surface
        surface2: '#585b70',  // Higher elevation
        overlay0: '#6c7086',  // Overlays
        blue: '#89b4fa',      // Primary actions
        green: '#a6e3a1',     // Success
        red: '#f38ba8',       // Errors
        yellow: '#f9e2af',    // Warnings
        mauve: '#cba6f7',     // Secondary actions
        pink: '#f5c2e7',      // Accents
        teal: '#94e2d5',      // Info
        // ... more colors
      }
    }
  }
}
```

**Usage**:
```tsx
<div className="bg-mocha-base text-mocha-text">
  <button className="bg-mocha-blue hover:bg-mocha-sapphire">
    Click me
  </button>
</div>
```

#### `src/app/globals.css` - Global Styles
**Purpose**: Global CSS with Tailwind directives

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply border-mocha-surface0;
}

body {
  @apply bg-mocha-base text-mocha-text antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-track {
  @apply bg-mocha-mantle;
}

::-webkit-scrollbar-thumb {
  @apply bg-mocha-surface1 rounded-lg;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-mocha-surface2;
}
```

---

### **Layout & Navigation**

#### `src/app/layout.tsx` - Root Layout
**Type**: Server Component
**Purpose**: Global layout with navigation

**Features**:
- Dark mode enabled by default
- Navigation bar with logo
- Active route highlighting
- Footer

**Structure**:
```tsx
<html lang="en" className="dark" suppressHydrationWarning>
  <body className="bg-mocha-base" suppressHydrationWarning>
    <nav>
      <Logo />
      <NavLinks />
    </nav>
    <main>
      {children}  {/* Page content */}
    </main>
    <footer>
      © 2024 Restaurant Management System
    </footer>
  </body>
</html>
```

**Navigation Links**:
```typescript
const navLinks = [
  { href: '/', label: 'Dashboard', icon: HomeIcon },
  { href: '/menu', label: 'Menu', icon: MenuIcon },
  { href: '/orders', label: 'Orders', icon: ShoppingCartIcon },
  { href: '/customers', label: 'Customers', icon: UsersIcon }
];
```

---

## 🗄️ Database Layer

### **Schema Overview**

**Tables** (5):
1. `categories` - Menu item categories
2. `menu_items` - Restaurant menu with prices
3. `customers` - Customer information
4. `orders` - Order headers
5. `order_items` - Order line items

**Relationships**:
```
categories (1) ──→ (N) menu_items
customers (1) ──→ (N) orders
orders (1) ──→ (N) order_items
menu_items (1) ──→ (N) order_items
```

### **Key Database Features**

1. **Foreign Keys**: All relationships enforced with `ON DELETE RESTRICT`
2. **Check Constraints**: 
   - `orders.total_amount > 0`
   - `order_items.quantity > 0`
   - `order_items.unit_price >= 0`
3. **Indexes**: On frequently queried columns (phone, order_date, status)
4. **Triggers**: Auto-update `updated_at` timestamps
5. **Views**: Pre-joined data for common queries

---

## 🔄 Data Flow Examples

### **Creating an Order**

1. **User Action**: Click "Create Order" button
2. **Modal Opens**: Fetch customers and menu items
   ```typescript
   GET /api/customers  // Returns all customers
   GET /api/menu       // Returns all menu items
   ```
3. **User Selects**: Customer, order type, adds items
4. **Frontend Calculates**: Total = Σ(price × quantity)
5. **Submit**: POST /api/orders
   ```typescript
   POST /api/orders
   Body: {
     customer_id: 1,
     order_type: "dine-in",
     items: [
       { menu_item_id: 5, quantity: 2 },
       { menu_item_id: 12, quantity: 1 }
     ],
     notes: "Extra spicy"
   }
   ```
6. **Backend Transaction**:
   ```sql
   BEGIN;
   -- 1. Get prices and calculate total
   SELECT price FROM menu_items WHERE menu_item_id IN (5, 12);
   
   -- 2. Insert order
   INSERT INTO orders (...) VALUES (...) RETURNING order_id;
   
   -- 3. Insert order items
   INSERT INTO order_items (...) VALUES (...);
   INSERT INTO order_items (...) VALUES (...);
   
   COMMIT;
   ```
7. **Response**: Order created successfully
8. **Frontend**: Close modal, refresh order list

---

### **Editing a Menu Item**

1. **User Action**: Click "Edit" on menu card
2. **Modal Opens**: Pre-fill form with current values
   ```typescript
   formData = {
     name: item.name,
     category_id: item.category_id,
     price: item.price,
     description: item.description,
     is_available: item.is_available
   }
   ```
3. **User Modifies**: Change price from ₹25 to ₹30
4. **Submit**: PUT /api/menu/[id]
   ```typescript
   PUT /api/menu/5
   Body: {
     name: "Veg Puff",
     category_id: 1,
     price: 30,
     description: "Crispy puff with spiced vegetables",
     is_available: true
   }
   ```
5. **Backend Update**:
   ```sql
   UPDATE menu_items
   SET name = $1, category_id = $2, price = $3, 
       description = $4, is_available = $5,
       updated_at = CURRENT_TIMESTAMP
   WHERE menu_item_id = $6
   RETURNING *;
   ```
6. **Response**: Updated menu item
7. **Frontend**: Close modal, refresh menu list

---

## 🛡️ Error Handling

### **API Error Responses**

All errors follow consistent format:
```json
{
  "success": false,
  "error": "User-friendly error message",
  "message": "Technical error details (optional)"
}
```

### **Common Errors**

| HTTP Status | Scenario | Example |
|-------------|----------|---------|
| **400 Bad Request** | Missing required fields | `"Name and phone are required"` |
| **404 Not Found** | Resource doesn't exist | `"Menu item not found"` |
| **409 Conflict** | Constraint violation | `"Phone number already registered"` |
| **409 Conflict** | Foreign key violation | `"Cannot delete customer with existing orders"` |
| **500 Internal Server Error** | Database error | `"Failed to fetch menu items"` |

### **Frontend Error Handling**

```typescript
try {
  const res = await fetch('/api/menu', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  
  const data = await res.json();
  
  if (data.success) {
    alert('Menu item created!');
  } else {
    alert('Error: ' + data.error);  // Show user-friendly message
  }
} catch (error) {
  console.error('Error:', error);
  alert('Network error. Please try again.');
}
```

---

## 🚀 Performance Optimizations

1. **Connection Pooling**: Reuse database connections (max 20)
2. **Indexes**: Fast lookups on phone, order_date, category_id
3. **Server Components**: Dashboard pre-rendered on server
4. **Lazy Loading**: Menu/orders/customers load data only when visited
5. **Transaction Batching**: Multi-step operations in single transaction
6. **JOIN Optimization**: Fetch related data in single query
7. **Parallel Queries**: Dashboard runs 8 queries concurrently

---

## 📦 Dependencies

### **Production**
```json
{
  "next": "15.5.6",           // React framework with SSR/API routes
  "react": "19.0.0",          // UI library
  "react-dom": "19.0.0",      // DOM renderer
  "pg": "8.13.1",             // PostgreSQL client
  "typescript": "5.6.3"       // Type safety
}
```

### **Development**
```json
{
  "tailwindcss": "3.4.15",    // Utility CSS framework
  "@types/node": "22.10.1",   // Node.js types
  "@types/react": "19.0.1",   // React types
  "eslint": "9.17.0",         // Code linting
  "postcss": "8.4.49"         // CSS processing
}
```

---

## 🧪 Testing Guide

### **Manual Testing Checklist**

#### Menu Management
- [ ] Add new menu item
- [ ] Edit existing item
- [ ] Delete item (should fail if used in orders)
- [ ] Toggle availability
- [ ] Filter by category

#### Order Management
- [ ] Create order with multiple items
- [ ] Update order status
- [ ] Filter orders by status
- [ ] View order details

#### Customer Management
- [ ] Add new customer
- [ ] Search customers
- [ ] Edit customer info
- [ ] Verify phone uniqueness

#### Dashboard
- [ ] View statistics
- [ ] Check charts render correctly
- [ ] Verify top selling items
- [ ] View recent orders

---

## 🎨 UI/UX Design Principles

1. **Consistency**: All pages follow same layout structure
2. **Feedback**: Loading states, success alerts, error messages
3. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
4. **Responsiveness**: Mobile-friendly grid layouts
5. **Dark Mode**: Catppuccin Mocha for reduced eye strain
6. **Color Coding**: Status badges with meaningful colors
   - Yellow: Pending
   - Blue: Preparing
   - Green: Ready/Delivered
   - Red: Cancelled

---

## 📚 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Catppuccin Theme**: https://github.com/catppuccin/catppuccin

---

*This documentation is generated for educational purposes. Last updated: November 2024*
