import { Schema, model } from 'mongoose'
import moment from 'moment-timezone'
import config from '../../config/index'
import { IConfig } from '../../types/model';
import { baseMethod, baseStatic } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String,
  },
  project_id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
  },
  desc: {
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