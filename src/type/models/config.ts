import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IConfig extends BaseDocument, Document {

  project_id?: string;
  type?: string;
  value?: object;
  order?: number;
}

export interface MConfig extends BaseModel<IConfig>, Model<IConfig> {

}