import { Document, Model } from 'mongoose'

export interface ConfigDoc extends Document {
  _id: string;
  project_id: string;
  name: string;
  desc: string;
  type: string;
  value: object;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  toJSON(this: Document): any;
}

export interface ConfigModel extends Model<ConfigDoc> {

}
