import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/orders - Fetch all orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const customerId = searchParams.get('customer_id');

    let sql = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.phone as customer_phone,
        COUNT(oi.order_item_id) as item_count
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      sql += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (customerId) {
      sql += ` AND o.customer_id = $${paramCount}`;
      params.push(parseInt(customerId));
      paramCount++;
    }

    sql += ` 
      GROUP BY o.order_id, c.customer_id
      ORDER BY o.order_date DESC
    `;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, order_type, items, notes } = body;

    // Validation
    if (!customer_id || !order_type || !items || items.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: customer_id, order_type, items' 
        },
        { status: 400 }
      );
    }

    // Begin transaction
    await query('BEGIN');

    try {
      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const menuItem = await query(
          'SELECT price FROM menu_items WHERE menu_item_id = $1',
          [item.menu_item_id]
        );
        
        if (menuItem.rows.length === 0) {
          throw new Error(`Menu item ${item.menu_item_id} not found`);
        }
        
        totalAmount += parseFloat(menuItem.rows[0].price) * item.quantity;
      }

      // Insert order
      const orderSql = `
        INSERT INTO orders (customer_id, total_amount, status, order_type, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const orderResult = await query(orderSql, [
        customer_id,
        totalAmount.toFixed(2),
        'pending',
        order_type,
        notes || null
      ]);

      const order = orderResult.rows[0];

      // Insert order items
      const orderItemsSql = `
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const orderItems = [];
      for (const item of items) {
        const menuItem = await query(
          'SELECT price FROM menu_items WHERE menu_item_id = $1',
          [item.menu_item_id]
        );
        
        const unitPrice = parseFloat(menuItem.rows[0].price);
        const subtotal = unitPrice * item.quantity;

        const itemResult = await query(orderItemsSql, [
          order.order_id,
          item.menu_item_id,
          item.quantity,
          unitPrice.toFixed(2),
          subtotal.toFixed(2)
        ]);

        orderItems.push(itemResult.rows[0]);
      }

      // Commit transaction
      await query('COMMIT');

      return NextResponse.json(
        {
          success: true,
          data: {
            ...order,
            items: orderItems
          },
          message: 'Order created successfully'
        },
        { status: 201 }
      );
    } catch (error) {
      // Rollback on error
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
