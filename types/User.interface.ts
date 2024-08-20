import { Document } from "mongoose";

export interface IUserDocument extends Document {
  password: String;
  confirmPassword?: String;
  updatedAt?: Date;
  firstName: String;
  lastName: String;
  email: String;
  username: String;
}
