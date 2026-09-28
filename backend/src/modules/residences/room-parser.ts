import mongoose from 'mongoose';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import { Hall } from './hall.model.js';
import { Location } from './location.model.js';
import type { ILocation } from './location.model.js';

const UGEL_HALL_CODES = new Set(['HLH', 'AAK', 'EFS', 'JNA', 'DJH']);
const TRADITIONAL_ANNEX_HALLS = new Set(['AKU', 'LEG', 'MSH']);
const TRADITIONAL_BLOCK_HALLS = new Set(['CMH']);

interface ParsedRoom {
  isValid: true;
  hallType: 'UGEL' | 'Traditional' | 'Main';
  block: string;
  floor: string;
  room: string;
  formattedString: string;
}

interface ParseError {
  isValid: false;
  error: string;
}

type ParseResult = ParsedRoom | ParseError;

function cleanInput(rawInput: string): string {
  return rawInput
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/^(ROOM|ANNEX|BLOCK)/, '');
}

export function parseUGRoom(hallCode: string, rawInput: string): ParseResult {
  const cleaned = cleanInput(rawInput);

  if (UGEL_HALL_CODES.has(hallCode)) {
    const ugelRegex = /^([1-4])([0-4])(\d{2})$/;
    const match = cleaned.match(ugelRegex);
    if (match) {
      const block = `Block ${match[1]}`;
      const floor = match[2];
      return {
        isValid: true,
        hallType: 'UGEL',
        block,
        floor,
        room: cleaned,
        formattedString: `${block}, Floor ${floor}, Room ${cleaned}`,
      };
    }
    return { isValid: false, error: 'UGEL rooms must be 4 digits (e.g., 3215)' };
  }

  if (TRADITIONAL_ANNEX_HALLS.has(hallCode) || TRADITIONAL_BLOCK_HALLS.has(hallCode)) {
    const tradRegex = /^([A-Z])([1-5]?)(\d{1,2})$/;
    const match = cleaned.match(tradRegex);
    if (match) {
      const blockChar = match[1];
      const floor = match[2] || '1';
      const block = TRADITIONAL_BLOCK_HALLS.has(hallCode) ? `Block ${blockChar}` : `Annex ${blockChar}`;
      return {
        isValid: true,
        hallType: 'Traditional',
        block,
        floor,
        room: cleaned,
        formattedString: `${block}, Floor ${floor}, Room ${cleaned}`,
      };
    }
    return {
      isValid: false,
      error: 'Traditional rooms usually start with a block letter (e.g., C310)',
    };
  }

  if (hallCode === 'VOL') {
    const voltaRegex = /^(\d{1,3})$/;
    if (cleaned.match(voltaRegex)) {
      return {
        isValid: true,
        hallType: 'Main',
        block: 'Main Hall',
        floor: '1',
        room: cleaned,
        formattedString: `Main Hall, Room ${cleaned}`,
      };
    }
  }

  return { isValid: false, error: 'Unrecognized hall code or room format.' };
}

export async function resolveRoomLocation(
  hallId: string,
  rawInput: string,
): Promise<ILocation> {
  const hall = await Hall.findById(hallId).lean();
  if (!hall) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, 'Hall not found');
  }

  const parsed = parseUGRoom(hall.code, rawInput);
  if (!parsed.isValid) {
    throw new AppError(400, ErrorCodes.BAD_REQUEST, parsed.error);
  }

  const location = (await Location.findOneAndUpdate(
    { hallId: hall._id as mongoose.Types.ObjectId, type: 'room', block: parsed.block, floor: parsed.floor, room: parsed.room },
    {
      $setOnInsert: {
        hallId: hall._id as mongoose.Types.ObjectId,
        type: 'room',
        block: parsed.block,
        floor: parsed.floor,
        room: parsed.room,
        active: true,
      },
    },
    { upsert: true, returnDocument: 'after' },
  )) as ILocation | null;

  if (!location) {
    throw new AppError(500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Failed to resolve location');
  }

  return location;
}
