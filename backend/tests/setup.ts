import { beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from '../src/config/environment.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  env.mongodbUri = mongoServer.getUri();
  const { connectDatabase } = await import('../src/config/database.js');
  await connectDatabase();
});

afterAll(async () => {
  const { disconnectDatabase } = await import('../src/config/database.js');
  await disconnectDatabase();
  await mongoServer.stop();
});

afterEach(async () => {
  const mongoose = (await import('mongoose')).default;
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
