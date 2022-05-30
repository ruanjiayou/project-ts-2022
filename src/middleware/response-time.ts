import { Context, Next } from 'koa'
import Logger from '../utils/logger'

const logger = Logger('access')
/**
 * 记录请求响应时间
 */
export default async (ctx: Context, next: Next): Promise<void> => {
  const start = Date.now()
  await next()
  const responseTime = `${Date.now() - start}ms`;
  ctx.response.set('X-Response-Time', responseTime);
  logger.info(`${ctx.req.method.toUpperCase()} ${ctx.req.url} ${responseTime}`)
}