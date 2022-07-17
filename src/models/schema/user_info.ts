import { Schema, model } from 'mongoose'
import crypto from 'crypto'
import moment from 'moment-timezone'
import config from '@config';
import { IUser } from '@type/model';
import { baseStatic, baseMethod, baseInfo } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String,
  },
  available: {
    type: Number,
    default: 1,
    comment: '上下线与status是有区别的',
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  updatedAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  account: {
    type: String,
  },
  nickname: {
    type: String,
  },
  avatar: {
    type: String,
    default: '',
  },
  pass: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
    default: '',
  },
}, {
  strict: true,
  collection: 'user_info',
});

schema.static(baseStatic);
schema.method({
  ...baseMethod,
  isEqualPass: function (pass: string) {
    return crypto.createHmac('sha1', this._doc.salt).update(pass).digest('hex') === this._doc.pass;
  }
});

const Model = model<IUser>('User', schema, 'user_info');

module.exports = Model