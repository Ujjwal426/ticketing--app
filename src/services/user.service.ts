import { User } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
import { isEmpty } from '../util/isEmpty';
import { HttpException } from '../exceptions/HttpException';
import { sign } from 'jsonwebtoken';
import { TokenData, DataStoredToken } from 'interfaces/auth.interface';

class UserService {
  public userModel = UserModel;

  public createUser = async (userData: User): Promise<User> => {
    if (isEmpty(userData)) {
      throw new HttpException(400, `Please Provide all values`);
    }
    const findUser = await this.userModel.findOne({ username: userData.username });
    if (findUser) {
      throw new HttpException(409, `Your username ${userData.username} already exists`);
    }
    const createUserData = await this.userModel.create({ ...userData });
    return createUserData;
  };

  public createToken = (user: User): string => {
    const dataStoredInToken: DataStoredToken = { _id: user._id };
    const secretKey: string = process.env.SECRET_KEY;
    const token = sign(dataStoredInToken, secretKey);
    return token;
  };
}

export default UserService;
