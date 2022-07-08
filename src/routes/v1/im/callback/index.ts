import { Context } from 'koa'
import _ from 'lodash'
import uuid from 'uuid'
import { IGroup, MGroup } from '@root/types/model';

const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1/callback'
})

router.post('/', async (ctx: Context) => {
  const query = ctx.query;
  const { SdkAppid, CallbackCommand, contenttype, ClientIP, OptPlatform } = query;
  const body = ctx.request.body;

  const Group: MGroup = ctx.models.Group
  const data: any = _.pick(ctx.request.body, ['title', 'desc', 'type']);
  data._id = uuid.v4();
  const item: IGroup = await Group.create({});
  ctx.body = { ActionStatus: 'OK', ErrorInfo: '', ErrorCode: 0 };
})

export default router