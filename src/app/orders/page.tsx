'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  order_id: number;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  total_amount: string;
  status: string;
  order_type: string;
  item_count: string;
}

interface Customer {
  customer_id: number;
  name: string;
  phone: string;
}

interface MenuItem {
  menu_item_id: number;
  name: string;
  price: string;
  category_name: string;
}

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  name: string;
  price: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create order state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [orderNotes, setOrderNotes] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (showCreateModal) {
      fetchCustomers();
      fetchMenuItems();
    }
  }, [showCreateModal]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter 
        ? `/api/orders?status=${statusFilter}`
        : '/api/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const addItemToOrder = (menuItem: MenuItem) => {
    const existing = selectedItems.find(item => item.menu_item_id === menuItem.menu_item_id);
    if (existing) {
      setSelectedItems(selectedItems.map(item =>
        item.menu_item_id === menuItem.menu_item_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        menu_item_id: menuItem.menu_item_id,
        quantity: 1,
        name: menuItem.name,
        price: menuItem.price
      }]);
    }
  };

  const removeItemFromOrder = (menuItemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.menu_item_id !== menuItemId));
  };

  const updateItemQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(menuItemId);
    } else {
      setSelectedItems(selectedItems.map(item =>
        item.menu_item_id === menuItemId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );
  };

  const createOrder = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      alert('Please select a customer and add items to the order');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer,
          order_type: orderType,
          notes: orderNotes || null,
          items: selectedItems.map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: parseFloat(item.price)
          }))
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Order created successfully!');
        setShowCreateModal(false);
        setSelectedCustomer(null);
        setSelectedItems([]);
        setOrderNotes('');
        fetchOrders();
      } else {
        alert('Error creating order: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    } finally {
      setCreating(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (data.success) {
        // Refresh orders
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-mocha-yellow/20 text-mocha-yellow border-mocha-yellow/50',
    preparing: 'bg-mocha-blue/20 text-mocha-blue border-mocha-blue/50',
    ready: 'bg-mocha-green/20 text-mocha-green border-mocha-green/50',
    delivered: 'bg-mocha-overlay0/20 text-mocha-overlay0 border-mocha-overlay0/50',
    cancelled: 'bg-mocha-red/20 text-mocha-red border-mocha-red/50'
  };

  const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-mocha-text mb-2">Orders</h1>
          <p className="text-mocha-subtext0">Manage and track all orders</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-mocha-blue text-mocha-base rounded-lg font-bold hover:bg-mocha-sapphire transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Order
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-mocha-surface0 rounded-xl shadow-md p-4 border border-mocha-surface1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === null
                ? 'bg-mocha-blue text-mocha-base'
                : 'bg-mocha-surface1 text-mocha-text hover:bg-mocha-surface2'
            }`}
          >
            All Orders
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-mocha-blue text-mocha-base'
                  : 'bg-mocha-surface1 text-mocha-text hover:bg-mocha-surface2'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-blue mx-auto mb-4"></div>
            <p className="text-mocha-subtext0">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-mocha-surface0 rounded-xl shadow-md p-12 text-center border border-mocha-surface1">
              <p className="text-mocha-subtext0 text-lg">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:shadow-lg hover:border-mocha-blue transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-bold text-mocha-text mb-1">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-sm text-mocha-subtext1">{order.customer_name}</p>
                    <p className="text-sm text-mocha-subtext0">{order.customer_phone}</p>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-sm text-mocha-subtext1">
                      {new Date(order.order_date).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-mocha-subtext0 capitalize">
                      {order.order_type} • {order.item_count} items
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-mocha-green">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                        statusColors[order.status] || 'bg-mocha-overlay0/20 text-mocha-overlay0 border-mocha-overlay0/50'
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    {/* Status Update Dropdown */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                        className="px-3 py-2 border border-mocha-surface2 rounded-lg bg-mocha-surface1 text-sm font-medium text-mocha-text hover:bg-mocha-surface2 focus:outline-none focus:ring-2 focus:ring-mocha-blue"
                      >
                        <option value={order.status} disabled>Change Status</option>
                        {statuses.filter(s => s !== order.status).map((status) => (
                          <option key={status} value={status} className="capitalize bg-mocha-surface1">
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-mocha-mantle rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-mocha-surface1">
            {/* Modal Header */}
            <div className="sticky top-0 bg-mocha-mantle border-b border-mocha-surface1 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-mocha-text">Create New Order</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedCustomer(null);
                  setSelectedItems([]);
                  setOrderNotes('');
                }}
                className="text-mocha-subtext0 hover:text-mocha-red transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Select Customer *</label>
                <select
                  value={selectedCustomer || ''}
                  onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Order Type *</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOrderType('dine-in')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      orderType === 'dine-in'
                        ? 'bg-mocha-blue text-mocha-base'
                        : 'bg-mocha-surface0 text-mocha-text border border-mocha-surface2 hover:bg-mocha-surface1'
                    }`}
                  >
                    Dine-In
                  </button>
                  <button
                    onClick={() => setOrderType('takeaway')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      orderType === 'takeaway'
                        ? 'bg-mocha-blue text-mocha-base'
                        : 'bg-mocha-surface0 text-mocha-text border border-mocha-surface2 hover:bg-mocha-surface1'
                    }`}
                  >
                    Takeaway
                  </button>
                </div>
              </div>

              {/* Add Menu Items */}
              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Add Items *</label>
                <div className="max-h-60 overflow-y-auto bg-mocha-surface0 rounded-lg border border-mocha-surface2 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {menuItems.map(item => (
                      <button
                        key={item.menu_item_id}
                        onClick={() => addItemToOrder(item)}
                        className="text-left p-3 bg-mocha-surface1 hover:bg-mocha-surface2 rounded-lg transition-colors border border-mocha-surface2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-mocha-text text-sm">{item.name}</p>
                            <p className="text-xs text-mocha-subtext0">{item.category_name}</p>
                          </div>
                          <p className="text-sm font-bold text-mocha-green">₹{parseFloat(item.price).toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-mocha-text mb-2">Order Items ({selectedItems.length})</label>
                  <div className="space-y-2 bg-mocha-surface0 rounded-lg border border-mocha-surface2 p-3">
                    {selectedItems.map(item => (
                      <div key={item.menu_item_id} className="flex items-center justify-between gap-3 p-3 bg-mocha-surface1 rounded-lg">
                        <div className="flex-1">
                          <p className="font-bold text-mocha-text">{item.name}</p>
                          <p className="text-sm text-mocha-subtext0">₹{parseFloat(item.price).toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItemQuantity(item.menu_item_id, item.quantity - 1)}
                            className="w-8 h-8 bg-mocha-surface2 hover:bg-mocha-red hover:text-mocha-base rounded text-mocha-text font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold text-mocha-text">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.menu_item_id, item.quantity + 1)}
                            className="w-8 h-8 bg-mocha-surface2 hover:bg-mocha-green hover:text-mocha-base rounded text-mocha-text font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-mocha-green">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItemFromOrder(item.menu_item_id)}
                          className="text-mocha-red hover:text-mocha-red/80 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-mocha-surface2 flex justify-between items-center">
                      <span className="text-lg font-bold text-mocha-text">Total:</span>
                      <span className="text-2xl font-bold text-mocha-green">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Notes (Optional)</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={3}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-blue resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedCustomer(null);
                    setSelectedItems([]);
                    setOrderNotes('');
                  }}
                  className="flex-1 px-6 py-3 bg-mocha-surface1 text-mocha-text rounded-lg font-bold hover:bg-mocha-surface2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createOrder}
                  disabled={creating || !selectedCustomer || selectedItems.length === 0}
                  className="flex-1 px-6 py-3 bg-mocha-blue text-mocha-base rounded-lg font-bold hover:bg-mocha-sapphire transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : `Create Order - ₹${calculateTotal().toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
