import { Schema, model } from 'mongoose'
import { IJob, MJob } from '@type/model';
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

const Model = model<IJob>('Job', schema, 'job_info') as MJob;

export default Model