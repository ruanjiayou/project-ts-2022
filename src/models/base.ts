import _ from 'lodash'
import moment from 'moment-timezone'
import { Hql } from '@type/model'
import config from '@config'

function init(query: any): Hql {
  const hql: Hql = {
    where: query.where || {},
    order: query.order || {},
    attrs: query.attrs || {},
    lean: query.lean || false,
    count: _.isBoolean(query.count) ? query.count : false,
    data: query.data,
    options: {},
    page: query.page || 1,
    limit: query.limit || 20,
  }
  // mongodb查询条件$字符需要特殊处理
  for (let key in hql.where) {
    if (_.isPlainObject(hql.where[key])) {
      for (let k2 in hql.where[key]) {
        if (k2.startsWith('__')) {
          let k = k2.replace('__', '$');
          hql.where[key][k] = hql.where[key][k2]
          delete hql.where[key][k2];
        }
      }
    }
  }

  return hql;
}

export const baseInfo = {
  _id: {
    type: String,
  },
  title: {
    type: String,
  },
  name: {
    type: String,
  },
  cover: {
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
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  updatedAt: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
};

// 基本静态方法
export const baseStatic = {
  async getAll(opts = {}) {
    const opt = init(opts);
    const items = await this.find(opt.where).sort(opt.order).lean(opt.lean);
    return { items };
  },
  async getList(opts = {}) {
    const opt = init(opts);
    const result: { items: any, total?: number } = { items: [] }
    result.items = await this.find(opt.where).skip((opt.page - 1) * opt.limit).limit(opt.limit).sort(opt.order).lean(opt.lean);
    if (opt.count) {
      result.total = await this.countDocuments(opt.where)
    }
    return result;
  },
  async getInfo(opts = {}) {
    const opt = init(opts);
    return this.findOne(opt.where).lean(opt.lean);
  },
  async destroy(opts = {}) {
    const opt = init(opts);
    return this.deleteMany(opt.where);
  }
}

// 基本实例方法
export const baseMethod = {
  toJSON() {
    const doc = this.toObject();
    doc.id = doc._id;
    delete doc._id;
    delete doc.__v;
    return doc;
  }
}