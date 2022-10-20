
import multer from '@koa/multer'
import mkdirp from 'mkdirp'
import constant from '~/constant';
import moment from 'moment-timezone';
import { v4 } from 'uuid';
import mime from 'mime-types'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `${constant.PATH.STATIC}/upload/${moment().format('YYYY-DD-MM')}`;
    mkdirp.sync(dir);
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, `${v4()}.${mime.extension(file.mimetype)}`)
  }
});

const upload = multer({
  storage: storage
});

export default upload;