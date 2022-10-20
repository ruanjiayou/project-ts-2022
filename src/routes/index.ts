import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import path from 'path';
import constant from '~/constant';
import upload from '~/utils/upload';

const router = new Router<DefaultState, Context>();

router.get('/', async (ctx: Context) => {
  ctx.body = 'Hello World!'
});

router.post('/upload/image', upload.single('image'), async (ctx: Context) => {
  const filepath = ctx.request.file.path.substring(constant.PATH.STATIC.length)  
  ctx.success({ filepath });
})
export default router