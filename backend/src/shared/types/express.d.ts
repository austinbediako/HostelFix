import type { Role } from '../constants/roles.js';
import type mongoose from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: mongoose.Types.ObjectId;
      studentId?: string;
      staffId?: string;
      email: string;
      role: Role;
      assignedHallIds: mongoose.Types.ObjectId[];
      allocatedLocationId?: mongoose.Types.ObjectId;
      name: string;
    }

    interface Request {
      user?: User;
      requestId: string;
    }
  }
}

export {};
