import { Context } from 'koa'
import _ from 'lodash'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { MUser, IUser } from '@type/model'
import * as uuid from 'uuid'
import shortid from 'shortid'

export async function signIn(ctx: Context, data: any) {
  const User: MUser = ctx.models.User;
  const USER_TOKEN = ctx.config.USER_TOKEN;
  const where = { account: data.account };
  const user = await User.getInfo({ where });
  if (_.isNil(user)) {
    ctx.throwBiz('AUTH.AccountError')
  }
  if (!user.isEqualPass(data.pass)) {
    ctx.throwBiz('AUTH.AccountError');
  }
  const access_token = jwt.sign(
    {
      id: user.id,
      token: shortid.generate(),
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
  // TODO: redis set user:id access_token
  await User.updateOne({ _id: user.id }, { $set: { refreshToken: refresh_token } });
  return { access_token, refresh_token }
}

export async function signUp(ctx: Context, data: any) {
  const User: MUser = ctx.models.User;
  const user = await User.getInfo({ where: { account: data.account } })
  if (user) {
    ctx.throwBiz('AUTH.AccountExisted');
  }
  const userInfo: any = _.pick(data, ['account', 'pass', 'avatar', 'nickname'])
  userInfo._id = uuid.v4();
  userInfo.salt = shortid.generate();
  userInfo.pass = crypto.createHmac('sha1', userInfo.salt).update(userInfo.pass).digest('hex')
  await User.create(userInfo);
}

export async function signOut(ctx: Context, data: any) {

}

export async function signOff(ctx: Context, data: any) {

}

export async function refreshToken(ctx: Context, refresh_token: string) {
  const USER_TOKEN = ctx.config.USER_TOKEN
  try {
    const data: any = jwt.verify(refresh_token, ctx.config.USER_TOKEN.REFRESH_TOKEN_SECRET);
    const User: MUser = ctx.models.User;
    const user = await User.getInfo({ where: { _id: data.id } })
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
      ctx.throwBiz('AUTH.tokenDisabled')
    }
  } catch (e) {
    ctx.throwBiz('AUTH.tokenDisabled');
  }
}

export async function profile(ctx: Context) {
  const User: MUser = ctx.models.User;
  const user = await User.getInfo({ where: { _id: ctx.state.user.id } })
  if (!user) {
    ctx.throwBiz('AUTH.AccountNotFound')
  }
  return _.pick(user, ['account', 'nickname', 'avatar', 'id']);
}