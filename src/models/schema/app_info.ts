import { Schema, model } from 'mongoose'
import { IPage } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  user_id: {
    type: String,
    default: ''
  },
}, {
  strict: true,
  collection: 'app_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IPage>('App', schema, 'app_info');

module.exports = Model