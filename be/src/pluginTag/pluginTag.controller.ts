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
import { PluginService } from '../plugin/plugin.service';
import { PluginTagService as Service } from './pluginTag.service';

@Controller('pluginTag')
export class PluginTagController {
  constructor(public service: Service, public pluginService: PluginService) { }



  @Get()
  async findList(@Query() dto: any) {
    return await this.service.findList(dto);
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
  async delete(@Body() dto: any) {
    const { list } = await this.pluginService.findList(dto);
    if (list.length) {
      throw new Error('该分类下面有组件不能删除');
    }
    await this.service.update({
      id: parseInt(dto.id, 10),
      status: 0,
    });
    return {};
  }

  /**
   * 获取所有插件分类和分类下面的插件列表
   */
  @Get('menu')
  async getMenu(@Query() dto: any) {
    const { list } = await this.service.findList(dto);
    const promiseArr = list.map(async (v) => {
      const { list } = await this.pluginService.findList({
        pluginTagId: v.id,
        ...dto,
      });
      return {
        id: v.id,
        key: v.id,
        label: v.name,
        zIndex: v.zIndex,
        child: list.map((v) => {
          return {
            ...v,
            label: v.pluginName,
            compName: v.pluginKey,
          };
        }),
      };
    });
    const res: any = await Promise.all(promiseArr);
    return res.sort((a, b) => {
      return b.zIndex - a.zIndex
    });
  }
}
