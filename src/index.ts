if (process.env.NODE_ENV === 'production') require('module-alias/register');
import { Context } from 'koa';
import app, { prepare } from './app'
import config from './config'

prepare(async (ctx: Context) => {
  const { MUser, MProject, MComponent, MComponentType } = ctx.models
  const users = await MUser.countDocuments()
  const projects = await MProject.countDocuments()
  const components = await MComponent.countDocuments()
  const componentTypes = await MComponentType.countDocuments()
  if (users === 0 || projects === 0 || components === 0 || componentTypes === 0) {
    console.log('数据需要初始化: mongoimport -u root -p 123456 -h 127.0.0.1 --authenticationDatabase admin -d test --collection test --file /data/backup/test/test.json')
  }
}).then(() => {
  app.listen(config.PORT, function () {
    console.log(`listening at: ${config.PORT}`);
  })
}).catch(err => {
  console.log(err.message);
})
