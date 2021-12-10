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

import { StartTempService as Service } from './startTemp.service';

@Controller('startTemp')
export class StartTempController {
  constructor(public service: Service) {}

  @Get(':id')
  async findOneById(@Param() dto: any) {
    const { id } = dto;
    const res = await this.service.findOneById(id);
    return res;
  }

  @Get()
  async findList(@Query() dto: any) {
    const res = await this.service.findList({
      where: {
        status: {
          type: 'andWhere',
        },
      },
      params: {
        status: 1,
      },
    });
    return res;
  }

  @Post()
  async add(@Body() dto: any) {
    await this.service.add(dto);
    return {};
  }

  @Patch()
  async update(@Body() dto: any) {
    await this.service.update(dto);
    return {};
  }
}
