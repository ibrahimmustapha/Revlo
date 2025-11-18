import { NextFunction, Request, Response } from 'express';

// Simple error handler to ensure consistent JSON responses
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
};
