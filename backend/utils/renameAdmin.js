import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';

await connectDB();

const user = await User.findOneAndUpdate(
  { email: 'admin@taskflow.dev' },
  { name: 'Ryan Stone' },
  { new: true }
);

if (!user) {
  console.log('No admin@taskflow.dev user found. Run npm run seed first.');
  process.exit(1);
}

console.log(`Admin renamed to ${user.name}`);
process.exit(0);
