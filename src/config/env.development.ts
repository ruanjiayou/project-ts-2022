export default {
  PORT: process.env.PORT || 3334,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  mongo_url: process.env.mongo_url || 'mongodb://root:123456@localhost:27017/manage?authSource=admin',
  USER_TOKEN: {
    ACCESS_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@',
    REFRESH_TOKEN_SECRET: '%Ph36Tv9VnpM27!A@',
    ACCESS_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
    REFRESH_TOKEN_EXPIRES: 60 * 60 * 24 * 30,
  },
}