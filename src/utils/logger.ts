import path from 'path'
import log4js from 'log4js'
import constant from '../constant'
import config from '../config'

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
    info: {
      type: 'dateFile',
      filename: path.join(constant.PATH.ROOT, 'logs/info.log'),
      keepFileExt: true,
      fileNameSep: '_',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      filename: path.join(constant.PATH.ROOT, 'logs/error.log'),
      keepFileExt: true,
      fileNameSep: '_',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    console: {
      type: 'console'
    },
    filter_log: {
      type: 'logLevelFilter',
      appender: 'info',
      level: 'info',
      maxLevel: 'info'
    },
    filter_error: {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error'
    },
  },
  categories: {
    default: {
      appenders: ['filter_log', 'filter_error'],
      level: config.log_level.default,
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