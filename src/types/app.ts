import koa, { Context } from "koa";
import { Document, Schema, Model } from 'mongoose'
import { ConfigModel, ConfigDoc } from "./schema/config";
import { ComponentModel, ComponentDoc } from "./schema/component";
import { Schedule } from "./schedule";

type Config = {
  PORT: number;
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
  USER_TOKEN_SECRET: string;
}

type Pagination = {
  page: number;
  limit: number;
}

declare module "koa" {
  interface BaseContext {
    paging(): Pagination;
    success(data?: any, params?: any): void;
    throwBiz(name: string, params?: object): void;
    config: Config;
    models: {
      [key: string]: ConfigModel | ComponentModel;
    },
    schedule: Schedule
  }
}
