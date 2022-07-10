import { Schema, model } from 'mongoose'
import moment from 'moment-timezone'
import config from '@root/config/index'
import { IGroup } from '@root/types/model';
import { baseMethod, baseStatic, baseInfo } from '../base'

const schema: Schema = new Schema({
  _id: {
    type: String, // GroupId.(_id是uuid,GroupId是uuid去掉了连接符)
  },
  title: {
    type: String, // Name.群名称
  },
  desc: {
    type: String, // Introduction.群简介
    default: ""
  },
  type: {
    type: String, // Type.群组类型：Private/Public/ChatRoom/Community/AVChatRoom
    default: "AVChatRoom"
  },
  owner_id: {
    type: String, // Owner_Account.群主的 UserId.可以不填
    default: ""
  },
  cover: {
    type: String, // FaceUrl.群头像 URL
    default: ""
  },
  announcement: {
    type: String, // Notification.群公告
    default: ""
  },
  max_member: {
    type: Number, // MaxMemberCount.最大群成员数量
  },
  join_type: {
    type: String, // ApplyJoinOption.申请加群处理方式
  },
  custom_columns: [ // AppDefineData.群组维度的自定义字段
    {
      _id: false,
      Key: String,
      Value: String,
    }
  ],
  data: {
    type: Object, // 修改数据
  },
  available: {
    type: Number,
    default: 1,
    comment: '上下线与status是有区别的',
  },
  created_time: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  modified_time: {
    type: Date,
    default: () => moment().tz(config.timezone).toDate(),
  },
  status: {
    type: Number, // 1: 创建中, 2: 已通过, 3: 修改中, 4: 下线(解散) 5: 已结束
    default: 1,
  },
  resource_type: {
    type: String,
  },
  duanmu_enabled: {
    type: Boolean,
    default: true,
  },
}, {
  strict: true,
  collection: 'group_info',
});

schema.static(baseStatic);
schema.method(baseMethod);

const Model = model<IGroup>('Group', schema, 'group_info');

module.exports = Model