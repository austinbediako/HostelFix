import mongoose from 'mongoose';
import { User } from './src/modules/users/user.model.js';
import { env } from './src/config/environment.js';
import { connectDB } from './src/config/database.js';

async function run() {
  await connectDB();
  const users = await User.find({ role: { $in: ['maintenance', 'hall_manager', 'university_admin', 'system_admin'] } }).populate('assignedHallIds');
  for (const u of users) {
    console.log(`Role: ${u.role}, Email: ${u.email}, Halls: ${u.assignedHallIds.map(h => (h as any).name).join(', ')}`);
  }
  process.exit(0);
}
run();
