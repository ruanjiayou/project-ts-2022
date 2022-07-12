import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IGroup, MGroup } from '@root/types/model';
import Logger from '@root/utils/logger'
import groupService from '../../../../services/group'
import { IMGroup, IMResponse } from '@root/utils/IMsdk';
import { clound2local } from '@root/utils/helper';

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

router.get('/remote', async (ctx: Context) => {
  const result = await ctx.im.requestGetGroups()
  if (result.ErrorCode === 0) {
    ctx.success({ list: result.GroupIdList, total: result.TotalCount })
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

router.get('/:id', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const doc: IGroup = await Group.getInfo({ where: { _id: ctx.params.id } });
  ctx.success(doc)
})

router.get('/:id/remote', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const doc: any = await ctx.im.requestGetGroupDetail(ctx.params.id, []);
  if (doc && doc.ErrorCode === 0) {
    const group = clound2local(doc)
    const result = await Group.updateOne({ _id: ctx.params.id }, { $set: group }, { upsert: true })
    ctx.success(doc)
  } else {
    ctx.throwBiz('COMMON.ResourceNotFound')
  }
})

router.post('/', async (ctx: Context) => {
  const data: any = _.pick(ctx.request.body, ['_id', 'title', 'desc', 'type', 'cover', 'max_member', 'owner_id', 'custom_columns', 'announcement', 'join_type', 'duanmu_enabled', '']);
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
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

export default router