import { Schema, model } from 'mongoose'
import { IComponent } from '../../types/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  project_id: {
    type: String,
    default: ''
  },
  // btn,icon,searchBtn,layout,align-side,align-center,align-around,full-width,full-width-fix,full-width-auto,full-height,full-height-fix,full-height-auto,
  // filter,filter-row,filter-tag,tab,tab-item,tabbar,tabbar-item
  // safearea,hotarea,menuitems,slide-card,carousel-card,tips-card,
  // link-item(type,icon,name,)
  type: {
    type: String,
  },
  status: {
    type: Number,
    default: 1,
  },
  accepts: [String],
  attrs: {
    type: Object,
    default: {},
  },
  order: {
    type: Number,
    default: 1
  }
}, {
  strict: true,
  collection: 'config_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IComponent>('Component', schema, 'component_info');

module.exports = Model