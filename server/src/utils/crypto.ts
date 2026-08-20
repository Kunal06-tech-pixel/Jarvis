import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.JWT_SECRET);
};
