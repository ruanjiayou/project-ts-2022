import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IApp } from '@type/model';
import verify from '@middleware/verify';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/apps'
})

router.get('/', verify, async (ctx: Context) => {
  const result = await ctx.models.MApp.getAll();
  ctx.success(result)
})

router.get('/:id', verify, async (ctx: Context) => {
  const item = await ctx.models.MApp.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(item)
})

router.post('/', verify, async (ctx: Context) => {
  const data: any = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
  data._id = uuid.v4();
  data.user_id = ctx.state.user_id;
  const item = await ctx.models.MApp.create({});
  ctx.success(item)
})

router.put('/:id', verify, async (ctx: Context) => {
  const where = { _id: ctx.params.id };
  const item = await ctx.models.MApp.getInfo({ where })
  if (item) {
    const data: Partial<IApp> = _.pick(ctx.request.body, ['name', 'desc', 'title', 'status']);
    data.updatedAt = new Date()
    await ctx.models.MApp.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('common.ResourceNotFound')
  }
})

export default router