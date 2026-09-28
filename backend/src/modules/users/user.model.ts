import mongoose from 'mongoose';
import { ROLES, type Role } from '../../shared/constants/roles.js';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  studentId?: string;
  staffId?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: Role;
  active: boolean;
  assignedHallIds: mongoose.Types.ObjectId[];
  allocatedLocationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    studentId: { type: String, sparse: true, unique: true, trim: true },
    staffId: { type: String, sparse: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), required: true },
    active: { type: Boolean, default: true },
    assignedHallIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hall', default: [] }],
    allocatedLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ assignedHallIds: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
