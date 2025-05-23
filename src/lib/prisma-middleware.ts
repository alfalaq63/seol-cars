import { prisma } from './prisma';

// Add middleware for better error handling and connection retries
prisma.$use(async (params, next) => {
  const MAX_RETRIES = 3;
  let retries = 0;
  let result;

  // Retry logic for database connection issues
  while (retries < MAX_RETRIES) {
    try {
      result = await next(params);
      break; // If successful, break out of the loop
    } catch (error: any) {
      retries++;
      
      // Check if it's a connection error
      if (
        error.code === 'P1001' || // Error connecting to database
        error.code === 'P1002' || // Database connection timed out
        error.code === 'P1003' || // Database does not exist
        error.code === 'P1008' || // Operations timed out
        error.code === 'P1017'    // Server closed the connection
      ) {
        console.error(`Database connection error (attempt ${retries}/${MAX_RETRIES}):`, error);
        
        if (retries >= MAX_RETRIES) {
          console.error('Max retries reached. Throwing error.');
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(100 * Math.pow(2, retries), 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Not a connection error, just throw it
        throw error;
      }
    }
  }

  return result;
});

export { prisma as prismaWithMiddleware };
