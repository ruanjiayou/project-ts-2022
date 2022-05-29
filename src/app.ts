import Koa from 'koa'
import router from './router'
import config from './config/index'
import models from './models/mongo'
import responseTime from './middleware/response-time'
import { paging, success } from './extend/context'

const app = new Koa()
app.context.config = config;
app.context.models = models;
app.context.paging = paging;
app.context.success = success;

app.use(responseTime);

app.use(router.routes());

export default app