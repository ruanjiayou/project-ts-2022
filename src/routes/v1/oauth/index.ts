import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { signIn, signUp, signOut, signOff, refreshToken, createToken } from '@services/user';
import { IUser } from '@type/model';
import got from 'got'
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

router.post('/bind', async (ctx: Context) => {
  const { MAccount, MUser } = ctx.models;
  const bind_token = ctx.query.bind_token as string;
  let { type, account, code, area_code } = ctx.request.body;
  try {
    const payload = await jwt.verify(bind_token, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET) as any;
    const accountInfo = await MAccount.getInfo({ where: { sns_id: payload.sns_id, sns_type: payload.sns_type }, lean: true });
    const user_id = v4();
    let user: IUser = null;
    if (type === 'auto') {
      type = 'account';
    }
    const where: any = { [type]: account };
    const user_info = { _id: user_id, nickname: accountInfo.sns_name, avatar: accountInfo.sns_icon, [type]: account, area_code: '' }
    if (type === 'phone') {
      user_info.area_code = area_code;
      where.area_code = area_code;
    }
    user = await MUser.getInfo({ where, lean: true });
    if (!user) {
      await MUser.create(user_info);
    } else {
      ctx.throwBiz('auth.AccountExisted')
    }
    await MAccount.updateOne({ sns_id: payload.sns_id, sns_type: payload.sns_type }, { $set: { user_id: user ? user._id : user_id } });
    const token = await createToken(user || user_info, ctx.config);
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

router.get('/redirect/:sns_type', async (ctx: Context) => {
  const sns_type = ctx.params.sns_type;
  const { MConfig, MAccount, MUser } = ctx.models;
  const config: any = await MConfig.getInfo({ where: { type: 'sns_type', name: sns_type } })

  if (sns_type === 'github') {
    const code = ctx.request.query.code;
    const result: any = await got.post(`https://github.com/login/oauth/access_token?client_id=${config.value.client_id}&client_secret=${config.value.client_secret}&code=${code}`, {
      headers: {
        accept: 'application/json',
      },
      timeout: 60000
    }).json();
    const info: any = await got.get('https://api.github.com/user', {
      headers: {
        accept: 'application/json',
        Authorization: `token ${result.access_token}`
      }
    }).json();
    const bind_token = jwt.sign({ sns_id: info.id, sns_type }, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
    const account = await MAccount.getInfo({ where: { sns_id: info.id + '', sns_type: 'github' }, lean: true });
    if (account && account.user_id) {
      const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
      if (user) {
        if (user.status !== 1) {
          ctx.body = `登录失败,账号锁定`
        } else {
          const token = await createToken(user, ctx.config);
          ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
        }
      } else {
        ctx.redirect('/bind?bind_token=' + bind_token)
      }
    } else {
      await MAccount.updateOne({ sns_id: info.id + '', sns_type: 'github' }, {
        $setOnInsert: {
          _id: v4(),
          createdAt: new Date(),
        },
        $set: {
          sns_name: info.name,
          sns_icon: info.avatar_url,
          sns_info: info,
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          access_expires_in: result.expires_in,
          refresh_expires_in: result.refresh_expires_in,
          user_id: '',
          updatedAt: new Date(),
        }
      }, { upsert: true, new: true });
      ctx.redirect('/bind?bind_token=' + bind_token)
    }
  } else {
    ctx.status = 404;
    ctx.body = '不支持的类型'
  }
});

export default router