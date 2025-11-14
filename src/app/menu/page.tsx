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
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Menu</h1>
        <p className="text-gray-600">Browse our complete menu</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMenu).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-2 h-8 bg-blue-600 rounded mr-3"></span>
                {categoryName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.menu_item_id}
                    className={`bg-white rounded-xl shadow-md p-6 border transition-all ${
                      item.is_available
                        ? 'border-gray-100 hover:shadow-lg hover:border-blue-200'
                        : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="text-xl font-bold text-green-600">₹{item.price.toFixed(2)}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                      <span className="text-xs text-gray-500">#{item.menu_item_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No menu items found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
