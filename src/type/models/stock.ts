import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface IStock extends BaseDocument, Document {
  
}

export interface MStock extends BaseModel<IStock>, Model<IStock> {

}