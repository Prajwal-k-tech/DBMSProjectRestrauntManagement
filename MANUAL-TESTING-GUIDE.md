# Manual Testing Guide
## Restaurant Order Management System

This guide will help you manually test all features of the system.

---

## Prerequisites

1. **PostgreSQL** must be running:
   ```bash
   sudo systemctl status postgresql
   ```

2. **Dev server** must be running:
   ```bash
   npm run dev
   ```
   Should show: `✓ Ready on http://localhost:3000`

---

## 1. Database Testing

### Test 1.1: Verify Database Connection
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "SELECT 'Connected successfully!' as status;"
```
**Expected:** Should show "Connected successfully!"

### Test 1.2: Check All Tables
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "\dt"
```
**Expected:** Should list 5 tables (categories, customers, menu_items, order_items, orders)

### Test 1.3: Verify Data Counts
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT 'categories' as table_name, COUNT(*) as count FROM categories UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items UNION ALL
SELECT 'customers', COUNT(*) FROM customers UNION ALL
SELECT 'orders', COUNT(*) FROM orders UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;
"
```
**Expected:**
- categories: 5
- menu_items: 24
- customers: 8
- orders: 8
- order_items: 23

---

## 2. API Endpoint Testing

### Test 2.1: Dashboard Stats API
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```
**Expected:**
- success: true
- totalOrders: 8
- totalRevenue: "840.00"
- totalCustomers: 8
- totalMenuItems: 23
- 5 order statuses
- 5 top selling items
- Recent orders list

### Test 2.2: Menu API
```bash
curl -s http://localhost:3000/api/menu | python3 -m json.tool | head -30
```
**Expected:**
- success: true
- 24 menu items
- Each item has: menu_item_id, name, description, price, category_name, is_available

### Test 2.3: Categories API
```bash
curl -s http://localhost:3000/api/categories | python3 -m json.tool
```
**Expected:**
- success: true
- 5 categories
- Each has: category_id, name, description, item_count
- Sorted alphabetically

### Test 2.4: Orders API
```bash
curl -s http://localhost:3000/api/orders | python3 -m json.tool | head -40
```
**Expected:**
- success: true
- 8 orders
- Each has: order_id, customer_name, customer_phone, status, total_amount, item_count
- Sorted by order_date DESC

### Test 2.5: Customers API
```bash
curl -s http://localhost:3000/api/customers | python3 -m json.tool | head -30
```
**Expected:**
- success: true
- 8 customers
- Each has: customer_id, name, phone, email, order_count, total_spent
- Sorted alphabetically by name

### Test 2.6: Single Menu Item API
```bash
curl -s http://localhost:3000/api/menu/1 | python3 -m json.tool
```
**Expected:**
- success: true
- Single menu item details

### Test 2.7: Single Order API
```bash
curl -s http://localhost:3000/api/orders/1 | python3 -m json.tool
```
**Expected:**
- success: true
- Order details with items array

### Test 2.8: Single Customer API
```bash
curl -s http://localhost:3000/api/customers/1 | python3 -m json.tool
```
**Expected:**
- success: true
- Customer details with order_count and total_spent

---

## 3. Browser Testing

### Test 3.1: Dashboard Page
1. Open browser: http://localhost:3000
2. **Check:**
   - ✅ Navigation bar appears with logo and 4 links
   - ✅ 4 summary cards show (Orders, Revenue, Customers, Menu Items)
   - ✅ "Orders by Status" chart displays 5 statuses with counts
   - ✅ "Revenue by Order Type" shows dine-in and takeaway
   - ✅ "Top Selling Items" lists 5 items with quantities
   - ✅ "Recent Orders" shows 5 orders with status badges
   - ✅ Footer appears at bottom

### Test 3.2: Menu Page
1. Click "Menu" in navigation
2. **Check:**
   - ✅ URL changes to http://localhost:3000/menu
   - ✅ Title "Menu" appears
   - ✅ Category filter buttons appear (All Items, Puffs, Samosas, etc.)
   - ✅ Menu items load and display in groups by category
   - ✅ Each item shows: name, description, price, availability badge
   - ✅ Can click category filters to filter items

### Test 3.3: Orders Page
1. Click "Orders" in navigation
2. **Check:**
   - ✅ URL changes to http://localhost:3000/orders
   - ✅ Title "Orders" appears
   - ✅ Status filter buttons appear (All, pending, preparing, ready, delivered, cancelled)
   - ✅ Order list loads with all 8 orders
   - ✅ Each order shows: order #, customer name, date/time, amount, status badge
   - ✅ Can click status filters to filter orders
   - ✅ Status dropdown appears for each order
   - ✅ Can change order status (updates immediately)

### Test 3.4: Customers Page
1. Click "Customers" in navigation
2. **Check:**
   - ✅ URL changes to http://localhost:3000/customers
   - ✅ Title "Customers" appears
   - ✅ Search bar appears
   - ✅ Customer cards load (8 customers)
   - ✅ Each card shows: name (with gradient avatar), phone, email, orders count, total spent
   - ✅ Search works (try typing a name)

### Test 3.5: Navigation
1. **Check all navigation links work:**
   - Click "Dashboard" → Goes to /
   - Click "Menu" → Goes to /menu
   - Click "Orders" → Goes to /orders
   - Click "Customers" → Goes to /customers
   - Click logo → Goes to /

### Test 3.6: Responsive Design
1. **Resize browser window (narrow to wide)**
2. **Check:**
   - ✅ Layout adapts to screen size
   - ✅ Navigation remains accessible
   - ✅ Cards stack vertically on mobile
   - ✅ Text remains readable

---

## 4. SQL Query Testing

### Test 4.1: Complex JOIN Query
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT 
  o.order_id,
  c.name as customer_name,
  o.order_date,
  o.total_amount,
  o.status,
  COUNT(oi.order_item_id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, c.customer_id
ORDER BY o.order_date DESC;
"
```
**Expected:** 8 rows with customer names and item counts

### Test 4.2: Aggregation Query
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT 
  c.name as category,
  COUNT(mi.menu_item_id) as item_count,
  AVG(mi.price) as avg_price
FROM categories c
LEFT JOIN menu_items mi ON c.category_id = mi.category_id
GROUP BY c.category_id, c.name
ORDER BY c.name;
"
```
**Expected:** 5 categories with counts and average prices

### Test 4.3: Top Selling Items Query
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT 
  mi.name,
  c.name as category,
  SUM(oi.quantity) as total_sold,
  SUM(oi.subtotal) as revenue
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
JOIN categories c ON mi.category_id = c.category_id
GROUP BY mi.menu_item_id, mi.name, c.name
ORDER BY total_sold DESC
LIMIT 5;
"
```
**Expected:** Top 5 items: Veg Samosa (11), Chicken Puff (10), Veg Puff (9), Coffee (8), Chicken Samosa (5)

### Test 4.4: Customer Statistics Query
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT 
  c.name,
  c.phone,
  COUNT(o.order_id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
ORDER BY total_spent DESC;
"
```
**Expected:** 8 customers with their order counts and total spending

### Test 4.5: View Query
```bash
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -c "
SELECT * FROM vw_order_details LIMIT 5;
"
```
**Expected:** Denormalized order view with all details

---

## 5. Data Modification Testing

### Test 5.1: Create Menu Item (API)
```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "name": "Test Puff",
    "description": "Testing new item",
    "price": 30,
    "is_available": true
  }' | python3 -m json.tool
```
**Expected:** success: true, returns new item with menu_item_id

### Test 5.2: Update Order Status (API)
```bash
curl -X PATCH http://localhost:3000/api/orders/7 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}' | python3 -m json.tool
```
**Expected:** success: true, order status updated

### Test 5.3: Search Customers (API)
```bash
curl -s "http://localhost:3000/api/customers?search=Rajesh" | python3 -m json.tool
```
**Expected:** success: true, returns matching customers

---

## 6. Error Handling Testing

### Test 6.1: Invalid Menu Item ID
```bash
curl -s http://localhost:3000/api/menu/999 | python3 -m json.tool
```
**Expected:** error: "Menu item not found"

### Test 6.2: Invalid Order Status
```bash
curl -X PATCH http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid_status"}' | python3 -m json.tool
```
**Expected:** error: "Invalid order status"

### Test 6.3: Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}' | python3 -m json.tool
```
**Expected:** error: "Missing required fields"

---

## 7. Performance Testing

### Test 7.1: Dashboard Load Time
```bash
time curl -s http://localhost:3000/api/stats > /dev/null
```
**Expected:** < 2 seconds

### Test 7.2: Menu Load Time
```bash
time curl -s http://localhost:3000/api/menu > /dev/null
```
**Expected:** < 500ms

### Test 7.3: Multiple Concurrent Requests
```bash
for i in {1..10}; do curl -s http://localhost:3000/api/stats > /dev/null & done; wait
```
**Expected:** All complete successfully

---

## 8. Screenshot Checklist

For your project report, capture these screenshots:

### Database Screenshots
- [ ] 1. pgAdmin/psql showing all 5 tables
- [ ] 2. Sample data from menu_items table
- [ ] 3. Sample data from orders table with JOIN
- [ ] 4. Result of top selling items query

### Application Screenshots
- [ ] 5. Dashboard page (full view)
- [ ] 6. Dashboard summary cards (close-up)
- [ ] 7. Dashboard charts section
- [ ] 8. Menu page with category filters
- [ ] 9. Menu items grouped by category
- [ ] 10. Orders page with status filters
- [ ] 11. Orders list with different status badges
- [ ] 12. Order status dropdown (open)
- [ ] 13. Customers page with search bar
- [ ] 14. Customer cards with statistics

### API Screenshots (Postman/Thunder Client)
- [ ] 15. GET /api/stats response
- [ ] 16. GET /api/menu response
- [ ] 17. GET /api/orders response
- [ ] 18. GET /api/customers response
- [ ] 19. POST /api/menu (create item)
- [ ] 20. PATCH /api/orders/[id] (update status)

---

## 9. Common Issues & Solutions

### Issue: "Connection refused" error
**Solution:** 
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# If not running, start it
sudo systemctl start postgresql
```

### Issue: "Database does not exist"
**Solution:**
```bash
# Recreate database
sudo -u postgres psql -c "CREATE DATABASE restaurant_db OWNER restaurant_user;"
# Re-run schema
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -f database/schema.sql
PGPASSWORD=restaurant123 psql -h localhost -U restaurant_user -d restaurant_db -f database/seed-data.sql
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

### Issue: Pages show loading spinner forever
**Solution:**
- Check if dev server is running
- Open browser console (F12) to see JavaScript errors
- Check if API endpoints are responding

---

## 10. Final Verification Checklist

Before submitting, verify:

- [ ] ✅ PostgreSQL is running
- [ ] ✅ Database has all 5 tables
- [ ] ✅ All tables have correct row counts
- [ ] ✅ Dev server starts without errors
- [ ] ✅ All 5 API endpoints return success: true
- [ ] ✅ Dashboard page loads with all data
- [ ] ✅ Menu page shows 24 items
- [ ] ✅ Orders page shows 8 orders
- [ ] ✅ Customers page shows 8 customers
- [ ] ✅ Navigation works between all pages
- [ ] ✅ Search functionality works
- [ ] ✅ Filter functionality works
- [ ] ✅ Order status update works
- [ ] ✅ No console errors in browser
- [ ] ✅ All screenshots captured
- [ ] ✅ TESTING-REPORT.md created
- [ ] ✅ PROJECT-SUMMARY.md exists
- [ ] ✅ README.md is complete
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ ER diagram received from teammate

---

## Success Criteria

✅ **ALL TESTS PASS** = System is ready for submission!

**Timestamp:** Run this command to log test completion:
```bash
echo "Testing completed at $(date)" >> testing-log.txt
```

---

**Happy Testing! 🎉**

If all tests pass, you're ready to submit your DBMS project!
