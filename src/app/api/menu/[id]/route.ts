import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/menu/[id] - Get single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItemId = parseInt(id);

    if (isNaN(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        mi.*,
        c.name as category_name
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.category_id
      WHERE mi.menu_item_id = $1
    `;

    const result = await query(sql, [menuItemId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT /api/menu/[id] - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItemId = parseInt(id);
    const body = await request.json();

    if (isNaN(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    const { category_id, name, description, price, is_available } = body;

    const sql = `
      UPDATE menu_items
      SET 
        category_id = COALESCE($1, category_id),
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        is_available = COALESCE($5, is_available)
      WHERE menu_item_id = $6
      RETURNING *
    `;

    const result = await query(sql, [
      category_id || null,
      name || null,
      description !== undefined ? description : null,
      price || null,
      is_available !== undefined ? is_available : null,
      menuItemId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItemId = parseInt(id);

    if (isNaN(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    const sql = `DELETE FROM menu_items WHERE menu_item_id = $1 RETURNING *`;
    const result = await query(sql, [menuItemId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
