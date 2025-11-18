import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { loginSchema, registerSchema } from '../../utils/validation';

export const register = async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await AuthService.register(body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await AuthService.login(body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
