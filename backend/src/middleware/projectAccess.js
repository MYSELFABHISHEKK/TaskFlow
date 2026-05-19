import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

export const loadProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId || req.body.project;
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  req.project = project;
  next();
});

export const projectMember = (req, res, next) => {
  const userId = req.user._id.toString();
  const canAccess = req.project.admin.toString() === userId || req.project.members.some((id) => id.toString() === userId);
  if (!canAccess) {
    res.status(403);
    throw new Error('Project access denied');
  }
  next();
};

export const projectAdmin = (req, res, next) => {
  if (req.project.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the project admin can perform this action');
  }
  next();
};
