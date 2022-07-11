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

export enum IMStatus {
  SUCCESS = 'OK',
  FAIL = 'FAIL',
}

export enum IMPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
}

export enum IMGroup_Type {
  Public = 'Public',
  Private = 'Private',
  ChatRoom = 'ChatRoom',
  AVChatRoom = 'AVChatRoom',
  BChatRoom = 'BChatRoom',
  Community = 'Community',
}

export enum IMGroup_ApplyJoinOption {
  FreeAccess = 'FreeAccess',
  NeedPermission = 'NeedPermission',
  DisableApply = 'DisableApply',
}

export interface IMGroup_AppdefineData { [key: string]: any; }[]
export interface IMMember_AppdefinedData { Key: string, Value: string | number }[]

export interface IMGroup {
  GroupId: string;
  Name: string;
  Introduction: string;
  Notification: string;
  FaceUrl: string;
  Type: IMGroup_Type;
  MaxMemberNum: number;
  Owner_Account: string;
  ApplyJoinOption: IMGroup_ApplyJoinOption;
  AppDefineData: IMGroup_AppdefineData;
  ShutUpAllMember: "On" | "Off";
}

export interface IMUser {
  UserID: string;
  Nick: string;
  FaceUrl: string;
}

export enum IMUser_GenderType {
  Gender_Type_Unknown = 'Gender_Type_Unknown',
  Gender_Type_Female = 'Gender_Type_Female',
  Gender_Type_Male = 'Gender_Type_Male',
}
export interface IMUserProfile {
  From_Account: string;
  Tag_Profile_IM_Nick: string;
  Tag_Profile_IM_Gender: string;
  Tag_Profile_IM_BirthDay: number;
  Tag_Profile_IM_Location: string;
  Tag_Profile_IM_SelfSignature: string;
  Tag_Profile_IM_AllowType: 'AllowType_Type_NeedConfirm' | 'AllowType_Type_AllowAny' | 'AllowType_Type_DenyAny',
  Tag_Profile_IM_Language: number;
  Tag_Profile_IM_Image: string;
  Tag_Profile_IM_AdminForbidType: 'AdminForbid_Type_None' | 'AdminForbid_Type_SendOut';
  Tag_Profile_IM_Level: number;
  Tag_Profile_IM_Role: number;

}
export interface IMMember {
  GroupId: string;
  Member_Account: string;
  Role: 'Admin' | 'Member' | 'Owner';
  MsgFlag: IM_MSG_FLAG;
  NameCard: string;
  ShutUpTime: number;
}

export enum IM_MSG_FLAG {
  AcceptAndNotify = 'AcceptAndNotify',
  Discard = 'Discard',
  AcceptNotNotify = 'AcceptNotNotify',
}

enum IM_MSG_TYPE {
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
  MsgType: IM_MSG_TYPE,
  MsgContent: { Text: string }
  | { Desc: string, Latitude: number, Longitude: number }
  | { Index: number, Data: string }
  | { Data: string, Desc: string, Ext: string, Sound: string }
  | { Url: string, UUID: string, Size: number, Second: number, Download_Flag: number }
  | { UUID: string, ImageFormat: number, Type: number, Size: number, Width: number, Height: number, URL: string, ImageInfoArray: [{ Type: number, Size: number, Width: number, Height: number, URL: string }] }
  | { Url: string, UUID: string, FileSize: number, FileName: string, Download_Flag: number }
  | { VideoUrl: string, VideoUUID: string, VideoSize: number, VideoSecond: number, VideoFormat: string, VideoDownloadFlog: number, ThumbUrl: string, ThumbUUID: string, ThumbSize: number, ThumbWidth: number, ThumbHeight: number, ThumbFormat: string, ThumbDownloadFlag: number }
}

export interface IMResponse {
  ActionStatus?: IMStatus;
  ErrorCode: number;
  ErrorInfo: string;
}

enum IM_API_ACCOUNT {
  GET_ACCOUNTS = 'v4/im_open_login_svc/account_check',
  // 导入单个账号
  IMPORT_SINGLE_ACCOUNT = 'v4/im_open_login_svc/account_import',
  // 导入多个账号
  IMPORT_MULTI_ACCOUNT = 'v4/im_open_login_svc/multiaccount_import',
  DELETE_ACCOUNTS = 'v4/im_open_login_svc/account_delete',
  UPDATE_USER_PROFILE = 'v4/profile/portrait_set',
}

enum IM_API_GROUP {
  GET_GROUPS = 'v4/group_open_http_svc/get_appid_group_list',
  GET_DETAIL = 'v4/group_open_http_svc/get_group_info',
  CREATE_GROUPS = 'v4/group_open_http_svc/create_group',
  MUTE_USER = 'v4/group_open_http_svc/forbid_send_msg',
  MUTED_USERS = 'v4/group_open_http_svc/get_group_shutted_uin',
  SEND_MESSAGE = 'v4/group_open_http_svc/send_group_msg',
  SEND_SYSTEM_MESSAGE = 'v4/group_open_http_svc/send_group_system_notification',
  RECALL_MESSAGE = 'v4/group_open_http_svc/group_msg_recall',
  UPDATE_GROUP_PROFILE = 'v4/group_open_http_svc/modify_group_base_info',
}

enum IM_API_OTHER {
  MUTED_ALL = 'v4/openconfigsvr/setnospeaking',

}

enum IM_API_MEMBER {
  UPDATE_MEMBER = 'v4/group_open_http_svc/modify_group_member_info',
  COUNT_MEMBERS = 'v4/group_open_http_svc/get_online_member_num',
  GET_MEMBER_LIST = 'v4/group_open_http_svc/get_group_member_info',
}

export const IMAPI_PATH = {
  ACCOUNT: IM_API_ACCOUNT,
  GROUP: IM_API_GROUP,
  OTHER: IM_API_OTHER,
  MEMBER: IM_API_MEMBER,
}

class IM {
  constructor(sdkappid: number, secret: string, administrator: string, expires: number) {
    this.sdkappid = sdkappid;
    this.secret = secret;
    this.administrator = administrator;
    this.expires = expires;
    this.usersig = this.getSignratue(this.administrator);
    this.created_at = Date.now();
  }
  /**
   * 生成腾讯云IM用户签名
   * @returns userSig
   */
  getSignratue(user_id: string): string {
    const api = new Api(this.sdkappid, this.secret)
    this.created_at = Date.now();
    return api.genUserSig(user_id, this.expires);
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
   * 修改账号资料
   */
  async requestUpdateUserProfile(user_id: string, data: IMUserProfile) {
    const ProfileItem: { Tag: string, Value: string | number }[] = [];
    type UK = keyof IMUserProfile
    Object.keys(data).forEach((key: UK) => {
      ProfileItem.push({ Tag: key, Value: data[key] })
    })
    return this.fetch(IMAPI_PATH.ACCOUNT.UPDATE_USER_PROFILE, { body: { From_Account: user_id, ProfileItem } })
  }

  /**
   * 获取所有组群
   * @param query 查询条件
   */
  async requestGetGroups(query: { Limit: number, GroupType: IMGroup_Type, Next: number } = { Limit: 100, GroupType: IMGroup_Type.AVChatRoom, Next: 0 }) {
    return this.fetch<{ TotalCount: number, Next: number, GroupIdList: [{ GroupId: string }] }>(IMAPI_PATH.GROUP.GET_GROUPS, { query });
  }

  async requestGetGroupDetail(id: string, filter: string[]): Promise<(IMGroup & IMResponse) | IMResponse> {
    const resp = await this.fetch<{ GroupInfo: [(IMGroup & IMResponse) & IMResponse] }>(IMAPI_PATH.GROUP.GET_DETAIL, { body: { GroupIdList: [id], } })
    return resp.ErrorCode === 0 ? resp.GroupInfo[0] : resp;
  }

  /**
   * 创建群聊
   * @param group 组群信息
   */
  async requestCreateGroup(group: Partial<IMGroup>) {
    console.log(group)
    return this.fetch<{ GroupId: string }>(IMAPI_PATH.GROUP.CREATE_GROUPS, { body: group });
  }

  /**
   * 修改群资料
   * @param id 群聊id
   * @param data 修改信息
   */
  async requestUpdateGroup(data: Partial<IMGroup>) {
    return this.fetch(IMAPI_PATH.GROUP.UPDATE_GROUP_PROFILE, { body: data })
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
   * 获取直播群在线人数
   */
  async requestCountMembers(GroupId: string) {
    return this.fetch<IMResponse & { OnlineMemberNum: number }>(IMAPI_PATH.MEMBER.COUNT_MEMBERS, { body: { GroupId } })
  }

  /**
   * 获取群成员列表
   */
  async requestGetMembers(GroupId: string, query: { MemberRoleFilter?: ('Admin' | 'Member' | 'Owner')[], Limit?: number, Offset?: number, Next?: string }) {
    return this.fetch<{ Next?: string, MemberNum: number, MemberList: IMMember[] }>(IMAPI_PATH.MEMBER.GET_MEMBER_LIST, { body: { GroupId, ...query } })
  }

  /**
   * 修改群成员资料.不支持直播群
   */
  async requestUpdateMember(GroupId: string, member: Partial<IMMember>) {
    return this.fetch(IMAPI_PATH.MEMBER.UPDATE_MEMBER, { body: member })
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
   * 设置整个IM应用禁言
   * @param Set_Account 设置禁言的账号
   * @param type 全局禁言类型.group,user
   * @param time 禁言时间
   * @returns 
   */
  async requestMutedApp(Set_Account: string, type: string, time: number) {
    return this.fetch(IMAPI_PATH.OTHER.MUTED_ALL, { body: type === 'group' ? { Set_Account, GroupmsgNospeakingTime: time } : { Set_Account, C2CmsgNospeakingTime: time } })
  }

  /**
   * 调用腾讯云通用接口
   * @param apiPath 请求api路径
   * @param option 请求参数
   */
  async fetch<T>(apiPath: string, option: { query?: { [key: string]: any }, body?: object } = { query: {} }): Promise<IMResponse & T> {
    const query = {
      sdkappid: this.sdkappid,
      contenttype: 'json',
      identifier: this.administrator,
      usersig: Date.now() > this.created_at + this.expires * 1000 ? this.usersig : this.getSignratue(this.administrator),
      random: (Math.random() * 4294967295).toFixed(0),
      ...option.query,
    }
    const url = `https://console.tim.qq.com/${apiPath}${query ? '?' + qs.stringify(query) : ''}`
    return await got.post<IMResponse & T>(url, { json: option.body }).json();
  }
}

export default IM;