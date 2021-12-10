import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpService,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import * as https from 'https';
import { readJson, resolveFromRoot, objectString, getCmdPath } from './utils/json';
import { isObject } from 'lodash';
import * as Agent from 'agentkeepalive';
import { getHostByUrl, getHeaderData, dealWithProxyUrl } from './utils/str';
import * as  jsonfile from 'jsonfile'
import { LOCAL_API_HOST } from './config'
const { HttpsAgent } = Agent;

@Controller()
export class AppController {
  constructor(public httpService: HttpService) { }


  @Get('page/dataSource/all')
  async getAllDataSourceByPageIdOrTagId(@Query() dto: any) {
    const { pageId } = dto;
    const dataSoureceKey = `${pageId}-dataSource.json`;
    return readJson(dataSoureceKey, []);
  }

  // 获取env信息
  @Get('apiHost/env')
  async getEnvlist(@Query() dto: any) {
    const { tagId } = dto;
    const dataSoureceKey = `env.json`;
    return readJson(dataSoureceKey, []);
  }

  // 获取apiHost信息
  @Get('apiHost')
  async getApiHostList(@Query() dto: any) {
    const { tagId } = dto;
    const dataSoureceKey = `apiHost.json`;
    return readJson(dataSoureceKey, []);
  }

  // // API 转发
  // @Post('page-comp/apiProxy')
  // async apiProxy(@Body() dto: any, @Res() res, @Req() req): Promise<any> {
  //   const { dataApiUrl, condition = {}, methodType, cusHeaders } = dto;
  //   const host = getHostByUrl(dataApiUrl);
  //   const headerData = getHeaderData({
  //     host, req, cusHeaders
  //   });
  //   let resData
  //   if (methodType === 'POST' || methodType === 'PATCH') {
  //     resData = await this.httpService
  //       .post(dataApiUrl, condition, {
  //         headers: headerData,
  //       })
  //       .toPromise()
  //   }
  //   else {
  //     const proxyUrl = dealWithProxyUrl({
  //       condition, dataApiUrl
  //     })
  //     resData = await this.httpService
  //       .get(proxyUrl, {
  //         headers: headerData,
  //         params: {},
  //       })
  //       .toPromise();
  //   }
  //   const { data }: any = resData;
  //   if (data) {
  //     // 一般公司内部的接口返回值都有data
  //     res.send(data);
  //     return;
  //   }
  //   // 外部接口可能没有data，就整个返回
  //   res.send(resData);
  // }


  // API 转发
  @Post('page-comp/apiProxy')
  async apiProxy(@Body() dto: any, @Res() res, @Req() req): Promise<any> {
    const { dataApiUrl, condition = {}, methodType, cusHeaders } = dto;
    const getResData = async () => {
      if (methodType === 'linkDatabase') {
        return this.httpService
          .post(`${LOCAL_API_HOST}/query/apiProxy`, condition)
          .toPromise()
      }
      const host = getHostByUrl(dataApiUrl);
      const headerData = getHeaderData({
        host, req, cusHeaders
      });
      if (methodType === 'POST' || methodType === 'PATCH') {
        return await this.httpService
          .post(dataApiUrl, condition, {
            headers: headerData,
          })
          .toPromise()
      }
      const proxyUrl = dealWithProxyUrl({
        condition, dataApiUrl
      })
      console.log('get--------proxyUrl', proxyUrl)
      return await this.httpService
        .get(proxyUrl, {
          headers: headerData,
          params: {},
        })
        .toPromise();
    }
    const resData = await getResData()
    const { data }: any = resData;
    if (data) {
      // 一般公司内部的接口返回值都有data
      res.send(data);
      return;
    }
    // 外部接口可能没有data，就整个返回
    res.send(resData);
  }

  // 获取大屏静态JSON
  @Get('page-comp/:pageId')
  getHello(@Param() dto: any): string {
    const { pageId } = dto;
    const pageCompkey = `${pageId}-pageComp.json`;
    return readJson(pageCompkey, []);
  }

  // 获取大屏信息
  @Get('page/:pageId')
  async getInfo(@Param() dto: any) {
    const { pageId } = dto;
    const pageKey = `${pageId}-page.json`;
    return readJson(pageKey);
  }
  // 获取大屏信息
  @Get('check')
  async getBuildTime(@Param() dto: any) {
    const cmdPath = getCmdPath()
    const jsonPath = `${cmdPath}/package.json`
    console.log('cmd__path', jsonPath)
    const data = jsonfile.readFileSync(jsonPath)
    return {
      dpBuildTime: data.dpBuildTime
    }
  }
}
