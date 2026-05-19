import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const palette = ['#111827', '#475569', '#0f766e', '#7c3aed', '#be123c', '#0369a1'];

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const [taskStats, projectStats] = await Promise.all([
    Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] } },
          pendingTasks: { $sum: { $cond: [{ $ne: ['$status', 'Done'] }, 1, 0] } }
        }
      }
    ]),
    Project.aggregate([
      { $unwind: '$members' },
      { $group: { _id: '$members', projectCount: { $sum: 1 } } }
    ])
  ]);

  const tasksByUser = new Map(taskStats.map((item) => [item._id.toString(), item]));
  const projectsByUser = new Map(projectStats.map((item) => [item._id.toString(), item.projectCount]));

  res.json(users.map((user) => {
    const id = user._id.toString();
    const stats = tasksByUser.get(id) || {};
    return {
      ...user.toObject(),
      stats: {
        totalTasks: stats.totalTasks || 0,
        completedTasks: stats.completedTasks || 0,
        pendingTasks: stats.pendingTasks || 0,
        projectCount: projectsByUser.get(id) || 0
      }
    };
  }));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'member' } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email is already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatarColor: palette[Math.floor(Math.random() * palette.length)]
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarColor: user.avatarColor,
    stats: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, projectCount: 0 }
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot remove your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const ownedProjects = await Project.countDocuments({ admin: user._id });
  if (ownedProjects > 0) {
    res.status(400);
    throw new Error('Transfer or delete this admin projects before removing the account');
  }

  await Project.updateMany({ members: user._id }, { $pull: { members: user._id } });
  await Task.updateMany({ assignedTo: user._id }, { assignedTo: req.user._id });
  await user.deleteOne();

  res.json({ message: 'Member removed' });
});
