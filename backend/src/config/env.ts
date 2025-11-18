import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(`Missing required env vars: ${missing.join(', ')}. Add them to .env`);
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'changeme-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
};
