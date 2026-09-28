import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { env } from '../src/config/environment.js';
import { logger } from '../src/config/logger.js';
import { User } from '../src/modules/users/user.model.js';
import { Hall } from '../src/modules/residences/hall.model.js';
import { Location } from '../src/modules/residences/location.model.js';
import { seedHalls, seedLocations } from '../src/modules/residences/hall.service.js';

const TEST_PIN = '12345';
const STUDENTS_PER_HALL = 50;

interface CredentialRow {
  id: string;
  pin: string;
  name: string;
  role: string;
  hall: string;
}

async function upsertUser(
  filter: Record<string, string>,
  set: Record<string, unknown>,
) {
  await User.findOneAndUpdate(filter, { $set: set }, { upsert: true, new: true });
}

async function main() {
  await connectDatabase();

  await seedHalls();
  await seedLocations();

  const halls = await Hall.find({ active: true }).sort({ code: 1 }).lean();
  if (halls.length === 0) {
    logger.error('No halls found after seeding — cannot create test users');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(TEST_PIN, env.bcryptRounds);
  const credentials: CredentialRow[] = [];
  let studentCounter = 0;
  let staffCounter = 0;

  for (const hall of halls) {
    const rooms = await Location.find({ hallId: hall._id, type: 'room', active: true }).lean();
    if (rooms.length === 0) {
      logger.warn({ hall: hall.code }, 'No rooms seeded for hall — students will have no allocation');
    }

    for (let i = 1; i <= STUDENTS_PER_HALL; i++) {
      studentCounter += 1;
      const studentId = `99${String(studentCounter).padStart(6, '0')}`;
      const name = `${hall.name} Test Student ${i}`;
      const email = `test.student${studentCounter}@hostelfix.ug.edu.gh`;
      const room = rooms.length > 0 ? rooms[(i - 1) % rooms.length] : undefined;

      await upsertUser(
        { studentId },
        {
          name,
          email,
          studentId,
          passwordHash,
          role: 'student',
          active: true,
          assignedHallIds: [],
          allocatedLocationId: room?._id,
        },
      );
      credentials.push({ id: studentId, pin: TEST_PIN, name, role: 'student', hall: hall.name });
    }

    staffCounter += 1;
    const managerStaffId = `88${String(staffCounter).padStart(6, '0')}`;
    await upsertUser(
      { staffId: managerStaffId },
      {
        name: `${hall.name} Hall Manager`,
        email: `manager.${hall.code.toLowerCase()}@hostelfix.ug.edu.gh`,
        staffId: managerStaffId,
        passwordHash,
        role: 'hall_manager',
        active: true,
        assignedHallIds: [hall._id],
      },
    );
    credentials.push({ id: managerStaffId, pin: TEST_PIN, name: `${hall.name} Hall Manager`, role: 'hall_manager', hall: hall.name });

    const maintenanceStaffId = `77${String(staffCounter).padStart(6, '0')}`;
    await upsertUser(
      { staffId: maintenanceStaffId },
      {
        name: `${hall.name} Maintenance`,
        email: `maintenance.${hall.code.toLowerCase()}@hostelfix.ug.edu.gh`,
        staffId: maintenanceStaffId,
        passwordHash,
        role: 'maintenance',
        active: true,
        assignedHallIds: [hall._id],
      },
    );
    credentials.push({ id: maintenanceStaffId, pin: TEST_PIN, name: `${hall.name} Maintenance`, role: 'maintenance', hall: hall.name });

    logger.info({ hall: hall.code }, `Seeded ${STUDENTS_PER_HALL} students + manager + maintenance`);
  }

  const outDir = path.join(process.cwd(), 'scripts', 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, 'test-logins.csv');
  const csv = ['id,pin,name,role,hall']
    .concat(credentials.map((c) => `${c.id},${c.pin},"${c.name}",${c.role},"${c.hall}"`))
    .join('\n');
  fs.writeFileSync(csvPath, `${csv}\n`);

  logger.info(
    { students: studentCounter, staff: staffCounter * 2, csv: csvPath },
    'Test users seeded',
  );
  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Failed to seed test users');
  process.exit(1);
});
