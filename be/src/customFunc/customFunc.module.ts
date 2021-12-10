import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFuncService } from './customFunc.service';
import { CustomFuncController } from './customFunc.controller';
import { CustomFunc } from '../entities/CustomFunc';
import { PageCustomFunc } from '../entities/PageCustomFunc';
import { PageCustomService } from './pageCustom.service'

@Module({
  providers: [CustomFuncService, PageCustomService],
  controllers: [CustomFuncController],
  imports: [TypeOrmModule.forFeature([CustomFunc, PageCustomFunc])],
  exports: [PageCustomService,PageCustomService]
})
export class CustomFuncModule { }
