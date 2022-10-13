import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { Hql, IComponent, MComponent } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/components'
})

router.get('/', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const hql: Hql = { order: { order: 1 } }
  const project_id = ctx.get('x-project_id');
  if (project_id) {
    hql.where = { project_id };
  }
  const result: { items: IComponent[] } = await Component.getAll(hql);
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const item: IComponent = await Component.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.delete('/:id', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  await Component.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const data: any = _.pick(ctx.request.body, ['title', 'name', 'desc', 'type', 'parent_id', 'tree_id', 'attrs', 'order', 'project_id']);
  data._id = v4();
  const item = await Component.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const where = { _id: ctx.params.id };
  const item: IComponent = await Component.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['title', 'name', 'desc', 'type', 'parent_id', 'tree_id', 'attrs', 'order', 'project_id']);
    await Component.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router