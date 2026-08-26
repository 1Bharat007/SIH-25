import cors, { CorsOptions } from 'cors';
import { ENV } from '../config/env.js';

const allowedOrigins = [
  ENV.CORS_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

export const corsMiddleware = cors(corsOptions);
