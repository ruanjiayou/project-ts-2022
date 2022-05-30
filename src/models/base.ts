import _ from 'lodash'
import { Document, Model, Schema } from 'mongoose';
import { Hql } from '../types/IBaseDocument'

function init(query: any): Hql {
  const hql: Hql = {
    where: query.where,
    order: query.order,
    attrs: query.attrs,
    lean: query.lean || false,
    data: query.data,
    options: {},
  }
  return hql;
}

export class BaseModel extends Model {
  getAll(opts = {}) {
    const opt = init(opts);
    return this.find(opt.where).sort(opt.order).lean(opt.lean);
  }
  getList(opts = {}) {
    const opt = init(opts);
    return this.find(opt.where).sort(opt.order).lean(opt.lean);
  }
  getInfo(opts = {}) {
    const opt = init(opts);
    return this.findOne(opt.where).lean(opt.lean);
  }
}