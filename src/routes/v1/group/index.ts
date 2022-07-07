import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IGroup, MGroup } from '@root/types/model';

const Router = require('koa-router')

const router = new Router({
  prefix: ''
})

router.get('/', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const items: IGroup[] = await Group.getAll();
  ctx.success({ items })
})

router.get('/:id', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const item: IGroup = await Group.getInfo({ where: { _id: ctx.params.id } });
  ctx.success({ item })
})

router.post('/', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const data: any = _.pick(ctx.request.body, ['title', 'desc', 'type']);
  data._id = uuid.v4();
  const item: IGroup = await Group.create({});
  ctx.success({ item })
})

router.put('/:id', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const where = { _id: ctx.params.id };
  const item = await Group.getInfo({ where })
  if (item) {
    const data = _.pick(ctx.request.body, ['name', 'desc', 'type']);
    await Group.updateOne(where, { $set: data });
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ResourceNotFound')
  }
})

export default router