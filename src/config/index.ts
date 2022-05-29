import devConfig from './env.development'
import prodConfig from './env.production'

const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

export default config;