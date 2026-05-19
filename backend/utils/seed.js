import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import Project from '../src/models/Project.js';
import Task from '../src/models/Task.js';

await connectDB();
await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany()]);

const admin = await User.create({ name: 'Ryan Stone', email: 'admin@taskflow.dev', password: 'password123', role: 'admin', avatarColor: '#111827' });
const member = await User.create({ name: 'Jordan Lee', email: 'member@taskflow.dev', password: 'password123', role: 'member', avatarColor: '#0f766e' });
const project = await Project.create({ title: 'Launch Operations', description: 'Coordinate the design, engineering, and release checklist for a polished launch.', admin: admin._id, members: [admin._id, member._id] });

await Task.create([
  { title: 'Finalize dashboard metrics', description: 'Review stat cards and chart labels for launch readiness.', dueDate: new Date(Date.now() + 86400000 * 2), priority: 'High', status: 'In Progress', assignedTo: admin._id, project: project._id, createdBy: admin._id },
  { title: 'QA responsive board', description: 'Verify kanban interactions across desktop and mobile.', dueDate: new Date(Date.now() + 86400000 * 4), priority: 'Medium', status: 'To Do', assignedTo: member._id, project: project._id, createdBy: admin._id },
  { title: 'Publish onboarding notes', description: 'Add quick-start guidance for new workspace members.', dueDate: new Date(), priority: 'Low', status: 'Done', assignedTo: member._id, project: project._id, createdBy: admin._id }
]);

console.log('Seed complete: admin@taskflow.dev / member@taskflow.dev with password password123');
process.exit(0);
