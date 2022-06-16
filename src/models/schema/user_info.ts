import { Schema, model } from 'mongoose'
import { IUser } from '../../types/model';
import { baseStatic, baseMethod, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
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
    return this.pass === pass;
  }
});

const Model = model<IUser>('User', schema, 'user_info');

module.exports = Model