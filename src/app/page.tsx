export default async function Home() {
  // Fetch stats from API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  let stats = null;
  try {
    const res = await fetch(`${baseUrl}/api/stats`, { 
      cache: 'no-store' 
    });
    const data = await res.json();
    if (data.success) {
      stats = data.data;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-mocha-text mb-2">Loading Dashboard...</h2>
          <p className="text-mocha-subtext0">Please ensure the database is connected</p>
        </div>
      </div>
    );
  }

  const { summary, ordersByStatus, topSellingItems, recentOrders, revenueByType } = stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-mocha-text mb-2">Dashboard</h1>
        <p className="text-mocha-subtext0">Overview of your restaurant operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:border-mocha-blue transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mocha-subtext0 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-mocha-text">{summary.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-mocha-blue/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-mocha-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:border-mocha-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mocha-subtext0 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-mocha-green">₹{summary.totalRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-mocha-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-mocha-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:border-mocha-mauve transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mocha-subtext0 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-mocha-text">{summary.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-mocha-mauve/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-mocha-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1 hover:border-mocha-peach transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mocha-subtext0 mb-1">Menu Items</p>
              <p className="text-3xl font-bold text-mocha-text">{summary.totalMenuItems}</p>
            </div>
            <div className="w-12 h-12 bg-mocha-peach/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-mocha-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1">
          <h2 className="text-xl font-bold text-mocha-text mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {ordersByStatus.map((item: any) => {
              const statusColors: Record<string, string> = {
                pending: 'bg-mocha-yellow',
                preparing: 'bg-mocha-blue',
                ready: 'bg-mocha-green',
                delivered: 'bg-mocha-overlay0',
                cancelled: 'bg-mocha-red'
              };
              
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[item.status] || 'bg-mocha-overlay0'}`}></div>
                    <span className="text-mocha-subtext1 capitalize font-medium">{item.status}</span>
                  </div>
                  <span className="text-mocha-text font-bold">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Type */}
        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1">
          <h2 className="text-xl font-bold text-mocha-text mb-4">Revenue by Order Type</h2>
          <div className="space-y-3">
            {revenueByType.map((item: any) => (
              <div key={item.order_type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-mocha-mauve"></div>
                  <span className="text-mocha-subtext1 capitalize font-medium">{item.order_type}</span>
                </div>
                <div className="text-right">
                  <p className="text-mocha-text font-bold">₹{parseFloat(item.revenue).toFixed(2)}</p>
                  <p className="text-sm text-mocha-subtext0">{item.count} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1">
          <h2 className="text-xl font-bold text-mocha-text mb-4">Top Selling Items</h2>
          <div className="space-y-4">
            {topSellingItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-mocha-surface1 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-mocha-text">{item.name}</p>
                  <p className="text-sm text-mocha-subtext0">{item.category}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-mocha-text">{item.total_sold} sold</p>
                  <p className="text-sm text-mocha-green">₹{parseFloat(item.revenue).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-mocha-surface0 rounded-xl shadow-md p-6 border border-mocha-surface1">
          <h2 className="text-xl font-bold text-mocha-text mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order: any) => {
              const statusColors: Record<string, string> = {
                pending: 'bg-mocha-yellow/20 text-mocha-yellow',
                preparing: 'bg-mocha-blue/20 text-mocha-blue',
                ready: 'bg-mocha-green/20 text-mocha-green',
                delivered: 'bg-mocha-overlay0/20 text-mocha-overlay0',
                cancelled: 'bg-mocha-red/20 text-mocha-red'
              };

              return (
                <div key={order.order_id} className="flex items-center justify-between py-2 border-b border-mocha-surface1 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-mocha-text">#{order.order_id} - {order.customer_name}</p>
                    <p className="text-sm text-mocha-subtext0">{new Date(order.order_date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-mocha-text">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-mocha-overlay0/20 text-mocha-overlay0'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
