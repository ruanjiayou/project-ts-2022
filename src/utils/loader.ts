import fs from 'fs'
import path from 'path'

type Opt = {
  dir: string;
  filter?: Function;
  recusive?: boolean;
}

export type Info = {
  fullpath: string;
  dir: string;
  filename: string;
  ext: string;
}

type CallBack = {
  (info: Info): void;
}

function scanner(dir: string, cb: CallBack, filter?: Function, recusive?: boolean) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const ext = path.extname(file).toLocaleLowerCase();
    const filename = file.substring(0, file.length - ext.length);
    if (recusive === true && fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      scanner(fullpath, cb, filter, recusive);
    } else if (cb) {
      // filter处理
      const info = { fullpath, dir, filename, ext };
      if (typeof filter === 'function') {
        if (filter(info)) {
          cb(info);
        }
      } else {
        cb(info);
      }
    }
  });
}

export default function loader(opt: Opt, cb: CallBack) {
  scanner(opt.dir, cb, opt.filter, opt.recusive);
}
