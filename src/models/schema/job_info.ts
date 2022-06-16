import { Schema, model } from 'mongoose'
import { IJob } from '../../types/model';
import { baseStatic, baseMethod, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  type: {
    type: String,
  },
  value: {
    type: Object,
    default: {},
  },
}, {
  strict: true,
  collection: 'job_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IJob>('Job', schema, 'job_info');

module.exports = Model