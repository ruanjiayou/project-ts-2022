import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IConfig, MConfig } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: ''
})

router.get('/', async (ctx: Context) => {
  const Config: MConfig = ctx.models.Config
  const result: { items: IConfig[] } = await Config.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const Config: MConfig = ctx.models.Config
  const item: IConfig = await Config.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const Config: MConfig = ctx.models.Config
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  const item: IConfig = await Config.create({});
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const Config: MConfig = ctx.models.Config
  const where = { _id: ctx.params.id };
  const item = await Config.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
    await Config.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ResourceNotFound')
  }
})

export default router