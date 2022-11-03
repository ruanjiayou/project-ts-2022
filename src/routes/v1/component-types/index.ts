import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IComponentType, MComponentType } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/component-types'
})

router.get('/', async (ctx: Context) => {
  const results = await ctx.models.MComponentType.getAll({ order: { order: 1 } })
  ctx.success(results)
})

router.delete('/:id', async (ctx: Context) => {
  await ctx.models.MComponentType.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IComponentType> = _.pick(ctx.request.body, ['title', 'name', 'desc', 'cover', 'order']);
  data._id = v4();
  const item = await ctx.models.MComponentType.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await ctx.models.MComponentType.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['title', 'name', 'desc', 'cover', 'order', 'status']);
    await ctx.models.MComponentType.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router