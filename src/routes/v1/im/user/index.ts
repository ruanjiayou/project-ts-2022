import { Context } from 'koa'
import Router from 'koa-router'
import Logger from '@root/utils/logger'

const router = new Router({
  prefix: '/api/v1/im/user'
});

router.post('/signature', async (ctx: Context) => {
  const client = ctx.im;
  const usersig = client.getSignratue(ctx.request.body.user_id);
  ctx.success({ usersig })
})

router.put('/:UserId/profile', async (ctx: Context) => {
  try {
    const result = await ctx.im.requestUpdateUserProfile(ctx.params.UserId, ctx.request.body)
    if (result.ErrorCode === 0) {
      ctx.success()
    } else {
      ctx.throwBiz('COMMON.ThridPart', { message: result.ErrorInfo })
    }
  } catch (e) {
    ctx.throwBiz('COMMON.CustomError', { message: e.message })
  }
})
export default router