# Restaurant Order Management System

A comprehensive database-driven restaurant management system built with Next.js, TypeScript, and PostgreSQL. Features full CRUD operations for menu management, order processing, and customer relationship management.

## Live Demo

**[View Live Application →](https://restaurantmanagement-livid.vercel.app/)**

Deployed on Vercel with Supabase PostgreSQL database.

---

## Features

- **Real-time Dashboard** - Live statistics and analytics
- **Menu Management** - Add, edit, and manage menu items with categories
- **Order Processing** - Complete order lifecycle management (Pending → Preparing → Ready → Delivered)
- **Customer Management** - Track customer information and order history
- **Automated Billing** - Automatic price calculation and order totals
- **Modern UI** - Beautiful dark theme with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Normalized Database** - PostgreSQL schema in 3NF with proper relationships

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15.5.6, React 19, TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4 |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL 16.10 (Supabase) |
| **Deployment** | Vercel (Frontend + API), Supabase (Database) |
| **ORM** | Raw SQL with node-postgres (pg) |

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Prajwal-k-tech/DBMSProjectRestrauntManagement.git
cd DBMSProjectRestrauntManagement

# Install dependencies
npm install

# Set up environment variables
echo "DATABASE_URL=your_postgresql_connection_string" > .env.local

# Run database setup (creates tables and seeds data)
cd scripts
./setup-database.sh

# Start development server
cd ..
npm run dev

Open your browser to `http://localhost:3000`

---

## Project Statistics

- **100% Complete** - All features operational
- **8 API Endpoints** - RESTful with raw SQL
- **4 Frontend Pages** - Fully responsive
- **5 Database Tables** - Normalized to 3NF  
- **384 Lines of SQL** - Schema + seed data
- **68 Database Rows** - Sample data included

---

## Architecture

### Database Schema (3NF)

```
┌─────────────┐
│ categories  │ (5 rows)
└──────┬──────┘
       │
       ↓
┌─────────────┐      ┌─────────────┐
│ menu_items  │←────→│ order_items │
│  (24 rows)  │      │  (23 rows)  │
└─────────────┘      └──────┬──────┘
                            │
                            ↓
                     ┌─────────────┐      ┌─────────────┐
                     │   orders    │←────→│  customers  │
                     │  (8 rows)   │      │  (6 rows)   │
                     └─────────────┘      └─────────────┘
```

**Key Relationships:**
- One category has many menu items
- One order has many order items
- One customer has many orders
- Each order item references one menu item (price freezing)

### API Structure

```
/api
├── /stats          GET - Dashboard statistics
├── /categories     GET - List all categories
├── /menu           GET, POST - Menu items CRUD
│   └── /[id]      GET, PATCH, DELETE - Single item operations
├── /orders         GET, POST - Order management
│   └── /[id]      GET, PATCH, DELETE - Single order operations
└── /customers      GET, POST - Customer management
    └── /[id]      GET, PATCH, DELETE - Single customer operations
```

---

## Application Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Real-time stats, revenue, order counts |
| **Menu** | `/menu` | Browse, add, edit menu items by category |
| **Orders** | `/orders` | Create orders, update status, view history |
| **Customers** | `/customers` | Manage customer information and search |

---

## Key Features

### Menu Management
- CRUD operations for menu items
- Category-based organization
- Availability toggle (in-stock/out-of-stock)
- Price validation (positive values only)
- Duplicate prevention within categories

### Order Processing  
- Multi-item order creation
- Order type selection (Dine-in/Takeaway)
- Status workflow: Pending → Preparing → Ready → Delivered
- Automated total calculation
- Price freezing (captures menu price at order time)
- Order notes and special instructions

### Customer Management
- Customer registration with validation
- Unique phone number constraint
- Search by name, phone, or email
- Order history per customer
- Foreign key protection (prevents deletion with active orders)

### Business Intelligence
- Total revenue tracking
- Order count by status
- Customer statistics
- Menu item availability tracking



---

## Project Structure

```
dbmsproj/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API Routes
│   │   │   ├── categories/   # GET categories
│   │   │   ├── customers/    # Customer CRUD + [id] routes
│   │   │   ├── menu/         # Menu CRUD + [id] routes
│   │   │   ├── orders/       # Order CRUD + [id] routes
│   │   │   └── stats/        # Dashboard statistics
│   │   ├── customers/        # Customer management page
│   │   ├── menu/             # Menu management page
│   │   ├── orders/           # Order management page
│   │   ├── layout.tsx        # Root layout with navigation
│   │   ├── page.tsx          # Dashboard homepage
│   │   └── globals.css       # Tailwind + custom styles
│   ├── lib/
│   │   └── db.ts             # PostgreSQL connection pool
│   └── types/
│       └── database.ts       # TypeScript interfaces
├── database/
│   ├── schema.sql            # Table definitions (CREATE TABLE)
│   └── seed-data.sql         # Sample data (INSERT statements)
├── docs/
│   ├── CODE_STRUCTURE.md     # File-by-file code explanation
│   ├── Normalization-Steps.md # Database normalization process
│   ├── PROJECT.md            # Requirements analysis
│   └── SCHEMA.md             # Database design documentation
└── scripts/
    ├── install-postgresql.sh # PostgreSQL installation script
    └── setup-database.sh     # Database initialization script
```

---

## Documentation

Comprehensive documentation available in the `docs/` folder:

| Document | Description |
|----------|-------------|
| **[PROJECT.md](docs/PROJECT.md)** | Complete requirements analysis and use cases |
| **[SCHEMA.md](docs/SCHEMA.md)** | Database design with ER diagram |
| **[CODE_STRUCTURE.md](docs/CODE_STRUCTURE.md)** | File-by-file code walkthrough |
| **[Normalization-Steps.md](docs/Normalization-Steps.md)** | Database normalization (UNF → 3NF) |

---

## Sample SQL Queries

```sql
-- Top 5 selling items
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

-- Customer spending patterns
SELECT c.name, COUNT(o.order_id) as total_orders, 
       COALESCE(SUM(o.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_spent DESC;
```

---

## Deployment

This application is deployed using:

- **Frontend + API**: [Vercel](https://vercel.com) - Serverless Next.js hosting
- **Database**: [Supabase](https://supabase.com) - Managed PostgreSQL with connection pooling
- **Live URL**: https://restaurantmanagement-livid.vercel.app/

### Environment Variables

```bash
DATABASE_URL=postgresql://username:password@host:6543/database
```

**Note**: Ensure you use the **Pooler connection string** (port 6543) for serverless deployments, not the direct connection (port 5432).

---

## Contributing

This is an academic project for DBMS Lab. For issues or suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is part of an academic assignment for Database Management Systems Lab.

---

## Author

**Prajwal K**  
Email: [Your Email]  
GitHub: [@Prajwal-k-tech](https://github.com/Prajwal-k-tech)

---

## Acknowledgments

- Built as part of DBMS Lab curriculum
- Uses [Catppuccin Mocha](https://github.com/catppuccin/catppuccin) color scheme
- Deployed on Vercel and Supabase infrastructure

---

<div align="center">

**Star this repository if you found it helpful!**

[Live Demo](https://restaurantmanagement-livid.vercel.app/) • [Documentation](docs/) • [Report Bug](https://github.com/Prajwal-k-tech/DBMSProjectRestrauntManagement/issues)

</div>

````
