export default {
  CustomError: {
    status: 200,
    code: -1,
    message(info: any = {}) {
      return info.message || '请求错误'
    }
  },
  ResourceNotFound: {
    status: 200,
    code: 201000,
    message: '资源未找到!'
  },
  RequestFail: {
    status: 200,
    code: 201010,
    message: '请求失败,请重试'
  },
  ThirdPartFail: {
    status: 200,
    code: 201020,
    message: '请求第三方平台失败.{message}'
  },
  ParamError: {
    status: 200,
    code: 201030,
    message: '参数{param}错误 {message}'
  }
};