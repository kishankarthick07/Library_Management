import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Member } from '../models/Member.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const exists = await Member.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 12);
    const member = await Member.create({
      name,
      email,
      password: hashed,
      role: 'member',
    });

    const token = signToken(member._id);
    res.status(201).json({
      success: true,
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const member = await Member.findOne({ email }).select('+password');
    if (!member) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, member.password);
    if (!ok) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = signToken(member._id);
    res.json({
      success: true,
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    member: {
      id: req.member._id,
      name: req.member.name,
      email: req.member.email,
      role: req.member.role,
    },
  });
}
