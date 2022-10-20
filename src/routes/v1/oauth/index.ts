import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { signIn, signUp, signOut, signOff, refreshToken } from '@services/user';

const logger = Logger('oauth');
const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/oauth'
});

router.post('/sign-in', async (ctx: Context) => {
  const data = await signIn(ctx, ctx.request.body);
  ctx.success(data)
});

// 注册
router.post('/sign-up', async (ctx: Context) => {
  logger.info('sign-up');
  await signUp(ctx, ctx.request.body);
  ctx.success()
});

// 登出
router.post('/sign-out', async (ctx: Context) => {
  const data = await signOut(ctx, ctx.request.body);
  ctx.success({ data })
});

// 注销
router.post('/sign-off', async (ctx: Context) => {
  const data = await signOff(ctx, ctx.request.body);
  ctx.success({ data })
});

// 更新access_token
router.post('/refresh', async (ctx: Context) => {
  const data = await refreshToken(ctx, ctx.request.get('X-Token'))
  ctx.success({ data })
});

// sns
router.post('/sns/:type', async (ctx: Context) => {
  ctx.success({})
});

export default router