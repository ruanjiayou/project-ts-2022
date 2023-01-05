import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import snsService from '@services/sns'

const logger = Logger('sns_signin');
const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/oauth/sns'
});

router.get('/:type/sign-in', async (ctx: Context) => {
  const login_type = `login_${ctx.params.type}`;
  const { MConfig } = ctx.models;
  const sns_config = await MConfig.getInfo({
    where: { type: 'sns_type', name: ctx.params.type },
    lean: true,
  });
  if (!sns_config) {
    return ctx.fail('不支持的第三方登录类型');
  }
  if (snsService[login_type]) {
    snsService[login_type](ctx, sns_config.value);
  } else {
    ctx.fail('不支持的第三方登录类型')
  }
});

router.get('/:type/callback', async (ctx: Context) => {
  const callback_type = `callback_${ctx.params.type}`;
  const { MConfig } = ctx.models;
  const sns_config = await MConfig.getInfo({
    where: { type: 'sns_type', name: ctx.params.type },
    lean: true,
  });
  if (!sns_config) {
    return ctx.fail('不支持的第三方登录类型');
  }
  if (snsService[callback_type]) {
    try {
      await snsService[callback_type](ctx, sns_config.value);
    } catch(e) {
      console.log(e);
      ctx.fail();
    }    
  } else {
    ctx.fail('不支持的第三方登录类型')
  }
});

export default router