import mongoose from 'mongoose';
import { LOCATION_TYPES, type LocationType } from '../../shared/constants/locations.js';

export interface ILocation {
  _id: mongoose.Types.ObjectId;
  hallId: mongoose.Types.ObjectId;
  block?: string;
  floor?: string;
  room?: string;
  commonArea?: string;
  type: LocationType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new mongoose.Schema<ILocation>(
  {
    hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
    block: { type: String, trim: true },
    floor: { type: String, trim: true },
    room: { type: String, trim: true },
    commonArea: { type: String, trim: true },
    type: { type: String, enum: LOCATION_TYPES, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

locationSchema.index(
  { hallId: 1, block: 1, floor: 1, room: 1 },
  { unique: true, partialFilterExpression: { type: 'room' } },
);
locationSchema.index(
  { hallId: 1, commonArea: 1 },
  { unique: true, partialFilterExpression: { type: 'common_area' } },
);
locationSchema.index({ hallId: 1, type: 1 });

export const Location = mongoose.model<ILocation>('Location', locationSchema);
