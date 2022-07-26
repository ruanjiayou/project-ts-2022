if (process.env.NODE_ENV === 'production') require('module-alias/register');
import app from './app'
import config from './config'
import mongoose from 'mongoose'

mongoose.connect(config.mongo_url).then(() => {
  app.listen(config.PORT, function () {
    console.log(`listening at: ${config.PORT}`);
  })
}).catch(err => {
  console.log(err.message);
})