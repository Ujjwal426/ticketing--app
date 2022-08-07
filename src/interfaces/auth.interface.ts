import { Request } from 'express';
import { User } from './user.interface';

export interface DataStoredToken {
  _id: string;
}

export interface TokenData {
  token: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
