import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IUser extends Document {
  _id: string;
  pass: string;
  salt: string;
  account: string;
  avatar: string;
  nickname: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  isEqualPass(pass: string): boolean;
}

export interface MUser extends BaseModel<IUser>, Model<IUser> {

}