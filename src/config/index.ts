import devConfig from './env.development'
import prodConfig from './env.production'
import testConfig from './env.test'
import { Config } from '../type/app'

const configs: { [key: string]: Config } = {
  'development': devConfig,
  'test': testConfig,
  'production': prodConfig,
}

const env: string = process.env.NODE_ENV

export default configs[env] || devConfig;