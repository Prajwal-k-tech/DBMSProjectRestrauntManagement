import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/customers/[id] - Get customer details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Get customer with order statistics
    const sql = `
      SELECT 
        c.*,
        COUNT(o.order_id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        MAX(o.order_date) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.customer_id = o.customer_id
      WHERE c.customer_id = $1
      GROUP BY c.customer_id
    `;

    const result = await query(sql, [customerId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    const body = await request.json();

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const { name, phone, email } = body;

    // Phone validation if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone must be a 10-digit number' },
        { status: 400 }
      );
    }

    // Check if phone is being changed and if new phone already exists for another customer
    if (phone) {
      const checkPhone = await query(
        'SELECT customer_id FROM customers WHERE phone = $1 AND customer_id != $2',
        [phone, customerId]
      );

      if (checkPhone.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Phone number already registered to another customer' },
          { status: 409 }
        );
      }
    }

    const sql = `
      UPDATE customers
      SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email)
      WHERE customer_id = $4
      RETURNING *
    `;

    const result = await query(sql, [
      name || null,
      phone || null,
      email !== undefined ? email : null,
      customerId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Check if customer has orders
    const orders = await query(
      'SELECT COUNT(*) as count FROM orders WHERE customer_id = $1',
      [customerId]
    );

    if (parseInt(orders.rows[0].count) > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete customer with existing orders' },
        { status: 409 }
      );
    }

    const sql = `DELETE FROM customers WHERE customer_id = $1 RETURNING *`;
    const result = await query(sql, [customerId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
