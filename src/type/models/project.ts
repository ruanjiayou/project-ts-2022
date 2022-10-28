import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IProject extends BaseDocument, Document {
  user_id: string;
}

export interface MProject extends BaseModel<IProject>, Model<IProject> {

}