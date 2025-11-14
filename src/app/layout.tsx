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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-mocha-base min-h-screen flex flex-col" suppressHydrationWarning>
        <nav className="bg-mocha-mantle shadow-lg border-b border-mocha-surface0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-mocha-blue to-mocha-mauve rounded-lg flex items-center justify-center">
                    <span className="text-mocha-base font-bold text-lg">R</span>
                  </div>
                  <span className="text-xl font-bold text-mocha-text">Restaurant Manager</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-mocha-subtext0 hover:bg-mocha-surface0 hover:text-mocha-text transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/menu"
                  className="px-4 py-2 rounded-lg text-mocha-subtext0 hover:bg-mocha-surface0 hover:text-mocha-text transition-colors font-medium"
                >
                  Menu
                </Link>
                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-lg text-mocha-subtext0 hover:bg-mocha-surface0 hover:text-mocha-text transition-colors font-medium"
                >
                  Orders
                </Link>
                <Link
                  href="/customers"
                  className="px-4 py-2 rounded-lg text-mocha-subtext0 hover:bg-mocha-surface0 hover:text-mocha-text transition-colors font-medium"
                >
                  Customers
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {children}
        </main>

        <footer className="bg-mocha-mantle border-t border-mocha-surface0 mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-mocha-subtext0">
            <p>Restaurant Order Management System © 2025 | DBMS Lab Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
