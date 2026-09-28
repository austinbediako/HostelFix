import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { env } from '../src/config/environment.js';
import { logger } from '../src/config/logger.js';
import { User } from '../src/modules/users/user.model.js';
import { Hall } from '../src/modules/residences/hall.model.js';
import { Location } from '../src/modules/residences/location.model.js';

async function main() {
  await connectDatabase();

  const halls = await Hall.find().lean();
  if (halls.length === 0) {
    logger.error('Run pnpm run seed first to create halls');
    process.exit(1);
  }

  const defaultPassword = env.systemAdminPassword || 'Password123';
  const passwordHash = await bcrypt.hash(defaultPassword, env.bcryptRounds);

  const hallA = halls[0]._id;
  const hallB = halls[1]._id;

  const studentRoom = await Location.findOne({ hallId: hallA, type: 'room' }).lean();
  await User.findOneAndUpdate(
    { email: 'student@hostelfix.ug.edu.gh' },
    {
      $set: {
        name: 'Sample Student',
        email: 'student@hostelfix.ug.edu.gh',
        studentId: '11287773',
        passwordHash,
        role: 'student',
        active: true,
        assignedHallIds: [],
        allocatedLocationId: studentRoom?._id,
      },
    },
    { upsert: true, new: true },
  );
  logger.info('Sample student seeded');

  await User.findOneAndUpdate(
    { email: 'manager@hostelfix.ug.edu.gh' },
    {
      $set: {
        name: 'Hall Manager A',
        email: 'manager@hostelfix.ug.edu.gh',
        staffId: '10000001',
        passwordHash,
        role: 'hall_manager',
        active: true,
        assignedHallIds: [hallA],
      },
    },
    { upsert: true, new: true },
  );
  logger.info('Sample hall manager seeded');

  await User.findOneAndUpdate(
    { email: 'maintenance@hostelfix.ug.edu.gh' },
    {
      $set: {
        name: 'Maintenance Worker',
        email: 'maintenance@hostelfix.ug.edu.gh',
        staffId: '10000002',
        passwordHash,
        role: 'maintenance',
        active: true,
        assignedHallIds: [hallA, hallB],
      },
    },
    { upsert: true, new: true },
  );
  logger.info('Sample maintenance worker seeded');

  await User.findOneAndUpdate(
    { email: 'university.admin@hostelfix.ug.edu.gh' },
    {
      $set: {
        name: 'University Administrator',
        email: 'university.admin@hostelfix.ug.edu.gh',
        staffId: '10000003',
        passwordHash,
        role: 'university_admin',
        active: true,
        assignedHallIds: [],
      },
    },
    { upsert: true, new: true },
  );
  logger.info('Sample university admin seeded');

  logger.info('Dev seed completed');
  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Failed to seed dev data');
  process.exit(1);
});
