import path from 'path'
import Router from 'koa-router'
import loader from './utils/loader'


const router = new Router();

loader({
  dir: path.join(__dirname, 'routes'),
  recusive: true,
}, function (info) {
  const route = require(info.fullpath).default
  if (route) {
    router.use(route.routes())
  }
});

export default router