import { Schema, model } from 'mongoose'
import { IPage } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  user_id: {
    type: String,
    default: ''
  },
}, {
  strict: true,
  collection: 'project_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IPage>('Project', schema, 'project_info');

module.exports = Model