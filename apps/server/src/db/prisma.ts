import { PrismaClient } from '@prisma/client';

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export async function checkDatabaseConnection(): Promise<{
  status: 'connected' | 'disconnected';
  latencyMs?: number;
}> {
  const start = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Math.round(performance.now() - start);
    return { status: 'connected', latencyMs };
  } catch {
    return { status: 'disconnected' };
  }
}
