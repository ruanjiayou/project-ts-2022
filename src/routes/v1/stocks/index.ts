import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import models from '~/models/mongo'
import { IStock, MStock } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/stocks'
})

router.get('/', async (ctx: Context) => {
  const { page, limit } = ctx.paging()
  const results = await models.MStock.getList({ page, limit })
  ctx.success(results)
})

router.delete('/:id', async (ctx: Context) => {
  await models.MStock.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const data: Partial<IStock> = ctx.request.body;
  data._id = v4();
  const item = await models.MStock.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await models.MStock.getInfo({ where })
  if (item) {
    const data = ctx.request.body;
    await models.MStock.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router