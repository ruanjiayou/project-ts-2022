import { Document, Model, Schema } from 'mongoose'

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
}

interface BaseDocument<T = any, TQueryHelpers = any, DocType = any> {
  title: string;
  name: string;
  cover: string;
  desc: string;
  available: string;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}

export interface IConfig extends BaseDocument, Document {

  project_id?: string;
  type?: string;
  value?: object;
  order?: number;
}

export interface MConfig extends BaseModel<IConfig>, Model<IConfig> {

}

export interface IProject extends BaseDocument, Document {
  user_id: string;
}

export interface MProject extends BaseModel<IProject>, Model<IProject> {
  
}

export interface IComponent extends BaseDocument, Document {
  accepts: string[];
  status: number;
  parent_id: string;
  tree_id: string;
  children?: IComponent[]
}

export interface MComponent extends BaseModel<IComponent>, Model<IComponent> {
  
}

export interface IComponentType extends BaseDocument, Document {
  order: number;
}

export interface MComponentType extends BaseModel<IComponentType>, Model<IComponentType> {

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

export interface IPage extends BaseDocument, Document {
  _id: string;
  project_id: string;
  template: string;
  tree_id: string;
}

export interface MPage extends BaseModel<IPage>, Model<IPage> {

}

export interface IModule extends BaseDocument, Document {
  _id: string;
  tree_id: string;
  parent_id: string;
  component_id: string;
  component_type: string;
}

export interface MModule extends BaseModel<IModule>, Model<IModule> {

}