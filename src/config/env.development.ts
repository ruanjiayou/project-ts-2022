export default {
  PORT: 3334,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    user: 'root',
    pass: '123456',
    db: 'manage',
    query: {
      authSource: 'admin'
    }
  },
  USER_TOKEN: {
    ACCESS_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@',
    REFRESH_TOKEN_SECRET: '%Ph36Tv9VnpM27!A@',
    ACCESS_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
    REFRESH_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
  },
}