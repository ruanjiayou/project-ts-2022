import { Schema, model } from 'mongoose'
import { IModule, MModule } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
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

const Model = model<IModule>('Module', schema, 'module_info') as MModule;

export default Model