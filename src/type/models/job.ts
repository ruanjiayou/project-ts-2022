import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IJob extends BaseDocument, Document {
  type: string;
  value: object;
}

export interface MJob extends BaseModel<IJob>, Model<IJob> {

}