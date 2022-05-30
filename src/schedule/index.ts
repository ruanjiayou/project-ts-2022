import nodeSchedule from 'node-schedule'
import _ from 'lodash'
import path from 'path'
import config from '../config/index'
import { Schedule } from '../types/schedule'
import loader from '../utils/loader'

const schedule: Schedule = {
  tasks: {},
  jobs: {},
  load(task) {
    this.tasks[task.name] = task;
    return this;
  },
  start(name) {
    const task = this.tasks[name];
    if (this.jobs[name]) {
      return this;
    }
    if (task) {
      this.jobs[name] = nodeSchedule.scheduleJob({ rule: task.rule, tz: config.timezone }, function (date) {
        task.tick && task.tick(date);
      });
    }
    return this;
  },
  stop(name) {
    const job = this.jobs[name];
    if (job) {
      delete this.jobs[name];
      return nodeSchedule.cancelJob(job);
    }
    return true;
  },
  tick(name) {
    const task = this.tasks[name];
    if (task) {
      task.tick && task.tick(new Date())
    }
  }
}

loader({
  dir: path.join(__dirname, 'jobs'),
}, function (info) {
  const task = require(info.fullpath).default;
  schedule.load(task);
});

export default schedule;