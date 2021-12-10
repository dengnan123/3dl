import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import { ExceptionFilter } from '@nestjs/common';
import { NotFoundFilter } from './not-found.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(compression());

  app.useStaticAssets(join(__dirname, '../../umd-dist'), {
    prefix: '/static',
    extensions: ['css', 'js', 'html', 'png', 'tff', 'html', 'fmap', 'theme'],
  });



  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(options);

  const http: ExceptionFilter = new HttpExceptionFilter();
  const not: ExceptionFilter = new NotFoundFilter();
  app.useGlobalFilters(http, not);

  app.useGlobalInterceptors(new TransformInterceptor());
  const PORT = process.env.PORT || 3000;
  // tslint:disable-next-line: no-console
  console.log('PORTPORTPORT', PORT);
  await app.listen(PORT);
}
bootstrap();
