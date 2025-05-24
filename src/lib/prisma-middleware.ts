import { prisma } from './prisma';

// Middleware disabled - causing issues with Prisma Accelerate
// This middleware was designed for direct database connections
// and doesn't work properly with Prisma Accelerate service

// TODO: Re-enable this middleware when switching to direct PostgreSQL connection
// For now, we'll use the basic Prisma client without retry logic

export { prisma as prismaWithMiddleware };
