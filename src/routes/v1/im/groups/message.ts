import { Context } from 'koa'
import _ from 'lodash'
import { v4 } from 'uuid'
import { IGroup, MGroup } from '@root/types/model';
import Logger from '@root/utils/logger'
import groupService from '../../../../services/group'
import { IMGroup, IMResponse, IM_MSG_BODY, IM_MSG_TYPE, IMPriority } from '@root/utils/IMsdk';
import { clound2local } from '@root/utils/helper';

const Router = require('koa-router')
const logger = Logger('group_route')

const router = new Router({
  prefix: '/api/v1/im/groups/:group_id/message'
})

interface INormalMessage {
  Random: number;
  MsgPriority?: IMPriority;
  MsgBody: IM_MSG_BODY;
  From_Account?: string;
  ForbidCallbackControl?: ('ForbidBeforeSendMsgCallback' | 'ForbidAfterSendMsgCallback')[];
  To_Account: string[];
}

interface ISystemMessage {
  Content: string;
  ToMembers_Account?: string[];
}
router.post('/', async (ctx: Context) => {
  const data: { type: 'SYSTEM' | 'NORMAL', data: (INormalMessage | ISystemMessage) } = ctx.request.body;
  logger.info(`send ${data.type} message: ${JSON.stringify(data)}`)
  let result: IMResponse;
  if (data.type === 'SYSTEM') {
    const msg = <ISystemMessage>data.data;
    result = await ctx.im.requestSendSystemMessage({
      GroupId: ctx.params.group_id,
      Content: msg.Content,
      ToMembers_Account: msg.ToMembers_Account,
    })
  } else {
    const msg = <INormalMessage>data.data;
    result = await ctx.im.requestSendMessage({
      GroupId: ctx.params.group_id,
      MsgPriority: msg.MsgPriority,
      Random: msg.Random,
      MsgBody: msg.MsgBody,
      From_Account: msg.From_Account,
    })
  }
  if (result.ErrorCode === 0) {
    ctx.success()
  } else {
    ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.ErrorCode })
  }
})

export default router