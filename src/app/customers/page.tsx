'use client';

import { useEffect, useState } from 'react';

interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
  order_count: string;
  total_spent: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (search?: string) => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/customers?search=${encodeURIComponent(search)}`
        : '/api/customers';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(searchTerm);
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingCustomer 
        ? `/api/customers/${editingCustomer.customer_id}`
        : '/api/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: formData.email || null
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(editingCustomer ? 'Customer updated!' : 'Customer added!');
        setShowModal(false);
        fetchCustomers(searchTerm || undefined);
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-mocha-text mb-2">Customers</h1>
          <p className="text-mocha-subtext0">Manage customer information</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-mocha-mauve text-mocha-base rounded-lg font-bold hover:bg-mocha-pink transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-mocha-surface0 rounded-xl shadow-md p-4 border border-mocha-surface1">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="flex-1 px-4 py-2 bg-mocha-surface1 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-blue"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-mocha-blue text-mocha-base rounded-lg font-medium hover:bg-mocha-sapphire transition-colors"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchCustomers();
              }}
              className="px-6 py-2 bg-mocha-surface2 text-mocha-text rounded-lg font-medium hover:bg-mocha-overlay0 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-blue mx-auto mb-4"></div>
            <p className="text-mocha-subtext0">Loading customers...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.length === 0 ? (
            <div className="col-span-full bg-mocha-surface0 rounded-xl shadow-md p-12 text-center border border-mocha-surface1">
              <p className="text-mocha-subtext0 text-lg">No customers found.</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.customer_id}
                className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:shadow-lg transition-all hover:border-mocha-mauve"
              >
                {/* Customer Icon */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-mocha-blue to-mocha-mauve rounded-full flex items-center justify-center mr-3">
                    <span className="text-mocha-base font-bold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-mocha-text">{customer.name}</h3>
                    <p className="text-sm text-mocha-overlay0">ID: #{customer.customer_id}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-mocha-subtext1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {customer.phone}
                  </div>
                  {customer.email && (
                    <div className="flex items-center text-sm text-mocha-subtext1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {customer.email}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-mocha-surface1">
                  <div>
                    <p className="text-xs text-mocha-subtext0">Total Orders</p>
                    <p className="text-lg font-bold text-mocha-text">{customer.order_count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-mocha-subtext0">Total Spent</p>
                    <p className="text-lg font-bold text-mocha-green">
                      ₹{parseFloat(customer.total_spent).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="mt-3 pt-3 border-t border-mocha-surface1">
                  <p className="text-xs text-mocha-subtext0">
                    Member since {new Date(customer.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Edit Button */}
                <div className="mt-4">
                  <button
                    onClick={() => openEditModal(customer)}
                    className="w-full px-4 py-2 bg-mocha-blue/20 text-mocha-blue rounded-lg text-sm font-medium hover:bg-mocha-blue/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Customer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-mocha-mantle rounded-2xl shadow-2xl w-full max-w-lg border border-mocha-surface1">
            <div className="p-6 border-b border-mocha-surface1 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-mocha-text">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-mocha-subtext0 hover:text-mocha-red transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-mauve"
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-mauve"
                  placeholder="10-digit phone number"
                />
                <p className="text-xs text-mocha-subtext0 mt-1">Must be 10 digits</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-mauve"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-mocha-surface1 text-mocha-text rounded-lg font-bold hover:bg-mocha-surface2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-mocha-mauve text-mocha-base rounded-lg font-bold hover:bg-mocha-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingCustomer ? 'Update' : 'Add Customer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
