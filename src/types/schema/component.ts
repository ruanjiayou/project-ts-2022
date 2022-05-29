import { Document, Model } from 'mongoose'

export interface ComponentDoc extends Document {
  _id: string;
  title: string;
  name: string;
  cover: string;
  desc: string;
  accepts: string[];
  status: number;
}

export interface ComponentModel extends Model<ComponentDoc> {

}
