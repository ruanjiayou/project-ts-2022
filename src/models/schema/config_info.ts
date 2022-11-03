import { Schema, model } from 'mongoose'
import { IConfig, MConfig } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  project_id: {
    type: String,
    default: ''
  },
  type: {
    type: String,
  },
  value: {
    type: Object,
    default: {},
  },
  order: {
    type: Number,
    default: 1
  }
}, {
  strict: true,
  collection: 'config_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IConfig>('Config', schema, 'config_info') as MConfig;

export default Model