import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stats - Get dashboard statistics
export async function GET() {
  try {
    // Total orders
    const ordersResult = await query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Total revenue
    const revenueResult = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE status = 'delivered'
    `);
    const totalRevenue = parseFloat(revenueResult.rows[0].revenue);

    // Total customers
    const customersResult = await query('SELECT COUNT(*) as count FROM customers');
    const totalCustomers = parseInt(customersResult.rows[0].count);

    // Total menu items
    const menuResult = await query('SELECT COUNT(*) as count FROM menu_items WHERE is_available = true');
    const totalMenuItems = parseInt(menuResult.rows[0].count);

    // Orders by status
    const statusResult = await query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
      ORDER BY status
    `);

    // Top selling items
    const topItemsResult = await query(`
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
      LIMIT 5
    `);

    // Recent orders
    const recentOrdersResult = await query(`
      SELECT 
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status,
        c.name as customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
      LIMIT 10
    `);

    // Revenue by order type
    const orderTypeResult = await query(`
      SELECT 
        order_type,
        COUNT(*) as count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status = 'delivered'
      GROUP BY order_type
    `);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          totalCustomers,
          totalMenuItems
        },
        ordersByStatus: statusResult.rows,
        topSellingItems: topItemsResult.rows,
        recentOrders: recentOrdersResult.rows,
        revenueByType: orderTypeResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
