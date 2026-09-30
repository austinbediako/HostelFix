import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { env } from '../src/config/environment.js';
import { logger } from '../src/config/logger.js';
import { User } from '../src/modules/users/user.model.js';
import { Hall } from '../src/modules/residences/hall.model.js';
import { Location } from '../src/modules/residences/location.model.js';

const STUDENTS_PER_HALL = 50;
const STUDENT_ID_BASE = 99000001;
const MANAGER_ID_BASE = 88000001;
const MAINTENANCE_ID_BASE = 77000001;
const DEMO_PIN = '12345';

const FIRST_NAMES = [
  'Kofi', 'Kwame', 'Kwesi', 'Yaw', 'Kojo', 'Fiifi', 'Kwabena', 'Kwaku', 'Kweku', 'Nana',
  'Ama', 'Efua', 'Abena', 'Akosua', 'Adwoa', 'Yaa', 'Afua', 'Ekua', 'Esi', 'Araba',
  'Ato', 'Ebow', 'Kobina', 'Selassie', 'Eyram', 'Elikem', 'Senam', 'Makafui', 'Enyonam', 'Edem',
  'Mawuli', 'Dzifa', 'Mawunyo', 'Abla', 'Kekeli', 'Sedinam', 'Yayra', 'Klenam', 'Etornam', 'Selom',
  'Kafui', 'Delali', 'Worlali', 'Agbeko', 'Mawuko', 'Sitsofe', 'Nhyira', 'Serwaa', 'Ohenewaa', 'Adjoa',
  'Nkunim', 'Abrefi', 'Piesie', 'Amoakowaa', 'Dansoa', 'Berima', 'Ohene', 'Nana Yaw', 'Maame', 'Papa',
];

const SURNAMES = [
  'Mensah', 'Boateng', 'Owusu', 'Asante', 'Osei', 'Agyeman', 'Darko', 'Adu', 'Appiah', 'Frimpong',
  'Amoah', 'Acheampong', 'Opoku', 'Antwi', 'Baffoe', 'Danso', 'Gyamfi', 'Kwarteng', 'Ofori', 'Sarpong',
  'Tetteh', 'Addo', 'Ayitey', 'Quartey', 'Lamptey', 'Nartey', 'Laryea', 'Sowah', 'Okine', 'Abbey',
  'Allotey', 'Ashitey', 'Commey', 'Dodoo', 'Kotey', 'Tagoe', 'Tackie', 'Armah', 'Sackey', 'Ghartey',
  'Pappoe', 'Dadzie', 'Eshun', 'Annan', 'Amissah', 'Bonney', 'Cudjoe', 'Fynn', 'Issahaku', 'Yakubu',
  'Abubakari', 'Fuseini', 'Mohammed', 'Sulemana', 'Alhassan', 'Iddrisu', 'Bukari', 'Mahama', 'Amankwah', 'Badu',
];

// Deterministic PRNG so re-seeds produce identical names
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const usedNames = new Set<string>();

function randomName(): string {
  let name: string;
  do {
    name = `${FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]} ${SURNAMES[Math.floor(rand() * SURNAMES.length)]}`;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
}

function emailFor(name: string, id: string): string {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.+$/, '');
  return `${slug}.${id}@hostelfix.ug.edu.gh`;
}

async function main() {
  await connectDatabase();

  const halls = await Hall.find().sort({ name: 1 }).lean();
  if (halls.length === 0) {
    logger.error('Run seed-halls first');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(DEMO_PIN, env.bcryptRounds);
  const operations: Record<string, unknown>[] = [];

  for (const [i, hall] of halls.entries()) {
    const rooms = await Location.find({ hallId: hall._id, type: 'room' })
      .sort({ block: 1, floor: 1, room: 1 })
      .select('_id')
      .lean();

    for (let s = 0; s < STUDENTS_PER_HALL; s++) {
      const studentId = String(STUDENT_ID_BASE + i * STUDENTS_PER_HALL + s);
      const name = randomName();
      operations.push({
        updateOne: {
          filter: { studentId },
          update: {
            $set: {
              studentId,
              name,
              email: emailFor(name, studentId),
              passwordHash,
              role: 'student',
              active: true,
              assignedHallIds: [],
              allocatedLocationId: rooms[s % rooms.length]?._id,
            },
          },
          upsert: true,
        },
      });
    }

    const managerStaffId = String(MANAGER_ID_BASE + i);
    const managerName = randomName();
    operations.push({
      updateOne: {
        filter: { staffId: managerStaffId },
        update: {
          $set: {
            staffId: managerStaffId,
            name: managerName,
            email: emailFor(managerName, managerStaffId),
            passwordHash,
            role: 'hall_manager',
            active: true,
            assignedHallIds: [hall._id],
          },
        },
        upsert: true,
      },
    });

    const maintStaffId = String(MAINTENANCE_ID_BASE + i);
    const maintName = randomName();
    operations.push({
      updateOne: {
        filter: { staffId: maintStaffId },
        update: {
          $set: {
            staffId: maintStaffId,
            name: maintName,
            email: emailFor(maintName, maintStaffId),
            passwordHash,
            role: 'maintenance',
            active: true,
            assignedHallIds: [hall._id],
          },
        },
        upsert: true,
      },
    });
  }

  const result = await User.bulkWrite(operations as never, { ordered: false });
  logger.info(
    { upserted: result.upsertedCount, modified: result.modifiedCount, total: operations.length },
    'Demo accounts seeded',
  );

  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Failed to seed demo accounts');
  process.exit(1);
});
