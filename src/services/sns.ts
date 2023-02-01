import { Context } from 'koa'
import _ from 'lodash'
import got from 'got'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import { google, Auth } from 'googleapis'
import AlipaySdk from 'alipay-sdk';
import { createToken } from '@services/user';
import httpProxyAgent from 'http-proxy-agent'
import httpsProxyAgent from 'https-proxy-agent'

let googleOAuth2Client: Auth.OAuth2Client = null;
let alipaySdk: AlipaySdk = null;

async function login_alipay(ctx: Context, config: any) {
  ctx.status = 301;
  ctx.redirect(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${config.app_id}&scope=auth_user&redirect_uri=${encodeURIComponent(config.redirect_uri)}`);
}
async function login_github(ctx: Context, config: any) {
  ctx.status = 301;
  ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&state=89757&allow_signup=false`);
}

// 生成authurl，跳转验证登录
// https://console.cloud.google.com/
async function login_google(ctx: Context, config: any) {
  if (!googleOAuth2Client) {
    googleOAuth2Client = new google.auth.OAuth2(
      config.client_id,
      config.client_secret,
      config.redirect_uri,
    );
  }
  const url = googleOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    include_granted_scopes: true
  });
  ctx.status = 301;
  ctx.redirect(url);
}
async function login_qq() {

}
async function login_weibo() {

}
async function login_weixin() {

}

async function callback_alipay(ctx: Context, config: any) {
  const { MAccount, MUser } = ctx.models;
  const code = ctx.request.query.auth_code;
  const sns_type = 'alipay';
  if (!alipaySdk) {
    /**
     * 本地支付宝工具生成密钥上传公钥，下载支付宝公钥
     * alipayRootCert.crt 支付宝根证书
     * alipayCertPublicKey_RSA2.crt 支付宝公钥证书
     * appCertPublicKey_{id}.crt 应用公钥证书
     * app_public_key.txt 应用公钥
     * app_secret_key.txt 应用私钥
     * alipay_publickey_RSA2.txt 支付宝公钥
     */
    alipaySdk = new AlipaySdk({
      appId: config.app_id,
      privateKey: config.app_secret_key,
      encryptKey: config.aes_secret, // bfm3d91JlZnxjyklVaAziw==
      alipayPublicKey: config.app_public_key,
      keyType: 'PKCS8',
      signType: 'RSA2',
    });
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
    const account = await MAccount.getInfo({ where: { sns_id: result.userId + '', sns_type }, lean: true });
    if (!account) {
      await MAccount.updateOne({ sns_id: result.userId + '', sns_type }, {
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
    } else if (!account.user_id) {
      // render bind page
      ctx.body = `绑定<div>id/type/name/token == account/pass phone/code email/code</div>`
    } else {
      const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
      const token = await createToken(user, ctx.config);
      ctx.body = `登录成功<script>console.log("${token.access_token}", "${token.refresh_token})</script>`
    }
  } else {
    ctx.status = 404;
    ctx.body = 'fail'
  }
}
async function callback_github(ctx: Context, config: any) {
  const { MAccount, MUser } = ctx.models;
  const code = ctx.request.query.code;
  const sns_type = 'github';
  const result: any = await got.post(`https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&code=${code}`, {
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
  const account = await MAccount.getInfo({ where: { sns_id: info.id + '', sns_type }, lean: true });
  if (account && account.user_id) {
    const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
    const token = await createToken(user, ctx.config);
    ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
  } else {
    await MAccount.updateOne({ sns_id: info.id + '', sns_type }, {
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
}
async function callback_google(ctx: Context, config: any) {
  const code = ctx.request.query.code as string;
  const sns_type = 'google';
  const { MAccount, MUser } = ctx.models;
  if (!googleOAuth2Client) {
    googleOAuth2Client = new google.auth.OAuth2(
      config.client_id,
      config.client_secret,
      config.redirect_uri,
    );
  }
  const { tokens } = await googleOAuth2Client.getToken(code)
  const httpsAgent = httpsProxyAgent('http://localhost:7890');
  const info: any = await got.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + tokens.access_token, { timeout: 10000, agent: { https: httpsAgent } }).json();
  const account = await MAccount.getInfo({ where: { sns_id: info.id + '', sns_type }, lean: true });
  if (!account || !account.user_id) {
    await MAccount.updateOne({ sns_id: info.id + '', sns_type }, {
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
}
async function callback_weibo(ctx: Context, config: any) {
  const { MAccount, MUser } = ctx.models;
  const code = ctx.request.query.code;
  const sns_type = 'weibo';
  const result: any = await got.get(`https://api.weibo.com/oauth2/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&grant_type=authorization_code&redirect_uri=${ctx.query.redirect_uri}&code=${code}?client_id=${config.client_id}&client_secret=${config.client_secret}&code=${code}`, {
    headers: {
      accept: 'application/json',
    },
    timeout: 60000
  }).json();
  const getUID: { uid: string } = await got.get(`https://api.weibo.com/2/account/get_uid.json`, { headers: { access_token: result.access_token } }).json();
  const account = await MAccount.getInfo({ where: { sns_type, sns_id: getUID.uid }, lean: true });
  if (account && account.user_id) {
    const user = await MUser.getInfo({ where: { _id: account.user_id }, lean: true });
    const token = await createToken(user, ctx.config);
    ctx.redirect(`/?access_token=${token.access_token.split(' ')[1]}&refresh_token=${token.refresh_token}&redirect=${encodeURI('/')}`);
  } else {
    const info: { id: number, name: string, profile_image_url: string } = await got.get(`https://api.weibo.com/2/users/show.json?uid=${getUID.uid}`, { headers: { access_token: result.access_token } }).json();
    await MAccount.updateOne({ sns_id: getUID.uid, sns_type }, {
      $setOnInsert: {
        _id: v4(),
        createdAt: new Date(),
      },
      $set: {
        sns_name: info.name,
        sns_icon: info.profile_image_url,
        sns_info: info,
        access_token: result.access_token,
        refresh_token: '',
        access_expires_in: 0,
        refresh_expires_in: 0,
        user_id: '',
        updatedAt: new Date(),
      }
    }, { upsert: true, new: true });
    const bind_token = jwt.sign({ sns_id: info.id + '', sns_type }, ctx.config.USER_TOKEN.ACCESS_TOKEN_SECRET);
    ctx.redirect('/bind?bind_token=' + bind_token)
  }
}
const methods: { [key: string]: Function } = {
  login_alipay,
  login_github,
  login_google,
  login_qq,
  login_weibo,
  login_weixin,
  callback_alipay,
  callback_github,
  callback_google,
  callback_weibo,
};

export default methods;