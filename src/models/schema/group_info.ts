import { Schema, model } from 'mongoose'
import moment from 'moment-timezone'
import config from '@root/config/index'
import { IGroup } from '@root/types/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  available: {
    type: Number,
    default: 1,
    comment: '上下线与status是有区别的',
  },
  created_time: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  modified_time: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  status: {
    type: Number,
    default: 1,
  },
  resource_type: {
    type: String,
  },
  duanmu_enabled: {
    type: Boolean,
    default: true,
  },
}, {
  strict: true,
  collection: 'group_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IGroup>('Group', schema, 'group_info');

module.exports = Model