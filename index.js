import app from './app.js';
import db from './database.js';

// Railway (and Heroku, Render, etc.) inject PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}...`);
});
