import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IProject, MProject } from '@type/model';
import verify from '@middleware/verify';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/user/projects'
})

router.get('/', verify, async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const result: { items: IProject[] } = await Project.getAll();
  ctx.success(result)
})

router.get('/:id', verify, async (ctx: Context) => {
  const Project: MProject = ctx.models.Page
  const item: IProject = await Project.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', verify, async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
  data._id = uuid.v4();
  data.user_id = ctx.state.user_id;
  const item = await Project.create({});
  ctx.success(item)
})

router.put('/:id', verify, async (ctx: Context) => {
  const Project: MProject = ctx.models.Project
  const where = { _id: ctx.params.id };
  const item: IProject = await Project.getInfo({ where })
  if (item) {
    const data: Partial<IProject> = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
    data.updatedAt = new Date()
    await Project.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ResourceNotFound')
  }
})

export default router