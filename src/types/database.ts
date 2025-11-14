// Database Types

export interface Category {
  category_id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface MenuItem {
  menu_item_id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  email: string | null;
  created_at: Date;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway';

export interface Order {
  order_id: number;
  customer_id: number;
  order_date: Date;
  total_amount: number;
  status: OrderStatus;
  order_type: OrderType;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// View Types (for complex queries)

export interface MenuItemWithCategory extends MenuItem {
  category_name: string;
}

export interface OrderWithCustomer extends Order {
  customer_name: string;
  customer_phone: string;
}

export interface OrderDetail {
  order_id: number;
  order_date: Date;
  status: OrderStatus;
  order_type: OrderType;
  total_amount: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  order_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  menu_item_id: number;
  item_name: string;
  category_name: string;
}
