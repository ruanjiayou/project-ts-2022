import { Context } from 'koa'
import _ from 'lodash'
import Logger from '@root/utils/logger'
import tmsClient from '@root/utils/tmsClient'
import crypto from 'crypto'



const Router = require('koa-router')
const logger = Logger('tms_route')

const router = new Router({
  prefix: '/api/v1/tms'
})

router.post('/', async (ctx: Context) => {
  logger.info(`check text: ${JSON.stringify(ctx.request.body)}`)
  try {
    const result: any = await tmsClient.TextModeration({ Content: Buffer.from(ctx.request.body.content).toString('base64') })
    if (result.Error) {
      ctx.throwBiz('COMMON.ThirdPartFail', { message: '错误码:' + result.Error.code })
    } else {
      ctx.success(result)
    }
  } catch (e) {
    ctx.throwBiz('COMMON.CustomError', { message: e.message })
  }
})

export default router