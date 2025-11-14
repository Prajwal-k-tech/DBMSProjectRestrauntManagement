import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MenuItem } from '@/types/database';

// GET /api/menu - Fetch all menu items with categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const available = searchParams.get('available');

    let sql = `
      SELECT 
        mi.menu_item_id,
        mi.category_id,
        mi.name,
        mi.description,
        mi.price,
        mi.is_available,
        mi.created_at,
        mi.updated_at,
        c.name as category_name
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.category_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (categoryId) {
      sql += ` AND mi.category_id = $${paramCount}`;
      params.push(parseInt(categoryId));
      paramCount++;
    }

    if (available !== null && available !== undefined) {
      sql += ` AND mi.is_available = $${paramCount}`;
      params.push(available === 'true');
      paramCount++;
    }

    sql += ` ORDER BY c.category_id, mi.name`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/menu - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category_id, name, description, price, is_available = true } = body;

    // Validation
    if (!category_id || !name || !price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: category_id, name, price' 
        },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Price must be a positive number' 
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO menu_items (category_id, name, description, price, is_available)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await query(sql, [
      category_id,
      name,
      description || null,
      price,
      is_available
    ]);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Menu item created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create menu item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
