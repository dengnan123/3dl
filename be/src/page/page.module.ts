import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { PageService } from './page.service';
import { ThemeModule } from '../theme/theme.module';
import { ThemeService } from '../theme/theme.service';
import { PageController } from './page.controller';
import { Page } from '../entities/Page';
import { PageComp } from '../entities/PageComp';
import { DataSourceConfig } from '../entities/DataSourceConfig';
import { ApiHost } from '../entities/ApiHost';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PageCompModule } from '../page-comp/page-comp.module';
import { diskStorage } from 'multer';
import { basePath, pageStaticPath } from '../utils/file';
import * as path from 'path';
import * as moment from 'dayjs';
import * as fs from 'fs-extra';
import { ApiHostModule } from '../apiHost/apiHost.module';
import { CustomFuncModule } from '../customFunc/customFunc.module'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { PageCpService } from './pageCp.service'
@Module({
  providers: [PageService, PageCpService],
  controllers: [PageController],
  imports: [
    TypeOrmModule.forFeature([Page, DataSourceConfig, ApiHost,PageComp]),
    forwardRef(() => PageCompModule),
    forwardRef(() => ApiHostModule),
    forwardRef(() => CustomFuncModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    forwardRef(() => ThemeModule),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination(req, file, cb) {
          const { fileType, id: pageId } = req.body;
          let filePath = basePath;
          if (pageId) {
            filePath = `${pageStaticPath}/${pageId}`;
            // 检查路径 没有的话就创建一个路径
            fs.ensureDirSync(filePath);
          }
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          // 在此处自定义保存后的文件名称
          const { originalname } = file;
          console.log('filefile', file);
          const { saveKey } = req.body;
          const time = moment().valueOf();
          const filename = `${time}_${saveKey}.png`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  exports: [PageService, PageCpService],
})
export class PageModule { }
