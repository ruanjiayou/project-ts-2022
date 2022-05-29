# koa2 + ts

## steps
- `npm init`, `git init`
- `npm install typescript ts-node nodemon -g`
- `npm install -D typescript @types/node cross-env`
- `npx tsc --init`, module改为esnext,rootDir改为./src,outDir改为./dist,sourceMap改为true,include增加["src"],exclude增加["dist","node_modules"]
- package.json增加`"dev": "cross-env NODE_ENV=development nodemon --watch src -e ts,tsx --exec ts-node ./src/index.ts",`
- 安装eslint: 
  - `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
  - eslint --init
- prettier: `npm install -D prettier eslint-config-prettier`
  > .prettierrc.json
  ```json
  {
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true
  }
  ```
- `npm install koa koa-router`
- `npm install -D @types/koa @types/koa-router `
cross-env NODE_ENV=development nodemon --exec ts-node src/app.ts



## TODO:
- ✅ config type
- ✅ 自动加载路由
- ✅ 自动加载model
- constant
- ✅ 扩展ctx方法
- 自动加载BLL
- 业务错误码
- 登录注册
- 统一鉴权
- schedule(task/job)
- email
- jest测试
- log4js日志

## problem
> package.json type设为commonjs,tsconfig.json里module设为commonjs.这样就能运行
- `SyntaxError: Cannot use import statement outside a module`
- `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for D:\projects\project-ts\src\index.ts`