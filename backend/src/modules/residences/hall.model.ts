import mongoose from 'mongoose';
import { HALL_TYPES, type HallType } from '../../shared/constants/locations.js';

export interface IHall {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  type: HallType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hallSchema = new mongoose.Schema<IHall>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    type: { type: String, enum: HALL_TYPES, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

hallSchema.index({ type: 1 });

export const Hall = mongoose.model<IHall>('Hall', hallSchema);
