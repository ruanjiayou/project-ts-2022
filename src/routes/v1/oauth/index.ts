import { Context, DefaultState } from 'koa'
import Router from 'koa-router'
import Logger from '@utils/logger'
import { signIn, signUp, createToken } from '@services/user';
import { IUser } from '@type/model';
import got from 'got'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid';
import { google, Auth } from 'googleapis'
import AlipaySdk from 'alipay-sdk';

let googleOAuth2Client: Auth.OAuth2Client = null;
let alipaySdk: AlipaySdk = null;
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
    user = await MUser.findOneAndUpdate(where, { $setOnInsert: user_info }, { upsert: true, new: true });
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

router.get('/google', async (ctx: Context) => {
  const { MConfig } = ctx.models;
  if (!googleOAuth2Client) {
    const snsGoogle = await MConfig.getInfo({ where: { type: 'sns_type', name: 'google' }, lean: true });
    console.log(snsGoogle, '?')
    if (snsGoogle && snsGoogle.value.redirect_uris.length > 0) {
      googleOAuth2Client = new google.auth.OAuth2(
        snsGoogle.value.client_id,
        snsGoogle.value.client_secret,
        process.env.NODE_ENV === 'production' ? snsGoogle.value.redirect_uris[1] : snsGoogle.value.redirect_uris[0],
      );
    } else {
      ctx.status = 404;
      ctx.body = '不支持的类型'
      return;
    }
  }
  const url = googleOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    include_granted_scopes: true
  });
  ctx.status = 301;
  ctx.redirect(url);
});

router.get('/alipay_pc', async (ctx: Context) => {
  const { MConfig } = ctx.models;
  const config: any = await MConfig.getInfo({ where: { type: 'sns_type', name: 'alipay_pc' } })
  if (config) {
    ctx.status = 301;
    ctx.redirect(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${config.value.app_id}&scope=auth_user&redirect_uri=${encodeURIComponent(config.value.redirect_uri)}`);
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
      if (user.status !== 1) {
        ctx.body = `登录失败,账号锁定`
      } else {
        const token = await createToken(user, ctx.config);
        ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
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
  } else if (sns_type === 'google') {
    if (!googleOAuth2Client) {
      const snsGoogle = await MConfig.getInfo({ where: { type: 'sns_type', name: 'google' }, lean: true });
      if (snsGoogle && snsGoogle.value.redirect_uris.length > 0) {
        googleOAuth2Client = new google.auth.OAuth2(
          snsGoogle.value.client_id,
          snsGoogle.value.client_secret,
          snsGoogle.value.redirect_uris[0],
        );
      }
    }
    const code = ctx.request.query.code as string;
    const { tokens } = await googleOAuth2Client.getToken(code)
    const info: any = await got.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + tokens.access_token).json();
    const account = await MAccount.getInfo({ where: { sns_id: info.id + '', sns_type: 'google' }, lean: true });
    if (!account || !account.user_id) {
      await MAccount.updateOne({ sns_id: info.id + '', sns_type: 'google' }, {
        $setOnInsert: {
          _id: v4(),
          createdAt: new Date(),
        },
        $set: {
          sns_name: info.name,
          sns_icon: info.picture,
          sns_info: info,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          access_expires_in: 3600,
          refresh_expires_in: 3600,
          user_id: '',
          updatedAt: new Date(),
        }
      }, { upsert: true, new: true });
      const bind_token = jwt.sign({ sns_id: info.id, sns_type }, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
      ctx.redirect('/bind?bind_token=' + bind_token)
    } else {
      const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
      if (user.status !== 1) {
        ctx.body = `登录失败,账号锁定`
      } else {
        const token = await createToken(user, ctx.config);
        ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
      }
    }
  } else if (sns_type === 'alipay_pc') {
    const code = ctx.request.query.auth_code;
    if (!alipaySdk) {
      const config: any = await MConfig.getInfo({ where: { type: 'sns_type', name: 'alipay_pc' } })
      if (config) {
        alipaySdk = new AlipaySdk({
          appId: config.value.app_id,
          privateKey: config.value.app_secret_key,
          encryptKey: config.value.aes_secret,
          alipayPublicKey: config.value.alipay_public_key,
          keyType: 'PKCS8',
          signType: 'RSA2',
        });
      }
    }
    if (alipaySdk) {
      const result: {
        accessToken: string,
        alipayUserId: string,
        authStart: string,
        expiresIn: number,
        reExpiresIn: number,
        refreshToken: string,
        userId: string,
      } = await alipaySdk.exec('alipay.system.oauth.token', {
        grantType: 'authorization_code',
        code,
      });
      const userInfo: {
        avatar: string,
        nickName: string,
        userId: string,
      } = await alipaySdk.exec('alipay.user.info.share', {
        auth_token: result.accessToken
      });
      const account = await MAccount.getInfo({ where: { sns_id: result.userId + '', sns_type: 'alipay_pc' }, lean: true });
      if (!account || !account.user_id) {
        await MAccount.updateOne({ sns_id: result.userId + '', sns_type: 'alipay_pc' }, {
          $setOnInsert: {
            _id: v4(),
            createdAt: new Date(),
          },
          $set: {
            sns_name: userInfo.nickName,
            sns_icon: userInfo.avatar,
            sns_info: userInfo,
            access_token: result.accessToken,
            refresh_token: result.refreshToken,
            access_expires_in: result.expiresIn,
            refresh_expires_in: result.reExpiresIn,
            user_id: userInfo.userId,
            updatedAt: new Date(),
          }
        }, { upsert: true, new: true });
        const bind_token = jwt.sign({ sns_id: result.userId, sns_type: 'alipay_pc' }, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
        ctx.redirect('/bind?bind_token=' + bind_token)
      } else {
        const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
        if (user.status !== 1) {
          ctx.body = `登录失败,账号锁定`
        } else {
          const token = await createToken(user, ctx.config);
          ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
        }
      }
    } else {
      ctx.status = 404;
      ctx.body = 'fail'
    }
  } else {
    ctx.status = 404;
    ctx.body = '不支持的类型'
  }
});

export default router