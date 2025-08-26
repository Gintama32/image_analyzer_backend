import knex from 'knex';
import dotenv from 'dotenv';
import url from 'url';
dotenv.config();

// Parse the DATABASE_URL to extract components and ensure IPv4
let connectionConfig;
try {
  if (process.env.DATABASE_URL) {
    const parsedUrl = new URL(process.env.DATABASE_URL);
    const hostname = parsedUrl.hostname;
    
    // Check if hostname is an IPv6 address
    if (hostname.includes(':')) {
      console.log('IPv6 address detected in DATABASE_URL, attempting to use IPv4 fallback');
      // Try to use a fallback or resolve to IPv4
      connectionConfig = {
        host: process.env.DB_HOST || 'localhost', // Fallback to environment variable or localhost
        port: parsedUrl.port || 5432,
        user: parsedUrl.username,
        password: parsedUrl.password,
        database: parsedUrl.pathname.split('/')[1],
        ssl: { rejectUnauthorized: false }
      };
    } else {
      // Use the connection string as is
      connectionConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
  } else {
    // Fallback to individual environment variables
    connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
  }
} catch (error) {
  console.error('Error parsing DATABASE_URL:', error);
  // Fallback configuration
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

console.log('Using database connection config:', {
  ...connectionConfig,
  password: connectionConfig.password ? '******' : undefined // Hide password in logs
});

const db = knex({
  client: 'pg',
  connection: connectionConfig,
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