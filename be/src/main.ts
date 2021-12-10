import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { WsAdapter } from "@nestjs/platform-ws"
import * as compression from "compression"
import { NestExpressApplication } from "@nestjs/platform-express"
import { TransformInterceptor } from "./interceptors/transform.interceptor"
import { HttpExceptionFilter } from "./filters/http-exception.filter"
import { PORT, STATIC_PATH } from "./config"
import * as morgan from "morgan"
import * as Sentry from "@sentry/node"
import { join } from "path"
import { ActionLogger } from "./middleware/actionLog"
import { LoggingInterceptor } from "./interceptors/log"
import {OnlyReadInterceptor} from './interceptors/onlyRead'
import { LogService } from "./log/log.service"
import { AuthService } from "./auth/auth.service"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalInterceptors(
    new OnlyReadInterceptor()
  )
  app.useGlobalInterceptors(
    new LoggingInterceptor(new LogService())
  )
  app.use(compression())
  app.useGlobalFilters(new HttpExceptionFilter())
  const options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,

    credentials: true,
  }
  app.enableCors(options)
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useStaticAssets(join(__dirname, "../../static"), {
    prefix: "/static/",
  })

  app.useStaticAssets(join(__dirname, "../../tmpJson"), {
    prefix: "/download/",
  })

  // tslint:disable-next-line: no-console
  console.log(
    "node is running PORTPORT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    PORT
  )
  await app.listen(PORT)
  Sentry.init({
    dsn:
      "https://69b64fc36db745868c752bc414c54997@o419482.ingest.sentry.io/5463130",
    tracesSampleRate: 1.0,
  })
}
bootstrap()
