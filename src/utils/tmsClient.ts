import * as tencentcloud from 'tencentcloud-sdk-nodejs'
const TmsClient = tencentcloud.tms.v20201229.Client

const client = new TmsClient({
  credential: { secretId: '', secretKey: '' },
  region: 'ap-guangzhou'
})

export default client;