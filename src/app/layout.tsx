import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Order Management System",
  description: "Manage orders, menu items, and customers efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Restaurant Manager</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/menu"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
                >
                  Menu
                </Link>
                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
                >
                  Orders
                </Link>
                <Link
                  href="/customers"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
                >
                  Customers
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>Restaurant Order Management System © 2025 | DBMS Lab Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
