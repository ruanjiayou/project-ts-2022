import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import models from '~/models/mongo'
import { IProject, MProject } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/projects'
})

router.get('/', async (ctx: Context) => {
  const result = await models.MProject.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const item = await models.MProject.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IProject> = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status', 'cover']);
  data._id = v4();
  const item = await models.MProject.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await models.MProject.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status', 'cover']);
    await models.MProject.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router