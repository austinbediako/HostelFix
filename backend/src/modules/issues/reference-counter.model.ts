import mongoose from 'mongoose';

export interface IReferenceCounter {
  _id: mongoose.Types.ObjectId;
  hallCode: string;
  date: string;
  sequence: number;
}

const referenceCounterSchema = new mongoose.Schema<IReferenceCounter>(
  {
    hallCode: { type: String, required: true },
    date: { type: String, required: true },
    sequence: { type: Number, required: true, default: 0 },
  },
  { timestamps: false },
);

referenceCounterSchema.index({ hallCode: 1, date: 1 }, { unique: true });

export const ReferenceCounter = mongoose.model<IReferenceCounter>(
  'ReferenceCounter',
  referenceCounterSchema,
);
