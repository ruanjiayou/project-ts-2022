
import { throwBiz } from '@root/extend/context'
import { IGroup } from '@root/types/model';
import { IMGroup } from '@root/utils/IMsdk'
import _ from 'lodash';

/**
  * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
  * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
  * 
  * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
  * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
  * 000800 - 00D7FF 
    00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
  * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
  * 
  * 注: Unicode在范围 D800-DFFF 中不存在任何字符
  * {@link http://zh.wikipedia.org/wiki/UTF-8}
  * 
  * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
  * 000000 - 00FFFF  两个字节
  * 010000 - 10FFFF  四个字节
  * 
  * {@link http://zh.wikipedia.org/wiki/UTF-16}
  * @param  {String} str 
  * @param  {String} charset utf-8, utf-16
  * @return {Number}
  */
export function getStringBytes(str: string = '', charset: string = 'utf-8') {
  var total = 0,
    charCode,
    i,
    len;
  charset = charset ? charset.toLowerCase() : '';
  if (charset === 'utf-16' || charset === 'utf16') {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0xffff) {
        total += 2;
      } else {
        total += 4;
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
  }
  return total;
}


/**
 * 检测group的字段是否符合规范
 * @param data group数据
 */
export function checkFields(data: any) {
  if (data.title && getStringBytes(data.title) > 30) {
    throwBiz('COMMON.ParamError', { param: 'title', message: '最长30字节' })
  }
  if (data.desc && getStringBytes(data.desc) > 240) {
    throwBiz('COMMON.ParamError', { param: 'desc', message: '最长240字节' })
  }
  if (data.announcement && getStringBytes(data.announcement) > 300) {
    throwBiz('COMMON.ParamError', { param: 'announcement', message: '最长300字节' })
  }
  if (data.cover && getStringBytes(data.cover) > 100) {
    throwBiz('COMMON.ParamError', { param: 'cover', message: '最长100字节' })
  }
}

/**
 * 数据库group转为腾讯云group
 */
export function local2clound(data: IGroup): Partial<IMGroup> {
  const result: any = { GroupId: data._id }
  if (data.title) {
    result.Name = data.title
  }
  if (data.desc) {
    result.Introduction = data.desc
  }
  if (data.type) {
    result.Type = data.type;
  }
  if (data.owner_id) {
    result.Owner_Account = data.owner_id
  }
  if (data.max_member) {
    result.MaxMemberNum = data.max_member
  }
  if (data.custom_columns) {
    result.AppDefineData = data.custom_columns
  }
  if (data.join_type) {
    result.ApplyJoinOption = data.join_type
  }
  if (data.cover) {
    result.FaceUrl = data.cover
  }
  if (data.announcement) {
    result.Notification = data.announcement
  }
  result.ShutUpAllMember = data.duanmu_enabled ? 'Off' : 'On'
  return result
}

/**
 * 腾讯云group转数据库group
 */
export function clound2local(data: Partial<IMGroup>): Partial<IGroup> {
  const result: Partial<IGroup> = { _id: data.GroupId }
  if (data.Name) {
    result.title = data.Name
  }
  if (data.Introduction) {
    result.desc = data.Introduction
  }
  if (data.Owner_Account) {
    result.owner_id = data.Owner_Account
  }
  if (data.MaxMemberNum) {
    result.max_member = data.MaxMemberNum
  }
  if (data.AppDefineData) {
    result.custom_columns = data.AppDefineData
  }
  if (data.ApplyJoinOption) {
    result.join_type = data.ApplyJoinOption
  }
  if (data.FaceUrl) {
    result.cover = data.FaceUrl
  }
  if (data.Type) {
    result.type = data.Type;
  }
  if (data.Notification) {
    result.announcement = data.Notification
  }
  result.duanmu_enabled = data.ShutUpAllMember === 'On' ? false : true
  return result;
}