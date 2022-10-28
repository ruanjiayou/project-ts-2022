import { Schema, model } from 'mongoose'
import moment from 'moment-timezone'
import config from '@config';
import { IUser } from '@type/model';
import { baseStatic, baseMethod, baseInfo } from '../base'
import { v4 } from 'uuid';

const schema: Schema = new Schema({
  _id: {
    type: String,
    default: () => v4(),
  },
  user_id: String,
  account_id: String,
  log_time: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  log_ip: String,
  log_device: String, // platform: pc/web/window/mac/ios/android/pad/watch model: 10.2 version: 1.0.1
  log_plat: String,
  log_version: String,
  log_model: String,
  log_region: String,
}, {
  strict: true,
  collection: 'login_info',
});

schema.static(baseStatic);
schema.method({
  ...baseMethod,
});

const Model = model<IUser>('LoginLog', schema, 'login_info');

module.exports = Model