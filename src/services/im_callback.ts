import { BaseContext } from 'koa'
import app from '../app'
import _ from 'lodash'
import Logger from '@root/utils/logger'
import { IGroup_Status, MGroup } from '@root/types/model';
import { local2clound, clound2local } from '@root/utils/helper'

const logger = Logger('im_callback_service')

// https://console.tim.qq.com/group_open_http_svc/modify_group_base_info?sdkappid=1400701118&contenttype=json&identifier=administrator&usersig=eJwtzMsKwjAUBNB-yVYpN6aPWOhGLC4UrRjUbUpiuUofJmkQxH%2A3tF3OmWG%2ARBwugdeGpGQVAFmOGZVuHD5wZKlqbNA6I11r5oFVL9l1qEhKQ4AEKKV8ahzWetA4ShhfhwmbVH86NIPHEHKA%2AQOr4R25zxeCtbwXVhS2OvdFZPbHt-XyWu5K%2A7xvNDvl25vnGfn9AQErNPM_&random=522271046

const query = {
  "CallbackCommand": "Group.CallbackAfterGroupInfoChanged",
  "ClientIP": "113.118.225.178",
  "OptPlatform": "RESTAPI",
  "RequestID": "52c68065-ed12-41c1-8661-045ea5d16695",
  "SdkAppid": "1400701118",
  "contenttype": "json"
}

const body = {
  "CallbackCommand": "Group.CallbackAfterGroupInfoChanged",
  "EventTime": 1657389765743,
  "GroupId": "e6a954aa-2419-4743-b968-a971f8077bf1",
  "Introduction": "test update group",
  "Name": "test update",
  "Operator_Account": "administrator",
  "Type": "AVChatRoom"
}


const service: { [key: string]: Function } = {
  'Group.CallbackAfterGroupInfoChanged': async function (data: any, query: any) {
    const ctx = app.context;
    const Group: MGroup = ctx.models.Group;

    const doc = await Group.findById(body.GroupId).lean(true)
    if (doc) {
      // 来自控制台的修改和API的修改是不一样的
      const modified_data: any = _.pick(data, ['Introduction', 'Name', 'ShutUpAllMember'])
      modified_data.status = IGroup_Status.PASSED
      modified_data.data = null
      await Group.updateOne({ _id: data.GroupId }, { $set: clound2local(modified_data) })
    }
  },

}

export default service; 