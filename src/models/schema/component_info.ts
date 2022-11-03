import { Schema, model } from 'mongoose'
import { IComponent, MComponent } from '@type/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  ...baseInfo,
  project_id: {
    type: String,
    default: ''
  },
  // layout,align-side,align-center,align-around,full-width,full-width-fix,full-width-auto,full-height,full-height-fix,full-height-auto,
  // filter,filter-row,filter-tag,tab,tab-item,tabbar,tabbar-item
  // safearea,hotarea,menuitems,slide-card,carousel-card,tips-card,
  // btn,icon,searchBtn,link-item(type,icon,name,)
  type: {
    type: String, // layout, ui, container, 
  },
  parent_id: {
    type: String,
    default: ''
  },
  tree_id: {
    type: String,
    default: ''
  },
  accepts: [String],
  attrs: {
    type: Object,
    default: {},
  },
  source: {
    type: {
      type: String, // url group
    },
    url: String,
  },
  order: {
    type: Number,
    default: 1
  }
}, {
  strict: true,
  collection: 'component_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IComponent>('Component', schema, 'component_info') as MComponent;

export default Model