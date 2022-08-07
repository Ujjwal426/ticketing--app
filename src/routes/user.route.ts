import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Routes } from '../interfaces/routes.interface';

class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/new`, this.userController.createUser);
  }
}

export default UserRoute;
