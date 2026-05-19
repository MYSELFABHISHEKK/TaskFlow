import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

const populated = (query) => query
  .populate('assignedTo createdBy', 'name email role avatarColor')
  .populate('project', 'title admin members');

const canAccessProject = (project, user) => {
  const id = user._id.toString();
  return project.admin.toString() === id || project.members.some((member) => member.toString() === id);
};

const canManageTask = (task, user) => user.role === 'admin' || String(task.createdBy?._id || task.createdBy) === user._id.toString();

export const getTasks = asyncHandler(async (req, res) => {
  const { project, status, priority, search } = req.query;
  const projectFilter = req.user.role === 'admin'
    ? { $or: [{ admin: req.user._id }, { members: req.user._id }] }
    : { members: req.user._id };
  const projects = await Project.find(project ? { _id: project, ...projectFilter } : projectFilter).select('_id');
  const filter = { project: { $in: projects.map((p) => p._id) } };
  if (req.user.role === 'member') filter.assignedTo = req.user._id;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.$text = { $search: search };
  res.json(await populated(Task.find(filter).sort({ updatedAt: -1 })));
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project || !canAccessProject(project, req.user)) {
    res.status(403);
    throw new Error('Project access denied');
  }
  if (project.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can create tasks');
  }
  const assignee = req.body.assignedTo || req.user._id;
  const isMember = project.members.some((id) => id.toString() === assignee.toString()) || project.admin.toString() === assignee.toString();
  if (!isMember) {
    res.status(400);
    throw new Error('Assignee must be a project member');
  }
  const task = await Task.create({ ...req.body, assignedTo: assignee, createdBy: req.user._id });
  const fullTask = await populated(Task.findById(task._id));
  req.app.get('io')?.to(project._id.toString()).emit('task:created', fullTask);
  res.status(201).json(fullTask);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await populated(Task.findById(req.params.id));
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (!canAccessProject(task.project, req.user) || (req.user.role === 'member' && task.assignedTo._id.toString() !== req.user._id.toString())) {
    res.status(403);
    throw new Error('Task access denied');
  }
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (!canAccessProject(task.project, req.user)) {
    res.status(403);
    throw new Error('Task access denied');
  }
  const manager = canManageTask(task, req.user) || task.project.admin.toString() === req.user._id.toString();
  const allowed = manager ? ['title', 'description', 'dueDate', 'priority', 'status', 'assignedTo'] : ['status'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });
  task.activity.push({ actor: req.user._id, message: `${req.user.name} updated ${task.title}` });
  await task.save();
  const fullTask = await populated(Task.findById(task._id));
  req.app.get('io')?.to(task.project._id.toString()).emit('task:updated', fullTask);
  res.json(fullTask);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (!(canManageTask(task, req.user) || task.project.admin.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Only admins can delete tasks');
  }
  await task.deleteOne();
  req.app.get('io')?.to(task.project._id.toString()).emit('task:deleted', task._id);
  res.json({ message: 'Task deleted' });
});
