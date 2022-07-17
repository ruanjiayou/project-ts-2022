import { Schema, model } from 'mongoose'
import { IPage } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  project_id: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    default: ''
  },
  tree_id: {
    type: String,
  },
}, {
  strict: true,
  collection: 'page_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IPage>('Page', schema, 'page_info');

module.exports = Model