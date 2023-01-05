import got from 'got'
import _ from "lodash"
import moment from "moment-timezone"
import { v4 } from "uuid"
import crptyo from 'crypto'

function preEncode(key: string) {
  return encodeURIComponent(key).replace('+', '%20').replace('*', '%2A').replace('%7E', '~')
}
const token = {
  value: '',
  expiredAt: 0
}

export default function createGetToken(AccessKeyId: string, accessKeySecret: string) {
  return async function getToken() {
    if (token.expiredAt !== 0 && Date.now() < token.expiredAt) {
      return token.value;
    }
    const params: { [key: string]: string } = {
      AccessKeyId,
      Action: 'createToken',
      Version: '2019-02-28',
      Format: 'JSON',
      RegionId: 'cn-shanghai',
      Timestamp: moment().toISOString(),
      SignatureMethod: 'HMAC-SHA1',
      SignatureVersion: '1.0',
      SignatureNonce: v4(),
      Signature: '',
    };
    let query = '';
    const keys = Object.keys(_.omit(params, ['Signature'])).sort();
    keys.forEach(key => {
      query += `&${preEncode(key)}=${preEncode(params[key])}`
    });
    query = query.substring(1);

    const tosign = `${'GET'}&${preEncode('/')}&${preEncode(query)}`;
    const sign = crptyo.createHmac('sha1', accessKeySecret + '&').update(tosign).digest('base64');
    try {
      const data: any = await got.get('http://nls-meta.cn-shanghai.aliyuncs.com/' + `?Signature=${preEncode(sign)}&${query}`).json();
      if (data.ErrMsg === '') {
        token.value = data.Token.Id;
        token.expiredAt = data.Token.ExpireTime;
      }
      return token.value;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}