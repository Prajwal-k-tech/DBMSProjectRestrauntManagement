import { Pool } from 'pg';

// Validate DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error('\n❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('📋 Setup instructions:');
  console.error('   1. Copy .env.example to .env');
  console.error('   2. Set DATABASE_URL in .env file');
  console.error('   3. Ensure PostgreSQL is running\n');
  throw new Error('DATABASE_URL environment variable is required');
}

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on initialization
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Export query function for direct SQL queries
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Export pool for advanced usage
export default pool;
