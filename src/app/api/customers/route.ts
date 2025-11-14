import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/customers - Fetch all customers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let sql = `
      SELECT 
        c.*,
        COUNT(o.order_id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM customers c
      LEFT JOIN orders o ON c.customer_id = o.customer_id
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      sql += ` WHERE (c.name ILIKE $${paramCount} OR c.phone LIKE $${paramCount} OR c.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    sql += ` 
      GROUP BY c.customer_id
      ORDER BY c.name
    `;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone must be a 10-digit number' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const checkPhone = await query(
      'SELECT customer_id FROM customers WHERE phone = $1',
      [phone]
    );

    if (checkPhone.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    const sql = `
      INSERT INTO customers (name, phone, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await query(sql, [name, phone, email || null]);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Customer created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create customer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
