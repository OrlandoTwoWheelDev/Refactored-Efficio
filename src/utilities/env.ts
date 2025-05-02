import { config } from 'dotenv';
config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const DB_USER = required('DB_USER');
export const DB_HOST = required('DB_HOST');
export const DB_NAME = required('DB_NAME');
export const DB_PASSWORD = required('DB_PASSWORD');
export const DB_PORT = parseInt(required('DB_PORT'), 10);
export const JWT_SECRET = required('JWT_SECRET');
export const JWT_REFRESH_SECRET = required('JWT_REFRESH_SECRET');