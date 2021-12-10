import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

import * as Sentry from '@sentry/node';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.use(compression());
  app.useGlobalFilters(new HttpExceptionFilter());
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,

    credentials: true,
  };
  app.enableCors(options);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useStaticAssets(join(__dirname, '../../static'), {
    prefix: '/static/',
  });

  app.useStaticAssets(join(__dirname, '../../tmpJson'), {
    prefix: '/download/',
  });

  const PORT = process.env.PORT || 3000;
  // tslint:disable-next-line: no-console
  console.log(
    'node is running PORTPORT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
    PORT,
  );
  await app.listen(PORT);
  Sentry.init({
    dsn:
      'https://c57da7940a584de7b43e4de43e0d5d4f@o419482.ingest.sentry.io/5338210',
  });
}
bootstrap();
