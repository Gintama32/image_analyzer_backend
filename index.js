import app from './app.js';
import db from './database.js';

// Railway (and Heroku, Render, etc.) inject PORT
const PORT = process.env.PORT || 3000;

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Keep the process running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running despite the rejection
});

// Create the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT} and host 0.0.0.0...`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
