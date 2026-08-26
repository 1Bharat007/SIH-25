import { Request, Response } from 'express';
import { ApiResponse, HealthCheckResponse, APP_METADATA } from '@sikkim-yatra/shared';
import { ENV } from '../config/env.js';
import { checkDatabaseConnection } from '../db/prisma.js';

export async function getHealthStatus(
  _req: Request,
  res: Response<ApiResponse<HealthCheckResponse>>
): Promise<void> {
  const dbStatus = await checkDatabaseConnection();

  const healthData: HealthCheckResponse = {
    status: dbStatus.status === 'connected' ? 'ok' : 'degraded',
    service: APP_METADATA.name,
    version: APP_METADATA.version,
    environment: ENV.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    features: {
      pwaReady: true,
      offlineSync: true,
      locationServices: true,
    },
  };

  res.status(200).json({
    success: true,
    message: 'Sikkim Yatra API is healthy and operational',
    data: healthData,
    timestamp: new Date().toISOString(),
  });
}
