import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv/config';
import { HttpException } from '../exceptions/HttpException';
import { DataStoredToken, RequestWithUser } from '../interfaces/auth.interface';
import userModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new HttpException(404, 'Invalid Authentication Token....');
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.SECRET_KEY;
    const payload = verify(token, secretKey) as DataStoredToken;
    if (!payload) {
      throw new HttpException(401, 'Invalid Authentication Token....');
    }
    const findUser: User = await userModel.findById(payload._id);
    if (findUser) {
      req.body.user = findUser;
      next();
    } else {
      throw new HttpException(401, 'Invalid Authentication Token');
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
