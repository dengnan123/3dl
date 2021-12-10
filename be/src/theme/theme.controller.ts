import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Query,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpService,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
  constructor(public service: ThemeService) {}

  // 新增
  @Post()
  async addOrUpdate(@Body() dto: any) {
    // 新增
    const addDto = {
      ...dto,
      status: 0,
    };
    return await this.service.add(addDto);
  }

  // 获取大屏所有组件列表
  @Get()
  async getAll(@Param() dto: any, @Query() query: any) {
    const condition = {
      where: {
        // pageId: dto.pageId,
        status: 0, // 0 代表没删除
      },
    };
    const queryData = await this.service.getAllInfo(condition);
    if (!queryData) {
      throw new HttpException('获取组件信息失败5', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }

  @Patch()
  async update(@Body() dto: any) {
    return await this.service.updateInfo(dto);
  }

  @Patch('delete')
  async delInfo(@Body() dto: any) {
    const deleteInfo = {
      ...dto,
      status: 1, // 0 代表没删除
    };
    return await this.service.updateInfo(deleteInfo);
  }

  // theme config 设置
  // 新增
  @Post('config')
  async addOrUpdateThemeConfig(@Body() dto: any) {
    // 新增
    const addDto = {
      ...dto,
      status: 0,
    };
    return await this.service.addThemeConfig(addDto);
  }

  @Get('config')
  async getAllThemeConfig(@Param() dto: any, @Query() query: any) {
    const condition = {
      where: {
        // pageId: dto.pageId,
        ...query,
        status: 0, // 0 代表没删除
      },
    };
    const queryData = await this.service.getThemeConfigAllInfo(condition);
    if (!queryData) {
      throw new HttpException('获取组件信息失败5', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }

  @Patch('config')
  async updateThemeConfig(@Body() dto: any) {
    return await this.service.updateThemeConfigInfo(dto);
  }

  @Patch('config/delete')
  async delInfoThemeConfig(@Body() dto: any) {
    const deleteInfo = {
      ...dto,
      status: 1, // 0 代表没删除
    };
    return await this.service.updateThemeConfigInfo(deleteInfo);
  }
}
