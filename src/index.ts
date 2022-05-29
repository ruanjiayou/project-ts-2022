import app from './app'
import config from './config/index'
import mongoose from 'mongoose'

const uri = `mongodb://${config.mongo.host + ':' + config.mongo.port}`;

mongoose.connect(uri, {
  user: config.mongo.user,
  pass: config.mongo.pass,
  dbName: config.mongo.db,
}).then(() => {
  app.listen(config.PORT, function () {
    console.log(`listening at: ${config.PORT}`);
  })
}).catch(err => {
  console.log(err.message);
})