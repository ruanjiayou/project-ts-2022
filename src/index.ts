if (process.env.NODE_ENV === 'production') require('module-alias/register');
import app from './app'
import config from './config'
import mongoose from 'mongoose'

(async () => {
  try {
    await mongoose.connect(config.mongo_url)
    if (process.env.NODE_ENV === 'development') {
      const { User, Component } = app.context.models
      const users = await User.countDocuments()
      const components = await Component.countDocuments()
      if (users === 0) {
        await User.create({
          "_id": "6c669e34-0d6a-49da-853f-43e737ea9165",
          "available": 1,
          "account": "2048",
          "nickname": "max",
          "avatar": "",
          "pass": "152bc08b6570948914d42c3bddbde340445c2d89",
          "salt": "zMVpRYmzx",
          "createdAt": new Date("2022-06-17T06:17:46.655Z"),
          "updatedAt": new Date("2022-06-17T06:17:46.657Z"),
          "__v": 0
        })
      }
      if (components === 0) {
        await Component.insertMany([
          {
            "_id": "e7b4da01-2e30-47ac-bdba-a071ca2f5015",
            "title": "模板页",
            "available": 1,
            "status": 1,
            "project_id": "",
            "type": "MenuItem",
            "parent_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "accepts": [],
            "attrs": {
              "path": "/page"
            },
            "order": 1,
            "createdAt": new Date("2022-07-22T00:45:18.730+08:00"),
            "updatedAt": new Date("2022-07-22T00:45:18.730+08:00"),
            "__v": 0
          },
          {
            "_id": "d6425a47-8852-4492-ae86-de9d18358541",
            "title": "组件",
            "name": "",
            "available": 1,
            "status": 1,
            "project_id": "",
            "parent_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-17T17:32:33.779+08:00"),
            "updatedAt": new Date("2022-07-17T17:32:33.779+08:00"),
            "__v": 0,
            "type": "MenuItem",
            "attrs": {
              "path": "/component"
            }
          },
          {
            "_id": "d4d05ea2-0b14-43f4-949a-e1ed80704564",
            "title": "测试",
            "name": "",
            "available": 1,
            "status": 1,
            "project_id": "",
            "type": "MenuItem",
            "parent_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-17T17:34:05.130+08:00"),
            "updatedAt": new Date("2022-07-17T17:34:05.130+08:00"),
            "__v": 0
          },
          {
            "_id": "c3a7a629-96be-4b4d-b700-025d0b6093b2",
            "title": "sub",
            "name": "",
            "available": 1,
            "status": 1,
            "project_id": "",
            "type": "MenuItem",
            "parent_id": "d4d05ea2-0b14-43f4-949a-e1ed80704564",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-17T17:34:31.501+08:00"),
            "updatedAt": new Date("2022-07-17T17:34:31.501+08:00"),
            "__v": 0
          },
          {
            "_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "title": "后台菜单根组件",
            "available": 1,
            "project_id": "",
            "status": 1,
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-17T01:40:15.778+08:00"),
            "updatedAt": new Date("2022-07-17T01:40:15.780+08:00"),
            "__v": 0,
            "parent_id": "",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "name": "menu"
          },
          {
            "_id": "57b54dd9-1b81-41b3-b06c-0734091eafa7",
            "title": "应用根节点",
            "name": "app",
            "available": 1,
            "status": 1,
            "project_id": "",
            "parent_id": "",
            "tree_id": "",
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-21T00:16:48.495+08:00"),
            "updatedAt": new Date("2022-07-21T00:16:48.495+08:00"),
            "__v": 0
          },
          {
            "_id": "03a76134-6d79-486b-bad4-24547c875d8e",
            "title": "首页",
            "available": 1,
            "status": 1,
            "project_id": "",
            "parent_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "tree_id": "bc2753d5-2af0-4bba-8eef-b2b5cdba2caf",
            "accepts": [],
            "order": 1,
            "createdAt": new Date("2022-07-17T17:30:01.084+08:00"),
            "updatedAt": new Date("2022-07-17T17:30:01.086+08:00"),
            "__v": 0,
            "name": "",
            "type": "MenuItem",
            "attrs": {
              "path": "/bashboard"
            }
          }
        ])
      }
    }
    app.listen(config.PORT, function () {
      console.log(`listening at: ${config.PORT}`);
    })
  } catch (e) {
    console.log(e.message)
  }
})();