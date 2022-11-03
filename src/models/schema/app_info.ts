import { Schema, model } from 'mongoose'
import { IApp, MApp } from '@type/model';
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

const Model = model<IApp>('App', schema, 'app_info') as MApp;

export default Model