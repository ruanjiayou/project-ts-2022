import { URLSearchParams } from 'url'

export default {
  PORT: process.env.PORT,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_url: process.env.mongo_url,
  USER_TOKEN: {
    ACCESS_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@',
    REFRESH_TOKEN_SECRET: '%Ph36Tv9VnpM27!A@',
    ACCESS_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
    REFRESH_TOKEN_EXPIRES: 60 * 60 * 24 * 7,
  },
}