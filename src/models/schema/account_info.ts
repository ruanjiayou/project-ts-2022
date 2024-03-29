import { Schema, model } from 'mongoose'
import crypto from 'crypto'
import moment from 'moment-timezone'
import config from '@config';
import { IAccount, MAccount } from '@type/model';
import { baseStatic, baseMethod, baseInfo } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String,
  },
  user_id: {
    type: String,
  },
  sns_id: {
    type: String,
  },
  sns_type: {
    type: String,
  },
  sns_name: { type: String, },
  sns_icon: { type: String, },
  sns_info: {
    type: Object,
  },
  sns_status: {
    type: Number,
    default: 1,
  },
  access_token: { type: String, },
  refresh_token: { type: String, },
  access_expires_in: { type: Number },
  refresh_expires_in: { type: Number },
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
  collection: 'account_info',
});

schema.static(baseStatic);
schema.method({
  ...baseMethod,
});

const Model = model<IAccount>('Account', schema, 'account_info') as MAccount;

export default Model