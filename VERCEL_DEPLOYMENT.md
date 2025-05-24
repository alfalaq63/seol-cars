# Vercel Deployment Guide for Siol Libya Cars

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database**: Choose one of the free options below

## Step 1: Set Up Free PostgreSQL Database

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string (starts with `postgresql://`)

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option C: Vercel Postgres
1. In your Vercel dashboard
2. Go to Storage tab
3. Create Postgres database
4. Copy the connection string

## Step 2: Deploy to Vercel

1. **Import Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   In the Vercel dashboard, add these environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_random_32_character_string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

3. **Generate NEXTAUTH_SECRET**:
   Run this command to generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

## Step 3: Set Up Database Schema

After successful deployment:

1. **Push Database Schema**:
   ```bash
   npx prisma db push
   ```

2. **Create Admin User**:
   ```bash
   npm run create:admin
   ```

## Step 4: Verify Deployment

1. Visit your Vercel app URL
2. Test the login with:
   - Email: `admin@admin.com`
   - Password: `admin`

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel

### Database Connection Issues
- Verify your database allows connections from Vercel IPs
- Check the connection string format

### Authentication Issues
- Ensure NEXTAUTH_URL matches your Vercel domain
- Verify NEXTAUTH_SECRET is set

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Random 32-character string | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables
3. Test database connection locally first
