import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const palette = ['#111827', '#475569', '#0f766e', '#7c3aed', '#be123c', '#0369a1'];

export const register = asyncHandler(async (req, res) => {
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
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarColor: user.avatarColor }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarColor: user.avatarColor }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
