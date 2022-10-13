import { Context } from 'koa'
import { Hql, MComponent } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/component-templates'
})

router.get('/', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const hql: Hql = { where: { parent_id: '' }, order: { order: 1 } }
  const project_id = ctx.get('x-project_id');
  if (project_id) {
    hql.where.project_id = project_id;
  }
  const results = await Component.getAll(hql)
  ctx.success(results)
})

export default router