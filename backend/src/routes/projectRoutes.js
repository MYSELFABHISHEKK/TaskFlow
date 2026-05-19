import express from 'express';
import { body } from 'express-validator';
import { addMember, createProject, deleteProject, getProject, getProjects, removeMember, updateProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loadProject, projectAdmin, projectMember } from '../middleware/projectAccess.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/')
  .get(getProjects)
  .post([
    body('title').trim().isLength({ min: 2 }),
    body('description').optional().trim()
  ], validate, createProject);

router.route('/:id')
  .get(loadProject, projectMember, getProject)
  .put(loadProject, projectAdmin, [
    body('title').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim()
  ], validate, updateProject)
  .delete(loadProject, projectAdmin, deleteProject);

router.post('/:id/members', loadProject, projectAdmin, [
  body('email').optional().isEmail().normalizeEmail(),
  body('userId').optional().isMongoId(),
  body().custom((value) => {
    if (!value.email && !value.userId) throw new Error('Email or userId is required');
    return true;
  })
], validate, addMember);
router.delete('/:id/members/:userId', loadProject, projectAdmin, removeMember);

export default router;
