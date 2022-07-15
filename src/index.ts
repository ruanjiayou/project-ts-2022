if (process.env.NODE_ENV === 'production') require('module-alias/register');
import app from './app'
import config from './config'
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