import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IAccount extends Document {
  _id: string;
  user_id: string;
  sns_id: string;
  sns_type: string;
  sns_name: string;
  sns_icon: string;
  sns_info: Object;
  sns_status: string;
  access_token: string;
  refresh_token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MAccount extends BaseModel<IAccount>, Model<IAccount> {

}