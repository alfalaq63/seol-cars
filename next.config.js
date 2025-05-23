/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Add experimental features to handle database connection issues
  experimental: {
    // This allows the app to continue building even if there are errors
    // in server components during the build process
    serverComponentsExternalPackages: ['@prisma/client'],
    // Increase the timeout for server components
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
