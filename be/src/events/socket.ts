import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'ws';
import { PageService } from '../page/page.service';
import { PageCompService } from '../page-comp/page-comp.service';
import { HttpException, HttpStatus, Res } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
import * as shell from 'shelljs';
import { writeJson } from '../utils/json';

@WebSocketGateway(8088)
export class EventsGateway {
  constructor(
    public service: PageService,
    public pageCompService: PageCompService, // public Service: PageCompService,
  ) {}

  @SubscribeMessage('events')
  async onEvent(
    @MessageBody() socketData: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('socket 打包');

    const { pageId } = socketData;
    const condition = {
      where: {
        pageId,
        status: 0,
      },
    };

    let filePath = path.resolve(__dirname, '../../../build');
    fs.ensureDirSync(filePath);
    filePath = `${filePath}/${pageId}`;
    fs.removeSync(filePath);
    fs.ensureDirSync(filePath);

    // 拿到页面组件静态数据
    const queryData = await this.pageCompService.getAllInfo(condition);
    if (!queryData) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 组件数据处理
    const compList = await this.pageCompService.dealWithAllData(queryData);
    // 拿到页面的静态数据
    const queryPageData = await this.service.getInfo({
      id: pageId,
    });
    if (!queryPageData) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 拿到大屏数据源数据
    const dataSourceList = await this.service.findAllDataSourceConfigByPageId({
      where: {
        pageId,
      },
    });
    if (!dataSourceList) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }

    const webpackBuild = () => {
      return new Promise((resolve, reject) => {
        const buildData = {
          pageId,
          queryData,
          filePath,
        };
        const strData = JSON.stringify(buildData);
        const buildFilePath = path.resolve(
          __dirname,
          '../../shells/webpackBuild.js',
        );
        const p = child_process.fork(buildFilePath, [strData]);
        p.on('exit', code => {
          console.log('code-------', code);
          if (code === 0) {
            resolve();
          } else {
            reject('webpackBuild error');
          }
        });
      });
    };
    const writeJSON = async () => {
      const newFilePath = `${filePath}/df-visual-big-screen-building-system/df-visual-big-screen-building-system`;
      const fileArr: any = [
        {
          data: compList,
          filePath: newFilePath,
          fileName: 'pageComp.json',
        },
        {
          data: queryPageData,
          filePath: newFilePath,
          fileName: 'page.json',
        },
        {
          data: dataSourceList,
          filePath: newFilePath,
          fileName: 'dataSource.json',
        },
      ];
      const promiseArr = fileArr.map(async v => {
        return await writeJson({
          data: v.data,
          filePath: v.filePath,
          fileName: v.fileName,
        });
      });
      await Promise.all(promiseArr);
    };
    await webpackBuild();
    await writeJSON();
    const zipShellPath = path.resolve(
      __dirname,
      `../../shells/zip.sh ${filePath}/df-visual-big-screen-building-system`,
    );
    await shell.exec(zipShellPath);
    console.log('压缩OK');
    return {};
  }
}
