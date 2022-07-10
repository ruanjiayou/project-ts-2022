import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IGroup, MGroup } from '@root/types/model';
import Logger from '@root/utils/logger'
import groupService from '../../../../services/group'

const Router = require('koa-router')
const logger = Logger('group_route')

const router = new Router({
  prefix: '/api/v1/im/groups'
})

router.get('/', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const query: any = ctx.request.query
  const where: any = {}
  let order: any = {};
  const page = Math.abs(parseInt(query.page) || 1)
  const limit = Math.min(Math.abs(parseInt(query.page_size) || 20), 50)
  if (query._id) {
    where._id = query._id;
  }
  if (query.status) {
    where.status = parseInt(query.status, 10);
  }
  if (query.owner_id) {
    where.owner_id = query.owner_id;
  }
  if (query.q) {
    where.title = { $regex: `${query.q}` }
  }
  if (query.sort) {
    const key = query.sort.replace('-', '')
    const descent = query.sort.startsWith('-') ? -1 : 1
    order = { [key]: descent };
  }
  const result: { items: IGroup[], total?: number } = await Group.getList({ where, order, page, limit, lean: true, count: true });
  ctx.success(result)
})

router.get('/:id', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const doc: IGroup = await Group.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(doc)
})

router.post('/', async (ctx: Context) => {
  const data: any = _.pick(ctx.request.body, ['_id', 'title', 'desc', 'type', 'cover', 'owner_id', 'announcement', 'join_type']);
  logger.info(`create group: ${JSON.stringify(data)}`)
  const result = await groupService.createGroup(ctx, data);
  if (result.ErrorCode === 0) {    
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

router.put('/:id', async (ctx: Context) => {
  const result = await groupService.updateGroup(ctx, ctx.params.id, ctx.request.body)
  if (result.ErrorCode === 0) {
    ctx.success({ _id: ctx.params.id })
  } else {
    console.log(result)
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

export default router