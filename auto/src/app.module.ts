import { Module, HttpModule, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { InitService } from './app.service';
import { GitService } from './git.service'
import { ServerService } from './server.service'
const entities = [`${__dirname}/**/entities/**{.ts,.js}`];
@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [InitService, GitService, ServerService],
})
export class AppModule { }
