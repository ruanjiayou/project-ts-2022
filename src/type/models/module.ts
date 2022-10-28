import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IModule extends BaseDocument, Document {
  _id: string;
  tree_id: string;
  parent_id: string;
  component_id: string;
  component_type: string;
}

export interface MModule extends BaseModel<IModule>, Model<IModule> {

}