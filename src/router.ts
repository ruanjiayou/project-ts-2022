import path from 'path'
import Router from 'koa-router'
import loader, { Info } from '@root/utils/loader'


const router = new Router();

loader({
  dir: path.join(__dirname, 'routes'),
  recusive: true,
  filter: (info: Info) => info.fullpath.endsWith(process.env.NODE_ENV === 'development' ? '.ts' : '.js'),
}, function (info) {
  const route = require(info.fullpath).default
  if (route) {
    router.use(route.routes())
  }
});

export default router