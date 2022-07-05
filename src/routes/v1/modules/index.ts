import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IModule, MModule } from '@root/types/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/modules'
})

router.get('/', async (ctx: Context) => {
  const Module: MModule = ctx.models.Module
  const items: IModule[] = await Module.getAll();
  ctx.success({ items })
})

router.get('/:id', async (ctx: Context) => {
  const Module: MModule = ctx.models.Module
  const item: IModule = await Module.getInfo({ where: { _id: ctx.params.id } });
  ctx.success({ item })
})

router.post('/', async (ctx: Context) => {
  const Module: MModule = ctx.models.Config
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  const item = await Module.create({});
  ctx.success({ item })
})

router.put('/:id', async (ctx: Context) => {
  const Module: MModule = ctx.models.Config
  const where = { _id: ctx.params.id };
  const item: IModule = await Module.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
    await Module.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ResourceNotFound')
  }
})

export default router