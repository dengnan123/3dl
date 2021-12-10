import { Module, HttpModule, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { InitService } from './app.service';
import { PageCompModule } from './page-comp/page-comp.module';
import { PageModule } from './page/page.module';
import { CompModule } from './comp/comp.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventsModule } from './events/socket.module';
import { diskStorage } from 'multer';
import { ThemeModule } from './theme/theme.module';
import { TagModule } from './tag/tag.module';
import { PluginModule } from './plugin/plugin.module';
import { PluginTagModule } from './pluginTag/pluginTag.module';
import { ApiHostModule } from './apiHost/apiHost.module';
import { basePath, pageStaticPath } from './utils/file';
import { ReplaceModule } from './replace/replace.module';
import { StartTempModule } from './startTemp/startTemp.module';
import { CustomFuncModule } from './customFunc/customFunc.module'
import { LoadingModule } from './loading/loading.module'
import { AuthModule } from './auth/auth.module'
import * as path from 'path';
import * as moment from 'dayjs';
import * as fs from 'fs-extra';
import { mysqlConfig, pgConfig } from './config/db'
import { RedashModule } from './redash/redash.module';
import { QueryModule } from './query/query.module';
import { LogModule } from './log/log.module';

const entities = [`${__dirname}/entities/**{.ts,.js}`];
const entitiesPg = [`${__dirname}/redash/entities/**{.ts,.js}`];
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities,
      synchronize: false,
      ...mysqlConfig
    }),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination(req, cb) {
          const { fileType, pageId } = req.body;
          const filePath = `${pageStaticPath}/${pageId}`;
          fs.ensureDirSync(filePath);
          console.log('111');
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          const { saveKey } = req.body;
          console.log('222', file);
          const { originalname } = file;
          const time = moment().valueOf();
          const filename = `${time}_${saveKey}_${originalname}`;
          return cb(null, filename);
        },
      }),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    EventsModule,
    UserModule,
    PageCompModule,
    PageModule,
    CompModule,
    ThemeModule,
    PluginModule,
    PluginTagModule,
    ApiHostModule,
    TagModule,
    ReplaceModule,
    StartTempModule,
    CustomFuncModule,
    LoadingModule,
    AuthModule,
    // RedashModule,
    QueryModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [InitService]
})
export class AppModule { }
