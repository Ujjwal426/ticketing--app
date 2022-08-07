import { Schema, model } from 'mongoose';
import { User } from '../interfaces/user.interface';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      required: true,
      default: 'employee',
    },
  },
  {
    timestamps: true,
  },
);

export default model<User>('User', userSchema);
