import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://fastidious-wisp-9a1497.netlify.app',
    'https://imageanalyzerbackend-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
import routers from "./routes/routes.js";
app.use('/api/v1/', routers);



export default app;