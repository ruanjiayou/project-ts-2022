import path from 'path';
import _ from 'lodash'
import loader from '../utils/loader'

const models: any = {}

loader({
  dir: path.join(__dirname, 'schema'),
  recusive: true,
}, function (info) {
  const model = require(info.fullpath);
  if (model) {
    const name = model.modelName;
    models[name] = model;
  }
});

export = models;