import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';

await connectDB();

const user = await User.findOneAndUpdate(
  { email: 'member@taskflow.dev' },
  { name: 'Jordan Lee' },
  { new: true }
);

if (!user) {
  console.log('No member@taskflow.dev user found. Run npm run seed first.');
  process.exit(1);
}

console.log(`Member renamed to ${user.name}`);
process.exit(0);
