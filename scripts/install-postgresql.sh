#!/bin/bash

# ============================================
# PostgreSQL Installation & Setup Script
# For Ubuntu/Debian-based systems
# ============================================

set -e  # Exit on error

echo "🔧 Starting PostgreSQL Installation..."

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install PostgreSQL
echo "📥 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Check if installation was successful
echo "✅ Checking PostgreSQL version..."
psql --version

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check service status
echo "📊 PostgreSQL service status:"
sudo systemctl status postgresql --no-pager

echo ""
echo "✅ PostgreSQL installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Switch to postgres user: sudo -i -u postgres"
echo "2. Access PostgreSQL: psql"
echo "3. Create database: CREATE DATABASE restaurant_db;"
echo "4. Create user: CREATE USER restaurant_user WITH PASSWORD 'your_password';"
echo "5. Grant privileges: GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;"
echo ""
