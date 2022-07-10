import { Context, Next } from 'koa'
import _ from 'lodash'
import path from 'path'
import loader from '../utils/loader'
import BizError from '../utils/bizError'
import constant from '../constant'
import { Package } from '../types/package'

const packages: { [key: string]: Package } = {};

loader({ dir: path.join(constant.PATH.SRC, 'errors') }, (dirInfo) => {
  const lang = dirInfo.filename;
  const langPackage: Package = {};
  loader({ dir: path.join(dirInfo.dir, dirInfo.filename) }, info => {
    const name = info.filename.toUpperCase();
    const data = require(info.fullpath).default;
    if (data) {
      langPackage[name] = data;
    }
  })
  packages[lang] = langPackage;
})

function generateByBizError(bizError: BizError, lang = 'zh-CN') {
  const data = packages[lang] || packages['zh-CN'];
  const result = _.get(data, bizError.bizName, { status: 200, code: -1, message: 'unknown' });
  let message: any = result.message;
  if (typeof message === 'function') {
    message = message(bizError)
  } if (bizError.params) {
    const keys = Object.keys(bizError.params);
    keys.forEach(key => {
      message = _.replace(message, `{${key}}`, bizError.params[key]);
    })
  }
  return {
    status: result.status || 200,
    data: {
      code: result.code,
      message
    }
  }
}
/**
 * 错误处理
 */
export default async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    console.log(e, 'handle');
    const result = generateByBizError(e instanceof BizError ? e : new BizError('unknown'));
    ctx.status = result.status
    ctx.body = result.data
  }
}