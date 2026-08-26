import { ErrorRequestHandler } from 'express';
import { ApiResponse } from '@sikkim-yatra/shared';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response: ApiResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message,
      ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
