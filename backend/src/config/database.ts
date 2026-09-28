import mongoose from 'mongoose';
import { env } from './environment.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.mongodbUri);
  logger.info('Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}
