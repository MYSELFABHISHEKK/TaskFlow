import express from 'express';
import { body } from 'express-validator';
import { createUser, deleteUser, getUsers } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect, adminOnly);

router.route('/')
  .get(getUsers)
  .post([
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'member'])
  ], validate, createUser);

router.delete('/:id', deleteUser);

export default router;
