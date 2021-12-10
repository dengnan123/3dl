import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiHostService } from './apiHost.service';
import { EnvService } from './env.service';
import { ApiHostController } from './apiHost.controller';
import { ApiHost } from '../entities/ApiHost';
import { Env } from '../entities/Env';
import { PageModule } from '../page/page.module';


@Module({
  providers: [ApiHostService, EnvService],
  controllers: [ApiHostController],
  imports: [
    TypeOrmModule.forFeature([ApiHost, Env]),
    forwardRef(() => PageModule),
    HttpModule.register({
      timeout: 40000,
    }),
  ],
  exports: [ApiHostService, EnvService],
})
export class ApiHostModule { }
