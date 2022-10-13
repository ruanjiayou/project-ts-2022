export default {
  tokenNotFound: {
    status: 200,
    code: 101000,
    message: 'token已失效!'
  },
  tokenExpired: {
    status: 200,
    code: 101010,
    message: 'token已过期!'
  },
  tokenFail: {
    status: 200,
    code: 101020,
    message: 'token错误!'
  },
  NoPermission: {
    status: 200,
    code: 101030,
    message: '权限不足!'
  },
  AccountError: {
    status: 200,
    code: 101040,
    message: '账号或密码错误!'
  },
  AccountExisted: {
    status: 200,
    code: 101050,
    message: '账号已存在!'
  },
  AccountNotFound: {
    status: 200,
    code: 101060,
    message: '账号不存在!'
  },
  VerifyError: {
    status: 200,
    code: 101070,
    message: '验证码错误!'
  }
};