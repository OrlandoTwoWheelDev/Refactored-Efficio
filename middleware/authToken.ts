import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/utilities/env.js';
import { NextFunction } from 'express';

export const authToken = (
  req: import('express').Request,
  res: import('express').Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'] as string | undefined;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
