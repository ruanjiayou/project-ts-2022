import { Context } from 'koa'
import Router from 'koa-router'
import Logger from '@root/utils/logger'
import { profile } from '@root/services/user';
import verify from '@root/middleware/verify';

const router = new Router({
  prefix: '/api/v1/user'
});

router.get('/profile', verify, async (ctx: Context) => {
  const data = await profile(ctx);
  ctx.success(data)
});

router.get('/signature', verify, async (ctx: Context) => {
  const data = await profile(ctx);
  ctx.success(data)
});

export default router