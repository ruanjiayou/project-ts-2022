import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IComponent extends BaseDocument, Document {
  accepts: string[];
  status: number;
  parent_id: string;
  tree_id: string;
  children?: IComponent[]
}

export interface MComponent extends BaseModel<IComponent>, Model<IComponent> {

}