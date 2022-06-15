import path from 'path'
import log4js from 'log4js'
import constant from '../constant'

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: path.join(constant.PATH.ROOT, 'logs/access.log'),
      keepFileExt: true,
      fileNameSep: '_',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    log: {
      type: 'dateFile',
      filename: path.join(constant.PATH.ROOT, 'logs/info.log'),
      keepFileExt: true,
      fileNameSep: '_',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'log'],
      level: 'info'
    },
    access: {
      appenders: ['access'],
      level: 'info'
    }
  }
});

export default function logger(name: string): log4js.Logger {
  return log4js.getLogger(name);
}