import { Context } from 'koa'
import _ from 'lodash'
import { IGroup, MGroup } from '@root/types/model';
import Logger from '@root/utils/logger'
import { IMGroup_Type } from '@root/utils/IMsdk';

const Router = require('koa-router')
const logger = Logger('member_route')

const router = new Router({
  prefix: '/api/v1/im/groups/:group_id/members'
})

router.get('/', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const result: IGroup = await Group.getInfo({ where: { _id: ctx.params.group_id }, lean: true, });
  const query: any = ctx.query
  const filter: any = {}
  if (query.roles) {
    filter.MemberRoleFilter = query.roles.split(',')
  }
  if (query.page_size) {
    filter.Limit = Math.min(Math.abs(parseInt(query.page_size) || 100), 1000)
  }
  // 社群不支持Offset,使用Next
  if (result.type === IMGroup_Type.Community && query.next) {
    filter.Next = query.next
  }
  if (result.type !== IMGroup_Type.Community) {
    filter.Offset = Math.abs(parseInt(query.page_size) || 0)
  }
  const results = await ctx.im.requestGetMembers(result._id, filter)
  if (results.ErrorCode === 0) {
    ctx.success({ total: results.MemberNum, items: results.MemberList })
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + results.ErrorCode })
  }
})

router.put('/:user_id/profile', async (ctx: Context) => {
  const Group: MGroup = ctx.models.Group
  const result: IGroup = await Group.getInfo({ where: { _id: ctx.params.group_id }, lean: true, });
  // TODO: 设置群成员资料
  if (result.type === IMGroup_Type.AVChatRoom) {
    ctx.throwBiz('COMMON.CustomError', { message: '直播群不支持获取成员' })
  }
  ctx.success()
})

router.put('/:user_id/role', async (ctx: Context) => {
  const result = await ctx.im.requestSetMemberRole(ctx.params.group_id, ctx.params.user_id, ctx.request.body.admin ? 'Admin' : 'Member')
  if (result.ErrorCode === 0) {
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

export default router