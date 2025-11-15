'use client';

import { useEffect, useState } from 'react';

interface MenuItem {
  menu_item_id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  category_name: string;
  category_id: number;
}

interface Category {
  category_id: number;
  name: string;
  item_count: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    is_available: true
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async (categoryId?: number) => {
    try {
      setLoading(true);
      const url = categoryId 
        ? `/api/menu?category_id=${categoryId}`
        : '/api/menu';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchMenuItems(categoryId);
    } else {
      fetchMenuItems();
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category_id: '',
      price: '',
      description: '',
      is_available: true
    });
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category_id: String(item.category_id),
      price: String(item.price),
      description: item.description || '',
      is_available: item.is_available
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingItem 
        ? `/api/menu/${editingItem.menu_item_id}`
        : '/api/menu';
      
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          price: parseFloat(formData.price)
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(editingItem ? 'Menu item updated!' : 'Menu item added!');
        setShowModal(false);
        fetchMenuItems(selectedCategory || undefined);
        fetchCategories();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: number, itemName: string) => {
    if (!confirm(`Delete "${itemName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (data.success) {
        alert('Menu item deleted!');
        fetchMenuItems(selectedCategory || undefined);
        fetchCategories();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Error deleting menu item');
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${item.menu_item_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_available: !item.is_available
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchMenuItems(selectedCategory || undefined);
      } else {
        alert('Error toggling availability: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to toggle availability');
    }
  };

  // Group menu items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category_name]) {
      acc[item.category_name] = [];
    }
    acc[item.category_name].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-mocha-text mb-2">Menu</h1>
          <p className="text-mocha-subtext0">Browse our complete menu</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-mocha-green text-mocha-base rounded-lg font-bold hover:bg-mocha-teal transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Menu Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-mocha-surface0 rounded-xl shadow-md p-4 border border-mocha-surface1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-mocha-blue text-mocha-base'
                : 'bg-mocha-surface1 text-mocha-text hover:bg-mocha-surface2'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => handleCategoryFilter(category.category_id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.category_id
                  ? 'bg-mocha-blue text-mocha-base'
                  : 'bg-mocha-surface1 text-mocha-text hover:bg-mocha-surface2'
              }`}
            >
              {category.name} ({category.item_count})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha-blue mx-auto mb-4"></div>
            <p className="text-mocha-subtext0">Loading menu...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMenu).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-4">
              <h2 className="text-2xl font-bold text-mocha-text flex items-center">
                <span className="w-2 h-8 bg-mocha-blue rounded mr-3"></span>
                {categoryName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.menu_item_id}
                    className={`bg-mocha-surface0 rounded-xl shadow-md p-6 border transition-all ${
                      item.is_available
                        ? 'border-mocha-surface1 hover:shadow-lg hover:border-mocha-blue'
                        : 'border-mocha-surface1 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-mocha-text">{item.name}</h3>
                      <span className="text-xl font-bold text-mocha-green">₹{parseFloat(String(item.price)).toFixed(2)}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-mocha-subtext0 mb-4">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          item.is_available
                            ? 'bg-mocha-green/20 text-mocha-green hover:bg-mocha-green/30'
                            : 'bg-mocha-red/20 text-mocha-red hover:bg-mocha-red/30'
                        }`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </button>
                      <span className="text-xs text-mocha-overlay0">#{item.menu_item_id}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-mocha-surface1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex-1 px-3 py-2 bg-mocha-blue/20 text-mocha-blue rounded-lg text-sm font-medium hover:bg-mocha-blue/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.menu_item_id, item.name)}
                        className="flex-1 px-3 py-2 bg-mocha-red/20 text-mocha-red rounded-lg text-sm font-medium hover:bg-mocha-red/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mocha-subtext0 text-lg">No menu items found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Menu Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-mocha-mantle rounded-2xl shadow-2xl w-full max-w-2xl border border-mocha-surface1">
            <div className="p-6 border-b border-mocha-surface1 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-mocha-text">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
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
                <label className="block text-sm font-bold text-mocha-text mb-2">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-blue"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-mocha-text mb-2">Category *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-mocha-text mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-blue"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-mocha-text mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-mocha-surface0 border border-mocha-surface2 rounded-lg text-mocha-text placeholder:text-mocha-overlay0 focus:outline-none focus:ring-2 focus:ring-mocha-blue resize-none"
                  placeholder="Brief description of the item..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-5 h-5 rounded border-mocha-surface2 text-mocha-blue focus:ring-mocha-blue"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-mocha-text cursor-pointer">
                  Item is available for order
                </label>
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
                  className="flex-1 px-6 py-3 bg-mocha-green text-mocha-base rounded-lg font-bold hover:bg-mocha-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
