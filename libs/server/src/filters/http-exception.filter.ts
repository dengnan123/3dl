import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status;
    try {
      status = exception.getStatus();
    } catch (err) {
      console.log('err ', err.message);
      status = 500;
    }
    const { message } = exception;
    // tslint:disable-next-line: no-console
    console.log('statusstatusstatus', status);
    // tslint:disable-next-line: no-console
    console.log('messagemessage', message);
    response.status(200).send({
      errorCode: status,
      timestamp: new Date().toISOString(),
      apiPath: request.url,
      message,
    });
  }
}
