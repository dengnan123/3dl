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

import { LoadingService as Service } from './loading.service';

@Controller('loading')
export class LoadingController {
  constructor(public service: Service) { }


  @Get(':id')
  async findOneById(@Param() dto: any) {
    const { id } = dto;
    const res = await this.service.findOneById(id);
    return res;
  }

  @Get()
  async findList(@Query() dto: any) {
    const res = await this.service.findList(dto);
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

  @Patch('delete')
  async del(@Body() dto: any) {
    await this.service.update(dto);
    return {};
  }
}
