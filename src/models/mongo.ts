import path from 'path';
import mongoose from 'mongoose';
import _ from 'lodash'
import loader, { Info } from '../utils/loader'

const models: any = {}

loader({
  dir: path.join(__dirname, 'schema'),
  recusive: true,
  filter: (info: Info) => info.fullpath.endsWith(process.env.NODE_ENV === 'development' ? '.ts' : '.js'),
}, function (info) {
  const model = require(info.fullpath);
  if (model) {
    const name = model.modelName;
    models[name] = model;
  }
});

export = models;