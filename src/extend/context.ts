import _ from 'lodash'
import BizError from '../utils/bizError';

export function paging() {
  let { page, pn: limit } = this.request.query;
  page = Math.max(parseInt(page) || 1, 1)
  limit = Math.min(parseInt(limit, 20), 20)
  return { page, limit }
}

/**
 * 统一返回数据格式
 * @param data any 返回的数据部分
 * @param [params] object {code,message} 
 */
export function success(data: any, params: any = {}) {
  const { status = 200, code = 0, message = '' } = params;
  const body: any = { code, message };
  if (!_.isNil(data)) {
    body.data = data;
  }
  this.status = status
  this.body = body;
}

export function throwBiz(name: string, params?: object) {
  const bizError = new BizError(name, params);
  throw bizError;
}