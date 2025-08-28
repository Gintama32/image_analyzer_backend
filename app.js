import express from 'express';
import cors from 'cors';

const app = express();

  // Enable CORS for all routes with proper configuration
app.use(cors({
  origin: 'https://fastidious-wisp-9a1497.netlify.app', // Your Netlify frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
import routers from "./routes/routes.js";

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/api/v1/', routers);

export default app;