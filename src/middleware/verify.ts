import { Context, Next } from "koa";
import jwt from 'jsonwebtoken'

export default async function (ctx: Context, next: Next) {
  const access_token = ctx.request.get('X-Token');
  try {
    const payload = await jwt.verify(access_token, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
    ctx.state.user = payload;
  } catch (e) {
    // TODO: expired notfound
    ctx.throwBiz('');
  }
  await next()
};
