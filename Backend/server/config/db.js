// /server/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add this ssl object to fix the error
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;