import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IUser extends Document {
  _id: string;
  pass: string;
  salt: string;
  account: string;
  area_code: string;
  phone: string;
  email: string;
  avatar: string;
  nickname: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  status: number;
  isEqualPass(pass: string): boolean;
}

export interface MUser extends BaseModel<IUser>, Model<IUser> {

}