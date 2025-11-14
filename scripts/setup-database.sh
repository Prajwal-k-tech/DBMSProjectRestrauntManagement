#!/bin/bash


set -e

DB_NAME="restaurant_db"
DB_USER="restaurant_user"
DB_PASSWORD="restaurant123"

echo "  Setting up Restaurant Management Database..."

# Run as postgres user
sudo -u postgres psql << EOF
-- Drop existing database if exists (for clean setup)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create new user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

\c $DB_NAME

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

\q
EOF

echo " Database and user created successfully!"

# Run schema
echo " Running schema.sql..."
sudo -u postgres psql -d $DB_NAME -f ../database/schema.sql

echo ""
echo " Database setup complete!"
echo ""
echo " Connection Details:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
echo " Connection String:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
