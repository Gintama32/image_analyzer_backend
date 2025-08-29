// index.js (entry point)
import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // Force IPv4

import dotenv from "dotenv";
dotenv.config();

import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  }
});

// Debug log (without leaking password)
if (process.env.DATABASE_URL) {
  console.log("✅ Using DATABASE_URL (password hidden)");
}

// Test DB connection
db.raw("SELECT 1")
  .then(() => console.log("✅ Database connection established"))
  .catch(err => console.error("❌ Database connection failed:", err.message));

export default db;
