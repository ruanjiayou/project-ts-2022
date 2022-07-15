import koa, { Context } from 'koa'
import { Job } from 'node-schedule'

export type Task = {
  name: string;
  rule: string;
  tick(date: Date, app?: koa): void;
}

export interface Schedule {
  tasks: {
    [key: string]: Task;
  };
  jobs: {
    [key: string]: Job;
  };
  load(this: Schedule, task: Task): Schedule;
  start(this: Schedule, name: string): Schedule;
  stop(this: Schedule, name: string): boolean;
  tick(this: Schedule, name: string): void;
}