import express from 'express';
import { ENV } from './config/env.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRoutes } from './routes/index.js';

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for development
if (ENV.NODE_ENV !== 'test') {
  app.use((req, _res, next) => {
    const start = Date.now();
    const { method, url } = req;
    _res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[API] ${method} ${url} ${_res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// API Routes
app.use(ENV.API_PREFIX, apiRoutes);

// Root fallback route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Sikkim Yatra Backend API',
    documentation: `${ENV.API_PREFIX}/health`,
    version: '0.1.0',
  });
});

// Centralized error handling
app.use(errorMiddleware);

// Server startup
const server = app.listen(ENV.PORT, () => {
  console.log(`🏔️ Sikkim Yatra Server running on http://localhost:${ENV.PORT}`);
  console.log(`🩺 Health check available at http://localhost:${ENV.PORT}${ENV.API_PREFIX}/health`);
});

export { app, server };
