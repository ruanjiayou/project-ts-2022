import { Context } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { profile } from '@services/user';
import verify from '@middleware/verify';

const router = new Router({
  prefix: '/api/v1/user'
});

router.get('/profile', verify, async (ctx: Context) => {
  const data = await profile(ctx);
  ctx.success(data)
});

export default router