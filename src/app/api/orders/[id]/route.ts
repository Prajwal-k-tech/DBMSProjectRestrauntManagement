import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/orders/[id] - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Get order details
    const orderSql = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = $1
    `;

    const orderResult = await query(orderSql, [orderId]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const itemsSql = `
      SELECT 
        oi.*,
        mi.name as item_name,
        mi.description as item_description,
        c.name as category_name
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
      JOIN categories c ON mi.category_id = c.category_id
      WHERE oi.order_id = $1
      ORDER BY oi.order_item_id
    `;

    const itemsResult = await query(itemsSql, [orderId]);

    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows
    };

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const sql = `
      UPDATE orders
      SET 
        status = $1,
        notes = COALESCE($2, notes)
      WHERE order_id = $3
      RETURNING *
    `;

    const result = await query(sql, [status, notes || null, orderId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    await query('BEGIN');

    try {
      // Delete order items first (foreign key constraint)
      await query('DELETE FROM order_items WHERE order_id = $1', [orderId]);
      
      // Delete order
      const result = await query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [orderId]);

      if (result.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
