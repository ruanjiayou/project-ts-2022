import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import models from '~/models/mongo'
import { IProject, MProject } from '@type/model';
import verify from '@middleware/verify';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/user/projects'
})

router.get('/', verify, async (ctx: Context) => {
  const result = await models.MProject.getAll();
  ctx.success(result)
})

router.get('/:id', verify, async (ctx: Context) => {
  const item = await models.MProject.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', verify, async (ctx: Context) => {
  const data: Partial<IProject> = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
  data._id = uuid.v4();
  data.user_id = ctx.state.user_id;
  const item = await models.MProject.create({});
  ctx.success(item)
})

router.put('/:id', verify, async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await models.MProject.getInfo({ where })
  if (item) {
    const data: Partial<IProject> = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
    data.updatedAt = new Date()
    await models.MProject.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router