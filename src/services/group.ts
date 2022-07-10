import { Context } from 'koa'
import _ from 'lodash'
import Logger from '@root/utils/logger'
import bizError from '@root/utils/bizError'
import { IGroup, IGroup_Status, MGroup } from '@root/types/model';
import { IMGroup, IMGroup_Type } from '@root/utils/IMsdk'
import { local2clound, checkFields } from '@root/utils/helper'

const logger = Logger('group_service')

const service = {
  async createGroup(ctx: Context, data: any) {
    const Group: MGroup = ctx.models.Group
    data = local2clound(ctx.request.body)
    if (!data.title) {
      ctx.throwBiz('COMMON.ParamError', { message: '标题不能为空' })
    }
    checkFields(data);
    // 直播类型不需要加入方式
    if (data.type === IMGroup_Type.AVChatRoom) {
      delete data.join_type;
    }
    try {
      const result = await ctx.im.requestCreateGroup({
        GroupId: data._id,
        Type: data.type,
        Owner_Account: data.owner_id,
        Name: data.title,
        Introduction: data.desc,
        FaceUrl: data.cover,
        Notification: data.announcement,
      })
      if (result.ErrorCode === 0) {
        const item: IGroup = await Group.create(data);
      }
      return result;
    } catch (e) {
      logger.error('requestCreateGroup fail:' + e.message)
      if (e) {
        throw e;
      } else {
        ctx.throwBiz('COMMON.RequestFail')
      }
    }
  },
  async updateGroup(ctx: Context, _id: string, data: any) {
    const Group: MGroup = ctx.models.Group
    if (_.isEmpty(data)) {
      ctx.throwBiz('COMMON.ResourceNotFound', { message: '请传入参数' })
    }
    if (data.type) {
      ctx.throwBiz('COMMON.CusomError', { message: '不能修改组群类型' })
    }
    checkFields(data);
    const group: IGroup = await Group.findOne({ _id }).lean(true);
    if (!group) {
      ctx.throwBiz('COMMON.ResourceNotFound')
    }
    if (group.status !== IGroup_Status.PASSED) {
      ctx.throwBiz('COMMON.CusomError', { message: '组群现在不能被修改' })
    }
    const info: Partial<IMGroup> = local2clound(data)
    info.GroupId = _id;
    try {
      const result = await ctx.im.requestUpdateGroup(_id, local2clound(data))
      if (result.ErrorCode === 0) {
        await Group.updateOne({ _id }, { $set: { data, status: IGroup_Status.UPDATING } })
      }
      return result;
    } catch (e) {
      logger.error('requestUpdateGroup fail:' + e.message)
      if (e instanceof bizError) {
        throw e;
      } else {
        ctx.throwBiz('COMMON.RequestFail')
      }
    }
  },
}

export default service; 