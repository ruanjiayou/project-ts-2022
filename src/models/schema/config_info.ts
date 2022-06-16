import { Schema, model } from 'mongoose'
import { IConfig } from '../../types/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  project_id: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 1,
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

const Model = model<IConfig>('Config', schema, 'config_info');

module.exports = Model