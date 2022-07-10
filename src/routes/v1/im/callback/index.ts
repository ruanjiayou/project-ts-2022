import { Context } from 'koa'
import _ from 'lodash'
import Logger from '@root/utils/logger'
import IMCallbackService from '@root/services/im_callback'

const Router = require('koa-router')
const logger = Logger('callback_route')

const router = new Router({
  prefix: '/api/v1/im/callback'
})

router.post('/', async (ctx: Context) => {
  const query = ctx.query;
  // const { SdkAppid, CallbackCommand, contenttype, ClientIP, OptPlatform } = query;
  const body = ctx.request.body;
  const callback_type: string = body.CallbackCommand
  // Group.CallbackAfterGroupInfoChanged
  logger.info(`callback: ${JSON.stringify(query)}, ${JSON.stringify(body)}`)
  const fn = IMCallbackService[callback_type]
  const SUCCESS_RESPONSE = { ActionStatus: 'OK', ErrorInfo: '', ErrorCode: 0 };
  if (fn) {
    try {
      await fn(body, query)
      ctx.body = SUCCESS_RESPONSE
    } catch (e) {
      logger.error(e.message)
      ctx.body = { ErrorCode: -1 }
    }
  } else {
    logger.error(`没有函数处理的回调: appid,${query.SdkAppid} command,${query.CallbackCommand}`)
    ctx.body = SUCCESS_RESPONSE
  }
})

export default router