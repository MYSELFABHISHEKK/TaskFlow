import express from 'express';
import { body } from 'express-validator';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/')
  .get(getTasks)
  .post([
    body('title').trim().isLength({ min: 2 }),
    body('project').isMongoId(),
    body('assignedTo').optional().isMongoId(),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done'])
  ], validate, createTask);

router.route('/:id')
  .get(getTask)
  .put([
    body('title').optional().trim().isLength({ min: 2 }),
    body('assignedTo').optional().isMongoId(),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done'])
  ], validate, updateTask)
  .delete(deleteTask);

export default router;
