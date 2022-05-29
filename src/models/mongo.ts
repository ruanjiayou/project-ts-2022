import path from 'path';
import mongoose from 'mongoose';
import _ from 'lodash'
import loader from '../utils/loader'

const models: any = {}

loader({
  dir: path.join(__dirname, 'schema'),
  recusive: true,
}, function (info) {
  const name = _.upperFirst(_.camelCase(info.filename));
  const model = require(info.fullpath);
  if (model) {
    models[name] = model;
  }
});

export = models;