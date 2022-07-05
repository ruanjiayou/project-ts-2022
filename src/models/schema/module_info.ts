import { Schema, model } from 'mongoose'
import { IModule } from '../../types/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  status: {
    type: Number,
    default: 1,
  },
  tree_id: {
    type: String,
  },
  parent_id: {
    type: String,
  },
  component_id: {
    type: String,
  },
  component_type: {
    type: String,
  }
}, {
  strict: true,
  collection: 'module_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IModule>('Module', schema, 'module_info');

module.exports = Model