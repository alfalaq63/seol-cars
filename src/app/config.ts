// This file contains configuration for the application
// It is used to disable certain features during build time

// Disable API validation during build time
export const DISABLE_API_VALIDATION = process.env.NODE_ENV === 'production';

// Disable authentication during build time
export const DISABLE_AUTH_DURING_BUILD = process.env.NODE_ENV === 'production';

// Disable database access during static generation
export const DISABLE_DB_DURING_STATIC_GEN = process.env.NODE_ENV === 'production';

// Export a dummy session for build time
export const DUMMY_SESSION = {
  user: {
    id: 'dummy-id',
    name: 'Dummy User',
    email: 'dummy@example.com',
    role: 'ADMIN',
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
};
