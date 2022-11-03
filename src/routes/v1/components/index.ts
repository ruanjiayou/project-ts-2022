import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { Hql, IComponent } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/components'
})

router.get('/', async (ctx: Context) => {
  const hql: Hql = { order: { order: 1 } }
  const project_id = ctx.get('x-project_id');
  if (project_id) {
    hql.where = { project_id };
  }
  const result = await ctx.models.MComponent.getAll(hql);
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const item = await ctx.models.MComponent.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.delete('/:id', async (ctx: Context) => {
  await ctx.models.MComponent.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IComponent> = _.pick(ctx.request.body, ['title', 'name', 'desc', 'type', 'parent_id', 'tree_id', 'attrs', 'order', 'project_id', 'cover']);
  data._id = v4();
  const item = await ctx.models.MComponent.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await ctx.models.MComponent.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['title', 'name', 'desc', 'type', 'parent_id', 'tree_id', 'attrs', 'order', 'project_id', 'cover']);
    await ctx.models.MComponent.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router