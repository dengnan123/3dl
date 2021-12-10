
import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LogService } from '../log/log.service'

@Injectable()
export class ActionLogger implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const code = res.statusCode; // 响应状态码
    console.log('req.originalUrl', req.originalUrl)
    next();
    // // 组装日志信息
    // const logFormat = `Method: ${req.method} \n Request original url: ${req.originalUrl} \n IP: ${req.ip} \n Status code: ${code} \n`;
    // // 根据状态码，进行日志类型区分

  }



}