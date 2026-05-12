import jwt from 'jsonwebtoken';
import { Member } from '../models/Member.js';

export async function protect(req, res, next) {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.member = await Member.findById(decoded.id).select('-password');
    if (!req.member) {
      res.status(401);
      return next(new Error('User not found'));
    }
    next();
  } catch {
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
}

export function adminOnly(req, res, next) {
  if (req.member && req.member.role === 'admin') {
    return next();
  }
  res.status(403);
  return next(new Error('Admin access required'));
}
