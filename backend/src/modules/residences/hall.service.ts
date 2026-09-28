import { Hall } from './hall.model.js';
import { Location } from './location.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import { logger } from '../../config/logger.js';
import type mongoose from 'mongoose';
import type { UpdateHallInput } from './hall.types.js';

const APPROVED_HALLS = [
  { name: 'Akuafo Hall', code: 'AKU', type: 'traditional' as const },
  { name: 'Legon Hall', code: 'LEG', type: 'traditional' as const },
  { name: 'Volta Hall', code: 'VOL', type: 'traditional' as const },
  { name: 'Commonwealth Hall', code: 'CMH', type: 'traditional' as const },
  { name: 'Mensah Sarbah Hall', code: 'MSH', type: 'traditional' as const },
  { name: 'Hilla Limann Hall', code: 'HLH', type: 'ugel' as const },
  { name: 'Alexander Adum Kwapong Hall', code: 'AAK', type: 'ugel' as const },
  { name: 'Elizabeth Frances Sey Hall', code: 'EFS', type: 'ugel' as const },
  { name: 'Jean Nelson Aka Hall', code: 'JNA', type: 'ugel' as const },
  { name: 'Diamond Jubilee Hall', code: 'DJH', type: 'ugel' as const },
];

const UGEL_HALL_CODES = new Set(['HLH', 'AAK', 'EFS', 'JNA', 'DJH']);
const TRADITIONAL_ANNEX_HALLS = new Set(['AKU', 'LEG', 'MSH']);
const TRADITIONAL_BLOCK_HALLS = new Set(['CMH']);

export async function seedHalls(): Promise<void> {
  for (const hall of APPROVED_HALLS) {
    await Hall.findOneAndUpdate(
      { code: hall.code },
      { $setOnInsert: { name: hall.name, code: hall.code, type: hall.type, active: true } },
      { upsert: true, returnDocument: 'after' },
    );
  }
}

export async function getAllHalls() {
  return Hall.find().sort({ name: 1 }).lean();
}

export async function getHallById(hallId: string) {
  const hall = await Hall.findById(hallId).lean();
  if (!hall) throw new AppError(404, ErrorCodes.NOT_FOUND, 'Hall not found');
  return hall;
}

export async function getLocationsByHallId(hallId: string) {
  return Location.find({ hallId }).sort({ block: 1, floor: 1, room: 1, commonArea: 1 }).lean();
}

export async function updateHall(hallId: string, input: UpdateHallInput) {
  const hall = await Hall.findByIdAndUpdate(hallId, { $set: input }, { returnDocument: 'after' }).lean();
  if (!hall) throw new AppError(404, ErrorCodes.NOT_FOUND, 'Hall not found');
  return hall;
}

export async function seedLocations(): Promise<void> {
  const halls = await Hall.find().lean();
  for (const hall of halls) {
    await seedHallLocations(hall._id as mongoose.Types.ObjectId, hall.code);
  }
}

async function seedHallLocations(hallId: mongoose.Types.ObjectId, code: string): Promise<void> {
  const operations: Record<string, unknown>[] = [];
  const roomsPerFloor = 20;

  function pushRoom(block: string, floor: string, room: string) {
    operations.push({
      updateOne: {
        filter: { hallId, type: 'room', block, floor, room },
        update: { $setOnInsert: { hallId, type: 'room', block, floor, room, active: true } },
        upsert: true,
      },
    });
  }

  function pushCommonArea(
    type: 'washroom' | 'corridor' | 'common_area',
    block: string | undefined,
    floor: string | undefined,
    commonArea: string,
  ) {
    const filter: Record<string, unknown> = { hallId, type, commonArea };
    if (block !== undefined) filter.block = block;
    if (floor !== undefined) filter.floor = floor;

    const setOnInsert: Record<string, unknown> = { hallId, type, commonArea, active: true };
    if (block !== undefined) setOnInsert.block = block;
    if (floor !== undefined) setOnInsert.floor = floor;

    operations.push({
      updateOne: {
        filter,
        update: { $setOnInsert: setOnInsert },
        upsert: true,
      },
    });
  }

  if (UGEL_HALL_CODES.has(code)) {
    for (let block = 1; block <= 4; block++) {
      for (let floor = 0; floor <= 4; floor++) {
        for (let r = 1; r <= roomsPerFloor; r++) {
          const room = `${block}${floor}${String(r).padStart(2, '0')}`;
          pushRoom(String(block), String(floor), room);
        }
        pushCommonArea('washroom', String(block), String(floor), `Washroom ${block}${floor}00s`);
        pushCommonArea('corridor', String(block), String(floor), `Corridor ${block}${floor}00s`);
      }
    }
    pushCommonArea('common_area', undefined, undefined, 'Kitchen');
    pushCommonArea('common_area', undefined, undefined, 'Laundry');
    pushCommonArea('common_area', undefined, undefined, 'Common Room');
  } else if (code === 'VOL') {
    for (let r = 1; r <= 100; r++) {
      pushRoom('Main', '1', String(r));
    }
    pushCommonArea('common_area', 'Main', undefined, 'Main Hall Quadrangle');
    pushCommonArea('common_area', undefined, undefined, 'Kitchen');
    pushCommonArea('common_area', undefined, undefined, 'Laundry');
    pushCommonArea('common_area', undefined, undefined, 'Common Room');
  } else if (TRADITIONAL_ANNEX_HALLS.has(code) || TRADITIONAL_BLOCK_HALLS.has(code)) {
    const annexes = ['A', 'B', 'C', 'D'];
    for (const annex of annexes) {
      const block = TRADITIONAL_BLOCK_HALLS.has(code) ? `Block ${annex}` : `Annex ${annex}`;
      for (let floor = 1; floor <= 5; floor++) {
        for (let r = 1; r <= roomsPerFloor; r++) {
          const room = `${annex}${floor}${String(r).padStart(2, '0')}`;
          pushRoom(block, String(floor), room);
        }
        pushCommonArea('washroom', block, String(floor), `Washroom ${annex}${floor}`);
        pushCommonArea('corridor', block, String(floor), `Corridor ${annex}${floor}`);
      }
    }
    pushCommonArea('common_area', undefined, undefined, 'Kitchen');
    pushCommonArea('common_area', undefined, undefined, 'Laundry');
    pushCommonArea('common_area', undefined, undefined, 'Common Room');
  }

  const existing = await Location.countDocuments({ hallId });
  if (existing > 0) {
    logger.info({ hall: code }, 'Hall locations already seeded, skipping');
    return;
  }

  if (operations.length > 0) {
    await Location.bulkWrite(operations as never, { ordered: false });
    logger.info({ hall: code, locations: operations.length }, 'Hall locations seeded');
  }
}
