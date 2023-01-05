import Koa, { Context, Next } from 'koa'
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
import { extname } from 'path'
import { createReadStream } from 'fs'
import createGetToken from './utils/ali'

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
app.use(helmet({ noSniff: true, contentSecurityPolicy: false }));
app.use(bodyParser())
app.use(Convert(Static(constant.PATH.STATIC)))
app.use(handler)
app.use(async (ctx: Context, next: Next) => {
  const ext = extname(ctx.url)
  await next()
  if (!ctx.headerSent && !['jpg', 'gif', 'png'].includes(ext) && ctx.status === 404) {
    ctx.status = 200;
    ctx.respond = false
    ctx.set('content-type', 'text/html; charset=utf-8')
    const rs = createReadStream(constant.PATH.STATIC + '/index.html', { encoding: 'utf-8' });
    rs.pipe(ctx.res)
  } else {
    // TODO: 自定义404
  }
})
app.use(router.routes());

export async function prepare(fn?: Function) {
  await mongoose.connect(config.mongo_url)
  const cfg = await models.MConfig.getInfo({ where: { name: 'ali_speech_ram' }, lean: true });
  if (cfg) {
    const getToken = await createGetToken(cfg.value.access_key_id, cfg.value.access_key_secret);
    app.context.getAliToken = getToken;
  }
  if (fn) {
    await fn(app.context)
  }
}
export default app