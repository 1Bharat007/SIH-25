export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  database: {
    status: 'connected' | 'disconnected' | 'mocked';
    latencyMs?: number;
  };
  features: {
    pwaReady: boolean;
    offlineSync: boolean;
    locationServices: boolean;
  };
}
