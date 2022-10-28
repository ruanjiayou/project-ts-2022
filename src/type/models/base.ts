import { Document, Model, Schema, ClientSession } from 'mongoose'

/**
 * 自定义条件对象
 */
export type Hql = {
  where?: any;
  order?: object;
  attrs?: object;
  lean?: boolean;
  count?: boolean;
  data?: object;
  options?: object;
  page?: number;
  limit?: number;
}

export interface BaseModel<T> {
  /**
   * 获取所有数据
   * @param hql 条件对象
   */
  getAll(hql?: Hql): Promise<{ items: T[] }>;
  /**
   * 获取分页列表数据
   * @param hql 条件对象
   */
  getList(hql?: Hql): Promise<{ items: T[], total?: number, ended?: boolean }>;
  /**
   * 按条件获取一个数据详情
   * @param hql 条件对象
   */
  getInfo(hql?: Hql): Promise<T>;
  /**
   * 删除
   * @param hql 条件对象
   */
  destroy(hql?: Hql): Promise<T>;
  /**
   * 获取transaction
   */
  getSession(): Promise<ClientSession>;
}

export interface BaseDocument<T = any, TQueryHelpers = any, DocType = any> {
  title: string;
  name: string;
  cover: string;
  desc: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}
