import { Schema, model } from 'mongoose'
import moment from 'moment-timezone'
import config from '../../config/index'
import { IJob } from '../../types/model';
import { baseStatic, baseMethod } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  value: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  updatedAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
}, {
  strict: true,
  collection: 'job_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IJob>('Job', schema, 'job_info');

module.exports = Model