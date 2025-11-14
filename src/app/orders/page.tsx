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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

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
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    delivered: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all orders</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">{order.customer_phone}</p>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-sm text-gray-600">
                      {new Date(order.order_date).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {order.order_type} • {order.item_count} items
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    {/* Status Update Dropdown */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={order.status} disabled>Change Status</option>
                        {statuses.filter(s => s !== order.status).map((status) => (
                          <option key={status} value={status} className="capitalize">
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
    </div>
  );
}
