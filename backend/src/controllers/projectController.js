import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const populateProject = (query) => query.populate('admin members', 'name email role avatarColor');

export const getProjects = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { $or: [{ admin: req.user._id }, { members: req.user._id }] }
    : { members: req.user._id };
  const projects = await populateProject(Project.find(filter).sort({ updatedAt: -1 }));
  const ids = projects.map((p) => p._id);
  const grouped = await Task.aggregate([
    { $match: { project: { $in: ids } } },
    { $group: { _id: { project: '$project', status: '$status' }, count: { $sum: 1 } } }
  ]);
  const progress = grouped.reduce((acc, item) => {
    const id = item._id.project.toString();
    acc[id] ||= { total: 0, done: 0 };
    acc[id].total += item.count;
    if (item._id.status === 'Done') acc[id].done += item.count;
    return acc;
  }, {});
  res.json(projects.map((project) => ({ ...project.toObject(), progress: progress[project._id.toString()] || { total: 0, done: 0 } })));
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    admin: req.user._id,
    members: [req.user._id]
  });
  res.status(201).json(await populateProject(Project.findById(project._id)));
});

export const getProject = asyncHandler(async (req, res) => {
  res.json(await populateProject(Project.findById(req.project._id)));
});

export const updateProject = asyncHandler(async (req, res) => {
  req.project.title = req.body.title ?? req.project.title;
  req.project.description = req.body.description ?? req.project.description;
  await req.project.save();
  res.json(await populateProject(Project.findById(req.project._id)));
});

export const deleteProject = asyncHandler(async (req, res) => {
  await Task.deleteMany({ project: req.project._id });
  await req.project.deleteOne();
  res.json({ message: 'Project deleted' });
});

export const addMember = asyncHandler(async (req, res) => {
  const user = req.body.userId
    ? await User.findById(req.body.userId)
    : await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('No registered user found');
  }
  if (!req.project.members.some((id) => id.toString() === user._id.toString())) {
    req.project.members.push(user._id);
    await req.project.save();
  }
  res.json(await populateProject(Project.findById(req.project._id)));
});

export const removeMember = asyncHandler(async (req, res) => {
  if (req.project.admin.toString() === req.params.userId) {
    res.status(400);
    throw new Error('Project admin cannot be removed');
  }
  req.project.members = req.project.members.filter((id) => id.toString() !== req.params.userId);
  await req.project.save();
  await Task.updateMany({ project: req.project._id, assignedTo: req.params.userId }, { assignedTo: req.project.admin });
  res.json(await populateProject(Project.findById(req.project._id)));
});
