import { Context } from 'koa'
import _ from 'lodash'
import got from 'got'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import crypto from 'crypto'
import shortid from 'shortid'
import config from '~/config/index'
import models from '~/models/mongo'
import { IUser } from '@type/model'

export async function createToken(user: Partial<IUser>, param?: any) {
  const USER_TOKEN = config.USER_TOKEN;
  const access_token = 'Bearer ' + jwt.sign(
    {
      id: user._id,
      jti: shortid.generate(),
      account: user.account,
      avatar: user.avatar,
      nickname: user.nickname,
      project_id: param ? param.project_id : '',
    },
    USER_TOKEN.ACCESS_TOKEN_SECRET,
    {
      expiresIn: USER_TOKEN.ACCESS_TOKEN_EXPIRES,
    }
  );
  const refresh_token = jwt.sign(
    {
      id: user.id,
      createdAt: Date.now(),
    },
    USER_TOKEN.REFRESH_TOKEN_SECRET,
    {
      expiresIn: USER_TOKEN.REFRESH_TOKEN_EXPIRES,
    }
  );
  // 返回信息
  return { access_token, refresh_token }
}
export async function signIn(ctx: Context, data: any) {
  const { MUser, MAccount, MLoginLog } = models;
  const USER_TOKEN = ctx.config.USER_TOKEN;
  // 登录方式判断: account,phone,email
  const { type, account } = data;
  if (!['account', 'phone', 'email'].includes(type)) {
    return ctx.throwBiz('common.ParamError', { param: 'type', message: '不支持的类型' })
  }
  const where = { [type]: account };
  const user = await MUser.getInfo({ where });
  // 用户状态判断: 已注册能登录,已注册被限制,未注册
  if (_.isNil(user)) {
    ctx.throwBiz('auth.AccountError')
  }
  // 查询account密码比较
  if (!user.isEqualPass(data.pass)) {
    ctx.throwBiz('auth.AccountError');
  }
  const accountInfo = await MAccount.getInfo({ where: { user_id: user._id, sns_type: 'self' } })
  // 生成token
  const token = await createToken(user, { project_id: data.project_id || '' })
  await MLoginLog.create({ user_id: user._id, account_id: accountInfo ? accountInfo._id : '', log_id: ctx.ip, log_region: 'CN' });
  // 返回信息
  return token;
}

export async function signUp(ctx: Context, data: any) {
  const { MUser, MAccount } = models;
  // 判断是否注册
  const { type, account } = data;
  if (!['account', 'phone', 'email'].includes(type)) {
    return ctx.throwBiz('common.ParamError', { param: 'type', message: '不支持的类型' })
  }
  const where: any = { [type]: account };
  // type account
  let user = await MUser.getInfo({ where });
  if (user) {
    ctx.throwBiz('auth.AccountExisted');
  }
  try {
    // 创建账号信息并关联
    const userInfo: any = _.pick(data, ['email', 'phone', 'account', 'avatar', 'nickname', 'pass'])
    if (data.sns_id && data.sns_type) {
      const accountInfo: any = _.pick(data, ['sns_id', 'sns_type', 'access_token'])
      userInfo._id = v4();
      userInfo.salt = shortid.generate();
      userInfo.pass = crypto.createHmac('sha1', userInfo.salt).update(userInfo.pass).digest('hex')
      const info = await MUser.create(userInfo);
      accountInfo._id = v4();
      accountInfo.user_id = info._id;
      if (!accountInfo.sns_id) {
        accountInfo.sns_id = info._id;
        accountInfo.sns_type = 'self';
      }
      await MAccount.create(accountInfo);
    }
    ctx.success();
  } catch (e) {
    ctx.fail();
  }
}

export async function signOut(ctx: Context, data: any) {

}

export async function signOff(ctx: Context, data: any) {

}

export async function refreshToken(ctx: Context, refresh_token: string) {
  const USER_TOKEN = ctx.config.USER_TOKEN
  try {
    const data: any = jwt.verify(refresh_token, ctx.config.USER_TOKEN.REFRESH_TOKEN_SECRET);
    const user = await models.MUser.getInfo({ where: { _id: data.id } })
    if (user && user.refreshToken === refresh_token) {
      const user_data = {
        id: user.id,
        token: shortid.generate(),
        account: user.account,
        avatar: user.avatar,
        nickname: user.nickname,
        project_id: data.project_id || ''
      };
      const access_token = jwt.sign(user_data, USER_TOKEN.ACCESS_TOKEN_SECRET, { expiresIn: USER_TOKEN.ACCESS_TOKEN_EXPIRES });
      const result: any = { access_token };
      // 最后一个access_token刷新时返回refresh_token
      if (data.createdAt > Date.now() - USER_TOKEN.ACCESS_TOKEN_EXPIRES) {
        result.refresh_token = jwt.sign({ id: user_data.id }, USER_TOKEN.REFRESH_TOKEN_SECRET, { expiresIn: USER_TOKEN.REFRESH_TOKEN_EXPIRES });
      }
      return result;
    } else {
      ctx.throwBiz('auth.tokenDisabled')
    }
  } catch (e) {
    ctx.throwBiz('auth.tokenDisabled');
  }
}

export async function profile(ctx: Context) {
  const user = await models.MUser.getInfo({ where: { _id: ctx.state.user.id } })
  if (!user) {
    ctx.throwBiz('auth.AccountNotFound')
  }
  return _.pick(user, ['account', 'nickname', 'avatar', 'id']);
}

export async function bindEmail(email: string, code: string, sns_id: string, sns_type: string) {

}

export async function snsLogin(ctx: Context, sns_type: string, data: any) {
  // 查询社交账号是否创建
  // 必须绑定user_id
  // 验证社交账号
  let user: IUser;
  if (sns_type === 'github') {
    user = await githubLogin(ctx.request.query.code as string);
  }
  // 账号状态判断
  if (user.status !== 1) {

  }
  // 生成token

  // 记录登录日志

  // 返回信息
}

async function githubLogin(code: string) {
  const { MUser, MConfig, MAccount } = models;
  const githubConfig = await MConfig.getInfo({ where: { type: 'sns_type', name: 'github' }, lean: true });
  const result: any = await got.post(`https://github.com/login/oauth/access_token?client_id=${githubConfig.value.client_id}&client_secret=${githubConfig.value.client_secret}&code=${code}`, {
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
  const account = await MAccount.findOneAndUpdate({ sns_id: info.id, sns_type: 'github' }, {
    $set: {

    }
  }, { upsert: true, new: true });
  const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
  return user;
}