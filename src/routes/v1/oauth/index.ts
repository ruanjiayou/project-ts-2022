import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { signIn, signUp, createToken } from '@services/user';
import { IUser } from '@type/model';
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid';

const logger = Logger('oauth');
const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/oauth'
});

// 登录
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

router.post('/bind', async (ctx: Context) => {
  const { MAccount, MUser } = ctx.models;
  const bind_token = ctx.query.bind_token as string;
  let { type, account, value } = ctx.request.body;
  try {
    const payload = await jwt.verify(bind_token, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET) as any;
    const query: any = {};
    if (type === 'email') {
      query.email = account;
    } else if (type === 'phone') {
      let [code, phone] = account.split('-');
      if (!phone) {
        phone = code;
        code = '86'
      }
      query.phone = account;
      query.area_code = code;
    } else if (type === 'account') {
      query.account = account;
    } else {
      return ctx.fail('该绑定方式不支持')
    }
    const user = await MUser.findOne(query);
    if (!user) {
      return ctx.fail('用户不存在');
    }
    if (type === 'account' && !user.isEqualPass(value)) {
      return ctx.fail('账号密码错误');
    }
    // TODO: email/phone 验证code
    await MAccount.updateOne({ sns_id: payload.sns_id, sns_type: payload.sns_type }, { $set: { user_id: user._id } });
    const token = await createToken(user, ctx.config);
    ctx.success(token);
  } catch (e) {
    logger.error(e);
    ctx.throwBiz('common.CustomError', e);
  }
})

router.post('/send-code', async (ctx: Context) => {
  const { type, account } = ctx.request.body;
  if (['email'].includes(type)) {
    // TODO: 邮件服务
    ctx.success();
  } else {
    ctx.fail();
  }
})

export default router