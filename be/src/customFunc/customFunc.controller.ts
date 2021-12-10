import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  HttpService,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';

import { CustomFuncService as Service } from './customFunc.service';
import { PageCustomService } from './pageCustom.service'
@Controller('customFunc')
export class CustomFuncController {
  constructor(public service: Service, public pageCustomService: PageCustomService) { }
  @Get()
  async findList(@Query() dto: any) {
    const data = {
      ...dto
    }
    if (data.pageId) {
      data.pageId = parseInt(data.pageId)
    }
    if (data.tagId) {
      data.tagId = parseInt(data.tagId)
    }
    const res = await this.pageCustomService.getListByCondition(data);
    return res;
  }

  @Get('all')
  async findAllList(@Query() dto: any) {
    return await this.pageCustomService.getListByOrCondition(dto);
  }

  @Post()
  async add(@Body() dto: any) {
    const addData = {
      ...dto,
      status: 1
    }
    const findData = await this.service.findOne({
      where: {
        enName: dto.enName
      }
    });
    if (findData) {
      const { id } = findData
      const res = await this.pageCustomService.findOne({
        where: {
          tagId: parseInt(dto.tagId),
          funcId: id
        }
      });
      if (res) {
        throw new Error(`${dto.enName}函数名已存在！！！`)
      }
    }

    const resData = await this.service.add(addData);
    const pageCusData = {
      ...addData,
      funcId: resData.id
    }
    await this.pageCustomService.add(pageCusData);
    return {};
  }

  @Patch()
  async update(@Body() dto: any) {
    if (dto.enName) {
      const findData = await this.service.findOne({
        where: {
          enName: dto.enName
        }
      });
      if (findData) {
        throw new Error(`${dto.enName}函数名已存在！！！`)
      }
    }
    await this.service.update(dto);
    return {};
  }

  @Get(':id')
  async findOneById(@Param() dto: any) {
    const { id } = dto;
    const res = await this.service.findOneById(id);
    return res;
  }
}
