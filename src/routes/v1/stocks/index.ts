import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IStock, MStock } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/stocks'
})

router.get('/', async (ctx: Context) => {
  const Stock: MStock = ctx.models.Stock
  const { page, limit } = ctx.paging()
  const results = await Stock.getList({ page, limit })
  ctx.success(results)
})

router.delete('/:id', async (ctx: Context) => {
  const Stock: MStock = ctx.models.Stock
  await Stock.destroy({ where: { _id: ctx.params.id } });
  ctx.success()
})

router.post('/', async (ctx: Context) => {
  const Stock: MStock = ctx.models.Stock
  const data: any = ctx.request.body;
  data._id = v4();
  const item = await Stock.create(data);
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const Stock: MStock = ctx.models.Stock
  const where = { _id: ctx.params.id };
  const item: IStock = await Stock.getInfo({ where })
  if (item) {
    const data = ctx.request.body;
    await Stock.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router