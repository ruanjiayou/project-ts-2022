import { Schema, model } from 'mongoose'
import { IProject, MProject } from '@type/model';
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

const Model = model<IProject>('Project', schema, 'project_info') as MProject;

export default Model