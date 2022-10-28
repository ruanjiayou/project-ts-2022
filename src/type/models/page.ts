import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IPage extends BaseDocument, Document {
  _id: string;
  project_id: string;
  template: string;
  tree_id: string;
}

export interface MPage extends BaseModel<IPage>, Model<IPage> {

}