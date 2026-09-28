import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { env } from '../src/config/environment.js';
import { logger } from '../src/config/logger.js';
import { User } from '../src/modules/users/user.model.js';

async function main() {
  await connectDatabase();

  if (!env.systemAdminPassword) {
    logger.error('SYSTEM_ADMIN_PASSWORD is required to seed admin');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(env.systemAdminPassword, env.bcryptRounds);

  const result = await User.findOneAndUpdate(
    { email: env.systemAdminEmail.toLowerCase() },
    {
      $set: {
        name: 'System Administrator',
        email: env.systemAdminEmail.toLowerCase(),
        staffId: '10000004',
        passwordHash,
        role: 'system_admin',
        active: true,
        assignedHallIds: [],
      },
    },
    { upsert: true, new: true },
  );

  if (result) {
    logger.info('System admin seeded successfully');
  }

  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Failed to seed admin');
  process.exit(1);
});
