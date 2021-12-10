import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CompService } from './comp.service';

@Controller('comp')
export class CompController {
  constructor(public service: CompService) {}

  // 新增组件
  @Post()
  async batchAdd(@Body() dto: any) {
    const queryData = await this.service.getInfo({
      name: dto.compName,
    });
    if (queryData) {
      throw new HttpException('组件存在', HttpStatus.FORBIDDEN);
    }

    // const list = [
    //   'Test1',
    //   'Test2',
    //   'Test3',
    //   'Test4',
    //   'Test5',
    //   'Test6',
    //   'Map',
    //   'First',
    //   'Second',
    //   'Four',
    // ];

    // const newArr = list.map(v => {
    //   return {
    //     name: v,
    //     width: 300,
    //     height: 300,
    //     z_index: 0,
    //     left: 200,
    //     right: 200,
    //     description: '',
    //   };
    // });
    await this.service.batchAdd([dto]);
    return {};
  }

  // 获取组件信息
  @Get(':compId')
  async getInfo(@Param() dto: any) {
    const queryData = await this.service.getInfo({
      id: dto.compId,
    });
    if (!queryData) {
      throw new HttpException('获取组件信息失败1', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }

  // 获取所有组件列表
  @Get()
  async getAll(@Param() dto: any) {
    const queryData = await this.service.getAllInfo({});
    if (!queryData) {
      throw new HttpException('获取组件信息失败2', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }
}
