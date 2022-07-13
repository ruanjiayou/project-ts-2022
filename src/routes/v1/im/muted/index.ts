import { Context } from 'koa'
import _ from 'lodash'
import { IGroup, MGroup } from '@root/types/model';
import Logger from '@root/utils/logger'
import { IMGroup_Type } from '@root/utils/IMsdk';

const Router = require('koa-router')
const logger = Logger('muted_route')

const router = new Router({
  prefix: '/api/v1/im/groups/:group_id/muted'
})

router.get('/', async (ctx: Context) => {
  const results = await ctx.im.requestMutedUsers(ctx.params.group_id)
  if (results.ErrorCode === 0) {
    ctx.success({ items: results.ShuttedUinList })
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + results.ErrorCode })
  }
})

router.post('/', async (ctx: Context) => {
  const result = await ctx.im.requestMuteUser({ GroupId: ctx.params.group_id, Members_Account: ctx.request.body.members, ShutUpTime: ctx.request.body.seconds })
  if (result.ErrorCode === 0) {
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

router.delete('/', async (ctx: Context) => {
  const result = await ctx.im.requestMuteUser({ GroupId: ctx.params.group_id, Members_Account: ctx.request.body.members, ShutUpTime: 0 })
  if (result.ErrorCode === 0) {
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

export default router