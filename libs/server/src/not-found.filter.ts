import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import * as util from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

@Catch(NotFoundException)
export class NotFoundFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const readFile: any = util.promisify(fs.readFile);
    const htmlPath = path.resolve(__dirname, '../dist/index.html');
    const index = readFile(htmlPath, { encoding: 'utf8' });
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.set('Expires', '-1');
    index.then(html => {
      res.send(html);
    });
  }
}
