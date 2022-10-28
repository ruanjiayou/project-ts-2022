import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IApp extends BaseDocument, Document {
  user_id: string;
}

export interface MApp extends BaseModel<IApp>, Model<IApp> {

}
