import { Context, Next } from "koa";
import jwt from 'jsonwebtoken'
import Logger from '@utils/logger'

const logger = Logger('verify')

export default async function (ctx: Context, next: Next) {
  const access_token = ctx.request.get('X-Token');
  try {
    const payload = await jwt.verify(access_token, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
    ctx.state.user = payload;
  } catch (e) {
    logger.error(e);
    if (e.message === 'jwt expired') {
      return ctx.throwBiz('auth.tokenExpired');
    }
    ctx.throwBiz('auth.tokenNotFound');
  }
  await next()
};
