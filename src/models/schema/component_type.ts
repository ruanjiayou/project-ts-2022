import { Schema, model } from 'mongoose'
import { IComponentType, MComponentType } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  order: {
    type: Number,
    default: 1
  }
}, {
  strict: true,
  collection: 'component_type',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IComponentType>('ComponentType', schema, 'component_type') as MComponentType;

export default Model