import { BaseContext } from 'koa'
import app from '../app'
import _ from 'lodash'
import Logger from '@root/utils/logger'
import { IGroup_Status, MGroup } from '@root/types/model';
import { local2clound, clound2local } from '@root/utils/helper'
import tmsClient from '../utils/tmsClient'

const logger = Logger('im_callback_service')

// https://console.tim.qq.com/group_open_http_svc/modify_group_base_info?sdkappid=1400701118&contenttype=json&identifier=administrator&usersig=eJwtzMsKwjAUBNB-yVYpN6aPWOhGLC4UrRjUbUpiuUofJmkQxH%2A3tF3OmWG%2ARBwugdeGpGQVAFmOGZVuHD5wZKlqbNA6I11r5oFVL9l1qEhKQ4AEKKV8ahzWetA4ShhfhwmbVH86NIPHEHKA%2AQOr4R25zxeCtbwXVhS2OvdFZPbHt-XyWu5K%2A7xvNDvl25vnGfn9AQErNPM_&random=522271046



const service: { [key: string]: Function } = {
  'Group.CallbackAfterGroupInfoChanged': async function (data: any, query: any): Promise<boolean> {
    // const query = {
    //   "CallbackCommand": "Group.CallbackAfterGroupInfoChanged",
    //   "ClientIP": "113.118.225.178",
    //   "OptPlatform": "RESTAPI",
    //   "RequestID": "52c68065-ed12-41c1-8661-045ea5d16695",
    //   "SdkAppid": "1400701118",
    //   "contenttype": "json"
    // }

    // const body = {
    //   "CallbackCommand": "Group.CallbackAfterGroupInfoChanged",
    //   "EventTime": 1657389765743,
    //   "GroupId": "e6a954aa-2419-4743-b968-a971f8077bf1",
    //   "Introduction": "test update group",
    //   "Name": "test update",
    //   "Operator_Account": "administrator",
    //   "Type": "AVChatRoom"
    // }
    const ctx = app.context;
    const Group: MGroup = ctx.models.Group;

    const doc = await Group.findById(data.GroupId).lean(true)
    if (doc) {
      // 来自控制台的修改和API的修改是不一样的
      const modified_data: any = _.pick(data, ['Introduction', 'Name', 'ShutUpAllMember'])
      modified_data.status = IGroup_Status.PASSED
      modified_data.data = null
      await Group.updateOne({ _id: data.GroupId }, { $set: clound2local(modified_data) })
    }
    return true;
  },
  'Group.CallbackAfterNewMemberJoin': async function (data: any, query: any): Promise<boolean> {
    // const query1 = { "CallbackCommand": "Group.CallbackAfterNewMemberJoin", "ClientIP": "112.95.228.195", "OptPlatform": "Web", "RequestID": "cf026bb1-e5da-4eba-99c8-b257f25278a0", "SdkAppid": "1400701118", "contenttype": "json" }
    // const body1 = {  "CallbackCommand": "Group.CallbackAfterNewMemberJoin", "EventTime": 1657611813070, "GroupId": "e6a954aa-2419-4743-b968-a971f8077bf1", "JoinType": "Apply", "NewMemberList": [{ "Member_Account": "ttt" }], "Operator_Account": "ttt", "Type": "AVChatRoom" }

    return true;
  },
  'Group.CallbackBeforeSendMsg': async (data: any, query: any): Promise<boolean> => {
    const query1 = { "CallbackCommand": "Group.CallbackBeforeSendMsg", "ClientIP": "112.95.228.195", "OptPlatform": "Web", "RequestID": "80b98a8d-b1f9-4ea0-9320-22cc0dd0d8f2", "SdkAppid": "1400701118", "contenttype": "json" }
    const body = {
      "CallbackCommand": "Group.CallbackBeforeSendMsg",
      "EventTime": 1657699196949,
      "From_Account": "ttt",
      "GroupId": "e6a954aa-2419-4743-b968-a971f8077bf1",
      "MsgBody": [{ "MsgContent": { "Text": "hello world" }, "MsgType": "TIMTextElem" }],
      "MsgPriority": "Normal",
      "OnlineOnlyFlag": 0,
      "Operator_Account": "ttt",
      "Random": 41784661,
      "Type": "AVChatRoom"
    }

    try {
      const msg = data.MsgBody[0]
      if (msg && msg.MsgType === 'TIMTextElem') {
        const response = await tmsClient.TextModeration({ Content: Buffer.from(msg.MsgContent.Text).toString('base64') })
        console.log(response)
        return response.Suggestion === 'Pass'
      } else {
        return false;
      }
    } catch (e) {
      console.error(e.message)
      return false
    }
  },
  'Group.CallbackAfterSendMsg': async (data: any, query: any): Promise<boolean> => {
    // const query = {"CallbackCommand":"Group.CallbackAfterSendMsg","ClientIP":"106.52.172.126","OptPlatform":"RESTAPI","RequestID":"c637d5f9-1d0a-4f51-acca-905a47362c3d","SdkAppid":"1400701118","contenttype":"json"}
    const body = {
      "CallbackCommand": "Group.CallbackAfterSendMsg",
      "EventTime": 1657612269059,
      "From_Account": "@TLS#NOT_FOUND",
      "GroupId": "e6a954aa-2419-4743-b968-a971f8077bf1",
      "MsgBody": [{
        "MsgContent": { "Text": "Hello World" },
        "MsgType": "TIMTextElem"
      }],
      "MsgPriority": "Normal",
      "MsgSeq": 4,
      "MsgTime": 1657612269,
      "OnlineOnlyFlag": 0,
      "Operator_Account": "@TLS#NOT_FOUND",
      "Random": 26804506,
      "Type": "AVChatRoom"
    }
    return true;
  },
}

export default service; 