import { Document, Model, Schema } from 'mongoose'

/**
 * 自定义条件对象
 */
export type Hql = {
  where?: any;
  order?: object;
  attrs?: object;
  lean?: boolean;
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
  getAll(hql?: Hql): Promise<T[]>;
  /**
   * 获取分页列表数据
   * @param hql 条件对象
   */
  getList(hql?: Hql): Promise<T[]>;
  /**
   * 按条件获取一个数据详情
   * @param hql 条件对象
   */
  getInfo(hql?: Hql): Promise<T>;
}

interface BaseDocument<T = any, TQueryHelpers = any, DocType = any> {
  title: string;
  name: string;
  cover: string;
  desc: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConfig extends BaseDocument, Document {

  project_id?: string;
  type?: string;
  value?: object;
  order?: number;
}

export interface MConfig extends BaseModel<IConfig>, Model<IConfig> {

}

export interface IComponent extends BaseDocument, Document {
  accepts: string[];
  status: number;
}

export interface MComponent extends BaseModel<IConfig>, Model<IConfig> {

}

export interface IJob extends BaseDocument, Document {
  type: string;
  value: object;
}

export interface MJob extends BaseModel<IJob>, Model<IJob> {

}

export interface IUser extends Document {
  _id: string;
  pass: string;
  salt: string;
  account: string;
  avatar: string;
  nickname: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  isEqualPass(pass: string): boolean;
}

export interface MUser extends BaseModel<IUser>, Model<IUser> {
  
}