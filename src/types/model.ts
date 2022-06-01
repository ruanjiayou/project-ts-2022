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

export interface IConfig extends Document {
  _id?: string;
  project_id?: string;
  name?: string;
  desc?: string;
  type?: string;
  value?: object;
  createdAt?: Date;
  updatedAt?: Date;
  order?: number;
}

export interface IConfigModel extends BaseModel<IConfig>, Model<IConfig> {

}

export interface IComponent extends Document {
  _id: string;
  title: string;
  name: string;
  cover: string;
  desc: string;
  accepts: string[];
  status: number;
}

export interface IComponentModel extends BaseModel<IConfig>, Model<IConfig> {

}

export interface IJob extends Document {
  _id: string;
  name: string;
  type: string;
  value: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobModel extends BaseModel<IJob>, Model<IJob> {

}