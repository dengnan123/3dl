import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpService,
  Param,
  Req,
} from '@nestjs/common';

import { readJson, resolveFromRoot } from './utils/json';

@Controller()
export class AppController {
  constructor(public httpService: HttpService) {}

  // 获取大屏静态JSON
  @Get('page-comp/:pageId')
  getHello(@Param() dto: any): string {
    const { pageId } = dto;
    const pageCompkey = `${pageId}-pageComp.json`;
    return readJson(pageCompkey);
  }

  // 获取大屏信息
  @Get('page/:pageId')
  async getInfo(@Param() dto: any) {
    const { pageId } = dto;
    const pageKey = `${pageId}-page.json`;
    return readJson(pageKey);
  }

  // 获取数据源信息
  @Get('page/dataSource/:pageId')
  async getDataSourceInfo(@Param() dto: any) {
    const { pageId } = dto;
    const dataSoureceKey = `${pageId}-dataSource.json`;
    return readJson(dataSoureceKey);
  }

  // 转发接口
  // API 转发
  @Post('page-comp/apiProxy')
  async apiProxy(@Body() dto: any, @Res() res, @Req() req): Promise<any> {
    const { dataApiUrl, condition, methodType } = dto;
    const { headers } = req;

    const headerData: any = {
      ...headers,
      host: 'iwms.cloud.cmbchina.com',
    };
    if (condition.Authorization) {
      headerData.Authorization = condition.Authorization;
    }
    if (methodType === 'POST') {
      const { data, errorCode }: any = await this.httpService
        .post(dataApiUrl, condition, {
          headers: headerData,
        })
        .toPromise();

      res.send(data);
      return;
    }
    const { data: getData }: any = await this.httpService
      .get(dataApiUrl, {
        headers: headerData,
        params: condition,
      })
      .toPromise();
    // console.log()
    res.send(getData);
    return;
  }
}
