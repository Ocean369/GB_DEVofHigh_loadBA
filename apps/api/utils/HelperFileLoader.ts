import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
const publicPath = __dirname + '/../../../public';
let path = publicPath;

export class HelperFileLoader {
  set path(_path) {
    path = publicPath + _path;
  }
  public customFileName(req, file, cb) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  }
  public destinationPath(req, file, cb) {
    console.log('path (destinationPath)', path)
    cb(null, path);
  }

  public fileFilter(req, file, cb) {
    let acceptFile: Boolean;
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    const regex = /^(jpg|jpeg|png|gif)$/i;
    acceptFile = regex.test(fileExtension);
    cb(null, acceptFile);
  }
}
