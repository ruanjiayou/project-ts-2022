import { Context } from 'koa'
import _ from 'lodash'
import jwt from 'jsonwebtoken'

export async function signIn(ctx: Context, data: any) {
  const User = ctx.models.User;
  const USER_TOKEN = ctx.config.USER_TOKEN;
  const where = { account: data.account };
  const user = await User.getInfo({ where });
  if (_.isNil(user)) {
    ctx.throwBiz('auth.AccountError')
  }
  if (!user.isEqualPass(data.pass)) {
    ctx.throwBiz('auth.AccountError');
  }
  const access_token = jwt.sign(
    {
      id: user.id,
      account: user.account,
      avatar: user.avatar,
      nickname: user.nickname,
      project_id: data.project_id || ''
    },
    USER_TOKEN.ACCESS_TOKEN_SECRET,
    {
      expiresIn: USER_TOKEN.ACCESS_TOKEN_EXPIRES,
    }
  );
  // TODO: redis set user:id access_token
  return { access_token }
}

export async function signUp(ctx: Context, data: any) {
  // account unique

  return {}
}

export async function signOut(ctx: Context, data: any) {

}

export async function signOff(ctx: Context, data: any) {

}

export async function refreshToken(ctx: Context, refresh_token: string) {
  const USER_TOKEN = ctx.config.USER_TOKEN
  try {
    const data = jwt.verify(refresh_token, ctx.config.USER_TOKEN.REFRESH_TOKEN_SECRET);
  } catch (e) {

  }
  const user_data = { id: '' };
  const access_token = jwt.sign(user_data, USER_TOKEN.ACCESS_TOKEN_SECRET, { expiresIn: USER_TOKEN.ACCESS_TOKEN_EXPIRES });
  refresh_token = jwt.sign({ id: user_data.id }, USER_TOKEN.REFRESH_TOKEN_SECRET, { expiresIn: USER_TOKEN.REFRESH_TOKEN_EXPIRES });
  // TODO: access_token => redis, refresh_token => user_info
  return {
    access_token, refresh_token
  }
}