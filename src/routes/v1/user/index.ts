import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { profile, signOut, signOff, refreshToken } from '@services/user';
import verify from '@middleware/verify';
import models from '~/models/mongo'

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/user'
});

router.get('/profile', verify, async (ctx: Context) => {
  const data = await profile(ctx);
  ctx.success(data)
});

// 登出
router.post('/sign-out', verify, async (ctx: Context) => {
  const data = await signOut(ctx, ctx.request.body);
  ctx.success({ data })
});

// 注销
router.post('/sign-off', verify, async (ctx: Context) => {
  const data = await signOff(ctx, ctx.request.body);
  ctx.success({ data })
});

// 更新access_token
router.post('/refresh', async (ctx: Context) => {
  const data = await refreshToken(ctx, ctx.request.get('X-Token'))
  ctx.success({ data })
});

router.get('/menu', verify, async (ctx: Context) => {
  const result = await models.MComponent.getAll({ order: [['order', 1]], lean: true });
  result.items.forEach((item, i) => {
    for (let j = 0; j < result.items.length; j++) {
      const sub = result.items[j]
      if (!sub || i === j) continue;
      if (sub.parent_id === item._id) {
        if (item.children) {
          item.children.push(sub)
        } else {
          item.children = [sub]
        }
      }
    }
  })
  const root = result.items.find(item => item._id === item.tree_id)
  ctx.success(root)
});

export default router