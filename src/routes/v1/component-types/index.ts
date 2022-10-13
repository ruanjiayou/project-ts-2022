import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IComponentType, MComponentType } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/component-types'
})

router.get('/', async (ctx: Context) => {
  const ComponentType: MComponentType = ctx.models.ComponentType
  const results = await ComponentType.getAll({ order: { order: 1 } })
  ctx.success(results)
})

router.delete('/:id', async (ctx: Context) => {
  const ComponentType: MComponentType = ctx.models.ComponentType
  await ComponentType.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const ComponentType: MComponentType = ctx.models.ComponentType
  const data: any = _.pick(ctx.request.body, ['title', 'name', 'desc', 'cover', 'order']);
  data._id = v4();
  const item = await ComponentType.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const ComponentType: MComponentType = ctx.models.ComponentType
  const where = { _id: ctx.params.id };
  const item: IComponentType = await ComponentType.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['title', 'name', 'desc', 'cover', 'order', 'status']);
    await ComponentType.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router