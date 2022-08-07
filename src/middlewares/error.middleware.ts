import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';

export const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = err.status || 500;
    const message: string = err.message || `Something went wrong`;

    res.status(status).json({ message });
  } catch (err) {
    next(err);
  }
};
