if (process.env.NODE_ENV === 'production') require('module-alias/register');
import { Context } from 'koa';
import app, { prepare } from './app'
import config from './config'

prepare(async (ctx: Context) => {
  const { User, Project, Component, ComponentType } = ctx.models
  const users = await User.countDocuments()
  const projects = await Project.countDocuments()
  const components = await Component.countDocuments()
  const componentTypes = await ComponentType.countDocuments()
  if (users === 0) {
    await User.create({
      "_id": "6c669e34-0d6a-49da-853f-43e737ea9165",
      "available": 1,
      "account": "2048",
      "nickname": "max",
      "avatar": "",
      "pass": "152bc08b6570948914d42c3bddbde340445c2d89",
      "salt": "zMVpRYmzx",
      "createdAt": new Date("2022-06-17T06:17:46.655Z"),
      "updatedAt": new Date("2022-06-17T06:17:46.657Z"),
      "__v": 0
    })
  }
  if (projects === 0 || components === 0 || componentTypes === 0) {
    console.log('数据需要初始化: mongoimport -u root -p 123456 -h 127.0.0.1 --authenticationDatabase admin -d test --collection test --file /data/backup/test/test.json')
  }
}).then(() => {
  app.listen(config.PORT, function () {
    console.log(`listening at: ${config.PORT}`);
  })
}).catch(err => {
  console.log(err.message);
})
