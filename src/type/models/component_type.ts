import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IComponentType extends BaseDocument, Document {
  order: number;
}

export interface MComponentType extends BaseModel<IComponentType>, Model<IComponentType> {

}