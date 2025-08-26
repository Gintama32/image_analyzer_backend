import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins temporarily for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://fastidious-wisp-9a1497.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://fastidious-wisp-9a1497.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
import routers from "./routes/routes.js";

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/api/v1/', routers);



export default app;