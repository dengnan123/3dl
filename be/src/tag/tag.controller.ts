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
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

import { TagService as Service } from "./tag.service";

@Controller("tag")
export class TagController {
  constructor(public service: Service, private authService: AuthService) {}

  @Get()
  async findList(@Query() dto: any, @Req() req) {
    const { authorization } = req.headers;

    const tagIdList = await this.authService.getUserTagIdListByToken(
      authorization
    );
    const isAdmin = this.authService.getIsAdmin(authorization);
    const res = await this.service.findList({
      ...dto,
      tagIdList,
      isAdmin,
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

  /**
   * 查找项目内使用的所有组件
   * @param {object} query
   * @param {number} query.tagId 项目 id
   * @returns
   */
  @Get("comp-list")
  async findCompList(@Query() query: any) {
    return await this.service.findCompList(query);
  }

  @Get(":id")
  async findOneById(@Param() dto: any) {
    const { id } = dto;
    const res = await this.service.findOneById(id);
    return res;
  }
}
