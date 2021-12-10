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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import * as uuid from 'uuid';
import * as moment from 'dayjs';
import { PluginService as Service } from './plugin.service';
import { getDataByToken } from "../utils/token"

@Controller('plugin')
export class PluginController {
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
  async update(@Body() dto: any, @Req() req) {
    const { pluginTagId, status } = dto
    const { headers: { authorization } } = req
    const {
      payload: { isAdmin },
    } = getDataByToken(authorization)
    if (pluginTagId && !isAdmin) {
      throw new Error('no access')
    }
    if (status === 0 && !isAdmin) {
      throw new Error('no access')
    }
    await this.service.update(dto);
    return {};
  }

  // 上传组件图片
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadedFile(@UploadedFile() file, @Body() dto: any) {
    const { filename } = file;
    const { id } = dto;
    // 把 filename 保存到数据库里面
    return await this.service.update({
      id: parseInt(id, 10),
      pluginImageSrc: filename,
    });
  }


}
