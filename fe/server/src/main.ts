import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import { ExceptionFilter } from '@nestjs/common';
import { NotFoundFilter } from './not-found.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { STATIC_PATH } from './config'

const shouldcache = (req) => {
  const { url } = req
  if (url.includes('/js/') || url.includes('bundle.js')) {
    return true
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const MAX_TIME = 1000 * 60 * 60 * 24 * 365 // 缓存一年
  app.use((req, res, next) => {
    if (shouldcache(req)) {
      console.log('cache-------url', req.url);
      res.setHeader("Cache-Control", `max-age=${MAX_TIME}`);
    }
    next();
  });
  app.use(compression());
  app.useStaticAssets(join(__dirname, '../dist/pageStatic/static'), {
    prefix: '/static',
  });
  app.useStaticAssets(join(__dirname, '../dist'), {
    prefix: '/',
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
  console.log('server port ----------->', PORT);
  await app.listen(PORT);
}
bootstrap();
