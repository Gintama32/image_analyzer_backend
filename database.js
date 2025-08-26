import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'pg',
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

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    // Continue running the app even if DB connection fails
  });

export default db;