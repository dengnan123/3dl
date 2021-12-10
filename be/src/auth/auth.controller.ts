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
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {

  constructor(public authService: AuthService) {

  }
  // 用户能看到的page 和 tag
  @Get('data')
  async getAll(@Query() dto: any, @Req() req) {
    const { authorization } = req.headers
    const pageAndTagData = await this.authService.getUserPageIdListAndTagIdList(authorization)
    const userData = await this.authService.getUserInfo(authorization)
    const isAdmin = this.authService.getIsAdmin(authorization)
    const feature = await this.authService.getUserFeatures(authorization)
    const { onlyRead }: any = await this.authService.getDataByToken(authorization)
    return {
      ...pageAndTagData,
      ...userData,
      isAdmin,
      feature,
      onlyRead
    }
  }
}