import MAccount from './schema/account_info'
import MApp from './schema/app_info'
import MComponent from './schema/component_info'
import MComponentType from './schema/component_type'
import MConfig from './schema/config_info'
import MJob from './schema/job_info'
import MLoginLog from './schema/login_info'
import MModule from './schema/module_info'
import MPage from './schema/page_info'
import MProject from './schema/project_info'
import MStock from './schema/stock_info'
import MUser from './schema/user_info'

//import path from 'path';
// import _ from 'lodash'
// import loader from '../utils/loader'

// const models: any = {}

// loader({
//   dir: path.join(__dirname, 'schema'),
//   recusive: true,
// }, function (info) {
//   const model = require(info.fullpath);
//   if (model) {
//     const name = model.modelName;
//     models[name] = model;
//   }
// });

export default {
  MAccount,
  MApp,
  MComponent,
  MComponentType,
  MConfig,
  MJob,
  MLoginLog,
  MModule,
  MPage,
  MProject,
  MStock,
  MUser,
};