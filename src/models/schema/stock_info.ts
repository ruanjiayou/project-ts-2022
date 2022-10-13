import { Schema, model } from 'mongoose'
import { IComponent } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  code: String,
  se: String,
  price: Number,
}, {
  strict: true,
  collection: 'stock_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IComponent>('Stock', schema, 'stock_info');

module.exports = Model