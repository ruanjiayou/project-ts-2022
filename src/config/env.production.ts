import { URLSearchParams } from 'url'

export default {
  PORT: 3334,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo: {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    user: process.env.MONGO_USER || 'root',
    pass: process.env.MONGO_PASS || '123456',
    db: process.env.MONGO_DB || 'manage',
    query: new URLSearchParams(process.env.MONGO_QUERY || '')
  },
  USER_TOKEN: {
    ACCESS_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@',
    REFRESH_TOKEN_SECRET: '%Ph36Tv9VnpM27!A@',
    ACCESS_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
    REFRESH_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
  },
}