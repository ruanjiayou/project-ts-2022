import { Context } from 'koa'
import Router from 'koa-router'

const router = new Router();

router.get('/', async (ctx: Context) => {
  const model = ctx.models['ConfigInfo'];
  const items = await model.find().lean();
  ctx.success({ items })
});

router.get('/config', async (ctx: Context) => {
  ctx.body = 'test'
})

export default router