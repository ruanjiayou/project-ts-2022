import { Context } from 'koa'
import { MComponent } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/component-templates'
})

router.get('/', async (ctx: Context) => {
  const Component: MComponent = ctx.models.Component
  const results = await Component.getAll({ where: { parent_id: '' }, order: { order: 1 } })
  ctx.success(results)
})

export default router