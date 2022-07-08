import { Schedule } from "./schedule";
import IM from '../utils/IMsdk'

type Config = {
  PORT: number;
  /**
   * 制定服务器时区
   */
  timezone: string;
  language: string;
  mongo: {
    host: string;
    port: number;
    user: string;
    pass: string;
    db: string;
    query: object | undefined;
  },
  USER_TOKEN: {
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES: number;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES: number;
  },
}

type Pagination = {
  /**
   * 页码,从1开始
   */
  page: number;
  /**
   * 列表每页数量
   */
  limit: number;
}

declare module "koa" {
  interface BaseContext {
    /**
     * 获取请求的分页参数
     */
    paging(): Pagination;
    /**
     * 服务器正常返回数据
     * @param data 返回的数据
     * @param params 额外参数
     */
    success(data?: any, params?: any): void;
    /**
     * 中断业务逻辑,抛出错误码
     * @param name 业务错误名称
     * @param params 额外参数
     */
    throwBiz(name: string, params?: object): void;
    config: Config;
    im: IM;
    models: {
      [modelName: string]: any;
    },
    schedule: Schedule
  }
}
