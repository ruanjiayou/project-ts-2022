import { Context } from 'koa'
import Router from 'koa-router'
import Logger from '../../../utils/logger'

const logger = Logger('task');
const router = new Router({
  prefix: '/api/v1/tasks'
});

router.get('/', async (ctx: Context) => {
  const tasks = ctx.schedule.tasks;
  const items = Object.keys(tasks).map(name => ({ name, rule: tasks[name].rule }))
  ctx.success({ items })
});

router.patch('/:name', async (ctx: Context) => {
  logger.info(`trigger: ${ctx.params.name}`)
  ctx.schedule.tick(ctx.params.name);
  ctx.success();
})

export default router