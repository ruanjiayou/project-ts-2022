import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IProject, MProject } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/projects'
})

router.get('/', async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const result: { items: IProject[] } = await Project.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const item: IProject = await Project.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status', 'cover']);
  data._id = v4();
  const item = await Project.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const where = { _id: ctx.params.id };
  const item: IProject = await Project.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status', 'cover']);
    await Project.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router