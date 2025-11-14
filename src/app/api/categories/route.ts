import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/categories - Fetch all categories
export async function GET() {
  try {
    const sql = `
      SELECT 
        c.*,
        COUNT(mi.menu_item_id) as item_count
      FROM categories c
      LEFT JOIN menu_items mi ON c.category_id = mi.category_id
      GROUP BY c.category_id
      ORDER BY c.name
    `;

    const result = await query(sql);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await query(sql, [name, description || null]);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Category created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
