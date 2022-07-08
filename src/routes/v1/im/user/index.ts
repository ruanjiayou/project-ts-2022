import { Context } from 'koa'
import Router from 'koa-router'
import Logger from '@root/utils/logger'

const router = new Router({
  prefix: '/api/v1/im/user'
});

router.post('/signature', async (ctx: Context) => {
  const client = ctx.im;
  const usersig = client.getSignratue();
  ctx.success({ usersig })
})

export default router