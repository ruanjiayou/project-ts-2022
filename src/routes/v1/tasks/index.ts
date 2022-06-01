import { Context } from 'koa'
import Router from 'koa-router'
import { IJob, IJobModel } from '../../../types/model';
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

router.get('/:name/logs', async (ctx: Context) => {
  const Job: IJobModel = ctx.models.Job;
  const where = { name: ctx.params.name }
  const items: IJob[] = await Job.getList({ where });
  ctx.success({ items })
})

router.post('/:name/operate/:operate', async (ctx: Context) => {
  const taskName = ctx.params.name;
  if (ctx.params.operate === 'start') {
    ctx.schedule.start(taskName);
  } else if (ctx.params.operate === 'stop') {
    ctx.schedule.stop(taskName);
  }
  ctx.success();
})
export default router