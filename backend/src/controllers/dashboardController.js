import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const projectFilter = req.user.role === 'admin'
    ? { $or: [{ admin: req.user._id }, { members: req.user._id }] }
    : { members: req.user._id };
  const projects = await Project.find(projectFilter).select('_id');
  const base = { project: { $in: projects.map((p) => p._id) } };
  if (req.user.role === 'member') base.assignedTo = req.user._id;

  const now = new Date();
  const [tasks, statusData, userData, recent, assignedTasks] = await Promise.all([
    Task.find(base),
    Task.aggregate([{ $match: base }, { $group: { _id: '$status', value: { $sum: 1 } } }]),
    Task.aggregate([
      { $match: base },
      { $group: { _id: '$assignedTo', value: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', value: 1 } }
    ]),
    Task.find(base).sort({ updatedAt: -1 }).limit(6).populate('assignedTo project', 'name title avatarColor'),
    Task.find({ ...base, assignedTo: req.user._id }).sort({ dueDate: 1, updatedAt: -1 }).limit(6).populate('assignedTo createdBy project', 'name email avatarColor title')
  ]);

  res.json({
    totals: {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'Done').length,
      pending: tasks.filter((task) => task.status !== 'Done').length,
      overdue: tasks.filter((task) => task.status !== 'Done' && task.dueDate && task.dueDate < now).length
    },
    byStatus: ['To Do', 'In Progress', 'Done'].map((name) => ({ name, value: statusData.find((item) => item._id === name)?.value || 0 })),
    perUser: userData,
    recent,
    assignedTasks
  });
});
