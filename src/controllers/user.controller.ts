import { Request, Response, NextFunction } from 'express';
import { User } from 'interfaces/user.interface';
import UserService from '../services/user.service';
import { HttpException } from '../exceptions/HttpException';

export class UserController {
  public userService = new UserService();
  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody: User = req.body;
      const createUserData: User = await this.userService.createUser(reqBody);
      const token = this.userService.createToken(createUserData);
      if (!token) throw new HttpException(400, 'Please provide token');
      res.status(201).json({ data: createUserData, token, message: `User created` });
    } catch (err) {
      next(err);
    }
  };
}
