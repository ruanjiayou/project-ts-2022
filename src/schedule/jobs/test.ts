import moment from 'moment-timezone'
import config from '@config'
import { Task } from '@type/schedule'

const task: Task = {
  name: 'test',
  rule: '*/5 * * * * *',
  tick(date, app) {
    console.log(this.name, moment(date).tz(config.timezone).format());
  },
}

export default task;