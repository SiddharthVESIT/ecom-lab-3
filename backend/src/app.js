import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Strict CORS Configuration
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? (process.env.CLIENT_URL || 'https://ecom-lab-3.vercel.app') : 'http://localhost:5173',
  credentials: true 
}));

// 3. Payload Size Limitation (DoS Protection)
app.use(express.json({ limit: '10kb' }));

// 4. Global API Rate Limiting (Brute Force Protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// API Gateway entrypoint
app.use('/api/v1', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

export default app;
