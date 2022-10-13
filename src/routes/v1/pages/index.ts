import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IPage, MPage } from '@type/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/pages'
})

router.get('/', async (ctx: Context) => {
  const Page: MPage = ctx.models.Page
  const result: { items: IPage[] } = await Page.getAll();
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const Page: MPage = ctx.models.Page
  const item: IPage = await Page.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', async (ctx: Context) => {
  const Page: MPage = ctx.models.Config
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  const item = await Page.create({});
  ctx.success(item)
})

router.put('/:id', async (ctx: Context) => {
  const Page: MPage = ctx.models.Config
  const where = { _id: ctx.params.id };
  const item: IPage = await Page.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type', 'value', 'order']);
    await Page.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router