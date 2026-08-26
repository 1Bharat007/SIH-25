import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root and server directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/sikkim_yatra_dev?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-sikkim-yatra',
} as const;
