import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { Plugin } from '../entities/Plugin';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pluginPath } from '../utils/file';
import * as moment from 'dayjs';
import * as fs from 'fs-extra';

@Module({
  providers: [PluginService],
  controllers: [PluginController],
  imports: [
    TypeOrmModule.forFeature([Plugin]),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, cb) {
          fs.ensureDirSync(pluginPath);
          cb(null, pluginPath);
        },
        filename(req, file, cb) {
          const { originalname } = file;
          const nowTime = moment().valueOf();
          const newName = `${nowTime}_${originalname}`;
          cb(null, newName);
        },
      }),
    }),
  ],
  exports: [PluginService],
})
export class PluginModule {}
