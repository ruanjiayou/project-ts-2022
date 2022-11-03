import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import models from '~/models/mongo'
import { IPage, MPage } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/pages'
})

router.get('/', async (ctx: Context) => {
  const result = await models.MPage.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const item = await models.MPage.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IPage> = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  const item = await models.MPage.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await models.MPage.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
    await models.MPage.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router