import Koa from 'koa'
import Convert from 'koa-convert'
import Static from 'koa-static'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import mongoose from 'mongoose'
import router from './router'
import config from './config/index'
import models from './models/mongo'
import cors from './middleware/cors'
import responseTime from './middleware/response-time'
import handler from './middleware/handler'
import { paging, success, fail, throwBiz } from './extend/context'
import schedule from './schedule/index'
import constant from './constant'

const app = new Koa()
app.context.config = config;
app.context.models = models;
app.context.schedule = schedule
app.context.throwBiz = throwBiz
app.context.paging = paging;
app.context.success = success;
app.context.fail = fail;

app.use(responseTime);
app.use(cors);
app.use(helmet({ noSniff: true }));
app.use(bodyParser())
app.use(Convert(Static(constant.PATH.STATIC)))
app.use(handler)
app.use(router.routes());

export async function prepare(fn?: Function) {
  await mongoose.connect(config.mongo_url)
  if (fn) {
    await fn(app.context)
  }
}
export default app