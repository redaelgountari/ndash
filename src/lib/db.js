// lib/db.js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, 
});

export const query = (text, params) => pool.query(text, params);

export default pool;
