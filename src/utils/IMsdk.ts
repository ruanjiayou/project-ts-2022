import qs from 'qs'
import got from 'got'
import Api from './im_sig'

interface IM {
  sdkappid: number;
  secret: string;
  expires: number;
  administrator: string;
  usersig: string;
  created_at: number;
}

export enum GroupType {
  Public = 'Public',
  Private = 'Private',
  ChatRoom = 'ChatRoom',
  AVChatRoom = 'AVChatRoom',
  BChatRoom = 'BChatRoom',
  Community = 'Community',
}
enum IMStatus {
  SUCCESS = 'OK',
  FAIL = 'FAIL',
}

enum IMPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
}

enum MSG_TYPE {
  TIMTextElem = 'TIMTextElem',
  TIMLocationElem = 'TIMLocationElem',
  TIMFaceElem = 'TIMFaceElem',
  TIMCustomElem = 'TIMCustomElem',
  TIMSoundElem = 'TIMSoundElem',
  TIMImageElem = 'TIMImageElem',
  TIMFileElem = 'TIMFileElem',
  TIMVideoFileElem = 'TIMVideoFileElem',
}
interface IM_MSG_BODY {
  MsgType: MSG_TYPE,
  MsgContent: { Text: string }
  | { Desc: string, Latitude: number, Longitude: number }
  | { Index: number, Data: string }
  | { Data: string, Desc: string, Ext: string, Sound: string }
  | { Url: string, UUID: string, Size: number, Second: number, Download_Flag: number }
  | { UUID: string, ImageFormat: number, Type: number, Size: number, Width: number, Height: number, URL: string, ImageInfoArray: [{ Type: number, Size: number, Width: number, Height: number, URL: string }] }
  | { Url: string, UUID: string, FileSize: number, FileName: string, Download_Flag: number }
  | { VideoUrl: string, VideoUUID: string, VideoSize: number, VideoSecond: number, VideoFormat: string, VideoDownloadFlog: number, ThumbUrl: string, ThumbUUID: string, ThumbSize: number, ThumbWidth: number, ThumbHeight: number, ThumbFormat: string, ThumbDownloadFlag: number }
}

interface IMResponse {
  ActionStatus?: IMStatus;
  ErrorCode: number;
  ErrorInfo: string;
}

enum IM_API_ACCOUNT {
  // 导入单个账号
  IMPORT_SINGLE_ACCOUNT = 'v4/im_open_login_svc/account_import',
  // 导入多个账号
  IMPORT_MULTI_ACCOUNT = 'v4/im_open_login_svc/multiaccount_import',
  DELETE_ACCOUNTS = 'v4/im_open_login_svc/account_delete',
}

enum IM_API_GROUP {
  GET_GROUPS = 'v4/group_open_http_svc/get_appid_group_list',
  CREATE_GROUPS = 'v4/group_open_http_svc/create_group',
  MUTE_USER = 'v4/group_open_http_svc/forbid_send_msg',
  MUTED_USERS = 'v4/group_open_http_svc/get_group_shutted_uin',
  SEND_MESSAGE = 'v4/group_open_http_svc/send_group_msg',
  SEND_SYSTEM_MESSAGE = 'v4/group_open_http_svc/send_group_system_notification',
  RECALL_MESSAGE = '/group_open_http_svc/group_msg_recall',
}

enum IM_API_OTHER {
  MUTED_ALL = 'v4/openconfigsvr/setnospeaking',

}

const IMAPI_PATH = {
  ACCOUNT: IM_API_ACCOUNT,
  GROUP: IM_API_GROUP,
  OTHER: IM_API_OTHER,
}

class IM {
  constructor(sdkappid: number, secret: string, administrator: string, expires: number) {
    this.sdkappid = sdkappid;
    this.secret = secret;
    this.administrator = administrator;
    this.expires = expires;
    this.usersig = this.getSignratue();
    this.created_at = Date.now();
  }
  /**
   * 生成腾讯云IM用户签名
   * @returns userSig
   */
  getSignratue(): string {
    const api = new Api(this.sdkappid, this.secret)
    this.created_at = Date.now();
    return api.genUserSig(this.administrator, this.expires);
  }
  /**
   * 导入单个账号.userid长度不超过32
   * @returns IMResponse
   */
  async requestImportAccount(account: { UserID: string, Nick: string, FaceUrl: string }) {
    return this.fetch(IMAPI_PATH.ACCOUNT.IMPORT_SINGLE_ACCOUNT, { body: account })
  }

  /**
   * 导入多个账号.不支持设置昵称和头像.userid长度不超过32
   * @param accounts 用户id数组.做多100个
   */
  async requestImportAccounts(accounts: string[]) {
    return this.fetch<{ FailAccounts: string[] }>(IMAPI_PATH.ACCOUNT.IMPORT_MULTI_ACCOUNT, { body: accounts });
  }

  /**
   * 删除账号
   * @param items 账号数组
   */
  async requestDeleteAccounts(items: { DeleteItem: [{ UserID: string }] }) {
    return this.fetch<{ ResultItem: [{ ResultCode: number, ResultInfo: string, UserID: string }] }>(IMAPI_PATH.ACCOUNT.DELETE_ACCOUNTS, { body: items });
  }

  /**
   * 获取所有组群
   * @param query 查询条件
   */
  async requestGetGroups(query: { Limit: number, GroupType: GroupType, Next: number } = { Limit: 100, GroupType: GroupType.AVChatRoom, Next: 0 }) {
    return this.fetch<{ TotalCount: number, Next: number, GroupIdList: [{ GroupId: string }] }>(IMAPI_PATH.GROUP.GET_GROUPS, { query });
  }

  /**
   * 创建群聊
   * @param group 组群信息
   */
  async requestCreateGroup(group: { Type: GroupType, Owner_Account?: string, GroupId?: string, Name: string, Introduction?: string, Notification?: string, FaceUrl?: string, }) {
    return this.fetch<{ GroupId: string }>(IMAPI_PATH.GROUP.CREATE_GROUPS, { body: group });
  }

  /**
   * 批量禁言/取消禁言(ShutUpTime设为0)
   * @param data 
   */
  async requestMuteUser(data: { GroupId: string, Member_Account: string[], ShutUpTime: number }) {
    return this.fetch(IMAPI_PATH.GROUP.MUTE_USER, { body: data })
  }

  /**
   * 获取群聊被禁言用户列表
   * @param GroupId 群聊id
   */
  async requestMutedUsers(GroupId: string) {
    return this.fetch<{ GroupId: string, ShuttedUinList: [{ Member_Account: string, ShuttedUntil: number }] }>(IMAPI_PATH.GROUP.MUTED_USERS, { body: { GroupId } });
  }

  /**
   * 发送普通消息
   * @param data 发送消息的数据
   */
  async requestSendMessage(data: { GroupId: string, Random: number, From_Account?: string, MsgPriority?: IMPriority, MsgBody: {} }) {
    return this.fetch<{ MsgTime: number, MsgSeq: number, MsgDropReason: string }>(IMAPI_PATH.GROUP.SEND_MESSAGE, { body: data });
  }

  /**
   * 发送系统消息
   * @param data 消息数据
   * @returns 
   */
  async requestSendSystemMessage(data: { GroupId: string, Content: string, ToMembers_Account?: string[] }) {
    return this.fetch(IMAPI_PATH.GROUP.SEND_SYSTEM_MESSAGE, { body: data });
  }

  /**
   * 消息撤回
   * @param GroupId 群聊id
   * @param MsgSeqList 消息序号列表
   * @returns 
   */
  async requestRecallMessage(GroupId: string, MsgSeqList: string[]) {
    return this.fetch<{ MsgSeq: number, RetCode: number, RecallRetList: [{ MsgSeq: number, RetCode: number }] }>(IMAPI_PATH.GROUP.RECALL_MESSAGE, { body: { GroupId, MsgSeqList } });
  }

  /**
   * 设置全局禁言
   * @param Set_Account 设置禁言的账号
   * @param type 全局禁言类型.group,user
   * @param time 禁言时间
   * @returns 
   */
  async requestMutedAll(Set_Account: string, type: string, time: number) {
    return this.fetch(IMAPI_PATH.OTHER.MUTED_ALL, { body: type === 'group' ? { Set_Account, GroupmsgNospeakingTime: time } : { Set_Account, C2CmsgNospeakingTime: time } })
  }

  /**
   * 调用腾讯云通用接口
   * @param apiPath 请求api路径
   * @param option 请求参数
   */
  async fetch<T>(apiPath: string, option?: { query?: object, body?: object }): Promise<IMResponse & T> {
    return await got.post<IMResponse & T>(`https://console.tim.qq.com/${apiPath}${option.query ? qs.stringify(option.query) : ''}`, { json: option.body }).json();
  }
}

export default IM;