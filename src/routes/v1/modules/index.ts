import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IModule } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/modules'
})

router.get('/', async (ctx: Context) => {
  const result = await ctx.models.MModule.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const item = await ctx.models.MModule.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IModule> = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  const item = await ctx.models.MModule.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await ctx.models.MModule.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
    await ctx.models.MModule.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router