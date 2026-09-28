import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { logger } from '../src/config/logger.js';
import { seedHalls, seedLocations } from '../src/modules/residences/hall.service.js';

async function main() {
  await connectDatabase();
  await seedHalls();
  await seedLocations();
  logger.info('Halls and locations seeded successfully');
  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Failed to seed halls');
  process.exit(1);
});
