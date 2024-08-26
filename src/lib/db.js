// lib/db.js
import pg from 'pg';

const { Pool } = pg;

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this environment variable is set in Vercel
});

// Function to query the database
export const query = (text, params) => pool.query(text, params);

// Optional: Export the pool for more advanced use
export default pool;
