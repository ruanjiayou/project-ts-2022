import mongoose, { Schema, Document, Model } from 'mongoose'
import moment from 'moment-timezone'
import config from '../../config/index'
import { ConfigModel, ConfigDoc } from '../../types/schema/config';

const schema = new Schema({
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

class Custom {
  toJSON() {
    
  }
}

schema.loadClass(Custom);

const model: ConfigModel = mongoose.model<ConfigDoc>('Config', schema, 'config_info');

module.exports = model