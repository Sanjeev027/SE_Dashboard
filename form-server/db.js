const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
  } else {
    console.log("PostgreSQL (Supabase) Connected Successfully");
  }
});

module.exports = db;
