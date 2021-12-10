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
import * as child_process from 'child_process';
import { deleteFilePath, makeFilePath } from '../utils/file';
import * as sketch2json from 'sketch2json';
import * as base64Img from 'base64-img';
import { rgbToHex } from '../utils/colorParse';
import { compNameList, nameMapHash } from '../utils/screen';
import { merge, isArray } from 'lodash';
import * as request from 'request';

import { getManager } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { v4 as uuid } from 'uuid';
import { PageService } from './page.service';
import { PageCompService } from '../page-comp/page-comp.service';
import { ThemeService } from '../theme/theme.service';
import { Page } from '../entities/Page';
import { PageComp } from '../entities/PageComp';
import { ApiHostService } from '../apiHost/apiHost.service';
import { EnvService } from '../apiHost/env.service';
import { PageCustomService } from '../customFunc/pageCustom.service';
import { readJson, readTempAndWriteData } from '../utils/json';
import { addDefJs } from './util'
import * as compressing from 'compressing';
import * as moment from 'dayjs';
import { UserService } from '../user/user.service'
import { AuthService } from '../auth/auth.service'
import { CompDataSourceService } from '../page-comp/compDataSource.service'
import { PageCpService } from './pageCp.service'

@Controller('page')
export class PageController {
  constructor(
    public service: PageService,
    public pageCompService: PageCompService,
    public httpService: HttpService,
    public themeService: ThemeService,
    public apiHostService: ApiHostService,
    public envService: EnvService,
    public pageCustomService: PageCustomService,
    public userService: UserService,
    private authService: AuthService,
    private compDataSourceService: CompDataSourceService,
    private pageCpService: PageCpService,
  ) { }





  // 新增大屏
  @Post()
  async batchAdd(@Body() dto: any) {
    const queryData = await this.service.getInfo({
      name: dto.name,
      status: 0
    });
    if (queryData) {
      throw new HttpException('页面已存在', HttpStatus.FORBIDDEN);
    }

    return await this.service.add(dto);
  }


  // 获取所有大屏列表
  @Get()
  async getAll(@Query() dto: any, @Req() req) {
    const { authorization } = req.headers
    const pageIdList = await this.authService.getUserPageIdListByToken(authorization)
    const isAdmin = this.authService.getIsAdmin(authorization)
    const queryData = await this.service.getPageList({
      ...dto,
      pageIdList,
      isAdmin
    });
    if (!queryData) {
      throw new HttpException('获取组件信息失败4', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }

  @Patch()
  async updateInfo(@Body() dto: any) {
    const res = await this.service.updateInfo({
      ...dto,
      id: parseInt(dto.id, 10),
    });
    if (!res) {
      throw new HttpException('更新信息失败', HttpStatus.FORBIDDEN);
    }
    return res;
  }

  // 复制大屏到别的用户下面
  @Post('template')
  async useTemplate(@Body() dto: any) {
    const queryData = await this.service.getInfo({
      name: dto.name,
      status: 0
    });
    if (queryData) {
      throw new HttpException('页面名字已存在', HttpStatus.FORBIDDEN);
    }
    const resData = await this.pageCpService.pageCp(dto)
    await this.pageCpService.compCp(resData)
    this.pageCpService.fileCp(resData)
    return {
      tagId: resData.newTagId,
      id: resData.newPageId
    }
  }

  // 给大屏上传背景图
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadedFile(@UploadedFile() file, @Body() dto: any) {
    // 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
    const { filename, path, destination } = file;
    console.log('filefile', file);
    console.log('filenamefilename', filename);
    const { id, saveKey } = dto;
    console.log('saveKeysaveKeysaveKey', saveKey);
    // const source = tinify.fromFile(path);
    // source.toFile(`${destination}/optimized.jpg`);
    // 把 filename 保存到数据库里面
    return await this.service.updateInfo({
      id: parseInt(id, 10),
      [saveKey]: filename,
    });
  }

  // 生成大屏json数据源
  @Post('generate/:pageId')
  async generateJsonData(@Param() dto: any) {
    const condition = {
      where: {
        pageId: dto.pageId,
        status: 0,
      },
    };
    const queryData = await this.pageCompService.getAllInfo(condition);
    if (!queryData) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 把数据变成JSON
    // writeJson(queryData, `${dto.pageId}.json`);
    return {};
  }

  // 获取大屏数据源
  @Get('json/:pageId')
  async getJsonData(@Param() dto: any) {
    const fileName = `${dto.pageId}.json`;
    return readJson(fileName);
  }

  @Post('dataSource')
  async addDataSource(@Body() dto: any, @Req() req) {
    const { tagid } = req.headers
    const tagId = dto.tagId || tagid
    const info = await this.service.findDataSourceByCond({
      where: {
        dataSourceName: dto.dataSourceName,
        status: 1,
        tagId: parseInt(tagId)
      }
    })
    if (info) {
      throw new Error('api名字不能重复')
    }
    const data = {
      ...dto,
      id: uuid(),
    };
    return this.service.addDataSourceConfig(data);
  }

  @Patch('dataSource')
  async updateDataSource(@Body() dto: any) {
    return this.service.updateDataSourceConfig(dto);
  }

  @Get('dataSource/all')
  async getAllDataSourceByPageIdOrTagId(@Query() dto: any) {
    return await this.service.getAllDataSource(dto)
  }

  @Get('dataSource/:pageId')
  async getAllDataSourceByPageId(@Param() dto: any) {
    const arr = await this.service.findAllDataSourceConfigByPageId({
      where: {
        pageId: dto.pageId,
        status: 1,
        tagId: null,
      },
    });
    return arr;
  }

  @Get('dataSource/tag/:tagId')
  async getAllDataSourceByTagId(@Param() dto: any) {
    console.log('dtodtodto', dto);
    const arr = await this.service.findAllDataSourceConfigByPageId({
      where: {
        tagId: dto.tagId,
        status: 1,
      },
    });
    return arr;
  }

  @Patch('dataSource/delete')
  async delDataSourceById(@Body() dto: any) {
    /**
     * 如果api 在项目中已被使用 禁止删除
     */
    const { id, tagId } = dto;
    const list = await this.compDataSourceService.getListByCond({
      dataSourceId: id,
      tagId
    })
    if (list.length) {
      throw new Error('接口已经被组件关联，不能删除！');
    }
    return this.service.updateDataSourceConfig({
      ...dto,
      status: 0,
    });
  }

  // 解析sketch文件，获取json
  @Post('upload/sketch')
  @UseInterceptors(FileInterceptor('file'))
  async UploadedSketchFile(@UploadedFile() file, @Body() dto: any) {
    const { destination, filename } = file;
    const { id: pageId, left: pLeft, top: pTop } = dto;
    const types = compNameList();
    // const nameMapHash = {
    //   Svg: 'CustomizeSvg',
    // };
    const getLeftAndTop = (hash: { [x: string]: {} }, id: string | number) => {
      const { pid, x, y }: any = hash[id] || {};
      if (!pid) {
        return {
          left: x || 0,
          top: y || 0,
        };
      }
      if (pid) {
        const { left, top } = getLeftAndTop(hash, pid);
        return {
          left: x + left,
          top: y + top,
        };
      }
    };

    const getflatLayersArr = (inputlayers: any) => {
      const arr = [];
      const hash = {};
      const dp = (list: any, pid: string) => {
        for (const item of list) {
          const { layers: _, frame, name, do_objectID } = item;
          hash[item.do_objectID] = {
            pid,
            ...frame,
            name,
          };

          let newName = name;
          const initData = {
            ...frame,
            do_objectID,
            name: newName,
          };
          const nameArr = name.split('/');
          if (nameArr.length === 2) {
            newName = nameArr[0];
            initData.name = newName;
            initData.themeIndexId = nameArr[1];
          }

          if (types.includes(newName)) {
            arr.push(initData);
          }
          // if (nameMapHash[newName]) {
          //   arr.push({
          //     ...frame,
          //     do_objectID,
          //     name: nameMapHash[newName],
          //   });
          // }

          if (newName === 'Text' && item.attributedString) {
            const { alpha = 1, blue, green, red } =
              item.style.textStyle.encodedAttributes
                .MSAttributedStringColorAttribute || {};
            const color = rgbToHex(red, green, blue, alpha);

            const style = {
              text: item.attributedString.string,
              color,
              fontSize:
                item.style.textStyle.encodedAttributes
                  .MSAttributedStringFontAttribute.attributes.size,
            };

            arr.push({
              ...initData,
              style,
            });
          }
          // 如果父元素是Svg的话 子元素就不要解析了
          if (_ && _.length && newName !== 'Svg') {
            dp(_, item.do_objectID);
          }
        }
      };
      dp(inputlayers, '');
      return {
        flatLayersArr: arr,
        layerHash: hash,
      };
    };
    const data = await fs.readFile(`${destination}/${filename}`);
    const sketchJson = await sketch2json(data);
    const sketchPageId = Object.keys(sketchJson.pages)[0];
    const layers = sketchJson.pages[sketchPageId].layers[0].layers || [];
    const { flatLayersArr, layerHash } = getflatLayersArr(layers);

    const promiseArr = flatLayersArr
      .filter((v) => {
        const { themeIndexId } = v;
        if (themeIndexId) {
          return true;
        }
        return false;
      })
      .map(async (v) => {
        const { themeIndexId } = v;
        const {
          style,
          mockData,
        } = await this.themeService.findOneByParamsThemeConfig({
          where: {
            indexId: themeIndexId,
          },
        });

        return {
          ...v,
          style,
          mockData,
        };
      });
    const themeConfigList = await Promise.all(promiseArr);

    const batchAddData = flatLayersArr.map((v) => {
      const { name, style } = v;
      const { left, top } = getLeftAndTop(layerHash, v.do_objectID);
      const itemData = {
        ...v,
        left: left - pLeft,
        top: top - pTop,
        pageId,
        style: style || {},
        basicStyle: {},
        mockData: {},
        compName: name,
      };
      if (itemData.name === 'CustomizeCard') {
        itemData.zIndex = 1; // 卡片的默认zindex低一点
      } else {
        itemData.zIndex = 2;
      }
      for (const item of themeConfigList) {
        const { do_objectID } = item;
        if (do_objectID === v.do_objectID) {
          // itemData.style = item.style || {};
          itemData.style = merge({}, item.style, itemData.style);
          itemData.mockData = item.mockData || {};
        }
      }
      return itemData;
    });

    await this.pageCompService.batchAdd(batchAddData);
    return {};
  }

  /**
   * 删除大屏
   */
  @Patch('delete')
  async delPage(@Body() dto: any) {
    const res = await this.service.updateInfo({
      id: parseInt(dto.id, 10),
      status: 1,
    });
    if (!res) {
      throw new HttpException('删除失败', HttpStatus.FORBIDDEN);
    }
    return res;
  }



  /**
   * 项目默认页面设置
   */
  @Patch('default')
  async setDefault(@Body() dto: any) {
    const condition = {
      tagId: dto.tagId,
      status: 0,
    };
    const queryData = await this.service.getAllInfo(condition);
    let updateArr = [];
    if (queryData?.length) {
      updateArr = queryData.map(v => {
        const { id } = v;
        if (id === dto.id) {
          return {
            id: dto.id,
            isDefault: 1,
          };
        }
        return {
          id,
          isDefault: 0,
        };
      });
    }
    const promissArr = updateArr.map(async v => {
      await this.service.updateInfo({
        ...v,
        id: parseInt(v.id, 10),
      });
    });
    await Promise.all(promissArr);
    return {};
  }


  // 获取大屏的pageWrapList
  @Get('pageWrap')
  async getPageWrapList(@Query() dto: any) {
    return this.pageCompService.getAllPageWrap(dto);
  }

  /**
   * 大屏聚合接口，获取页面所需的静态信息
   */
  @Get('aggregate')
  async getAggregateData(@Query() data: any) {
    console.log('aggregate-----datadatadata', data)
    const pageId = data?.pageId

    const getPageConfig = async () => {
      return await this.service.getInfo({
        id: pageId,
      });
    }
    const pageConfig = await getPageConfig()
    const { tagId } = pageConfig
    const dto = {
      pageId,
      tagId,
    }
    const getInitUseCompList = async () => {
      return this.pageCompService.getAllInfoIncludesPageWrap(dto);
    }

    const getDataSourceList = async () => {
      return await this.service.getAllDataSource({
        ...dto,
        isPreview: true
      })
    }
    const getApiHostList = async () => {
      return await this.apiHostService.findApiList(dto)
    }
    const getEnvList = async () => {
      return await this.envService.findEnvList(dto)
    }
    const getCustomFunc = async () => {
      return await this.pageCustomService.getListByOrCondition(dto)
    }
    const getPageWrapData = async () => {
      return this.pageCompService.getAllPageWrap(dto);
    }

    const res = await Promise.all([getInitUseCompList(), getDataSourceList(),
    getApiHostList(), getEnvList(), getCustomFunc(), getPageWrapData()])
    // 如果pageWrapData 里面有值，代表有内链的大屏页面，需要获取下 每个大屏页面的  dataSource 和 customFunc 然后和主页面合并 最后ID 去重
    const initUseCompList = res[0]
    let dataSourceList = res[1]
    const apiHostList = res[2]
    const envList = res[3]
    let customFuncList = res[4]
    const pageWrapData = res[5]
    if (pageWrapData && JSON.stringify(pageWrapData) !== '{}') {
      const list = this.service.getPageWrapList(pageWrapData)
      const mapArr = list.filter(v => v.style?.pageId).map(async v => {
        const { style: { pageId } } = v
        const dataSourceList = await this.service.getAllDataSource({
          pageId,
          tagId
        })
        const customFuncList = await this.pageCustomService.getListByOrCondition(dto)
        return {
          dataSourceList,
          customFuncList
        }
      })
      const newRes: any = await Promise.all(mapArr)
      const newData = this.service.dealwithDataAndFunc({
        pageWrapArr: newRes, dataSourceList, customFuncList
      })
      dataSourceList = newData.dataSourceList
      customFuncList = newData.customFuncList
    }

    return {
      initUseCompList,
      pageConfig,
      dataSourceList,
      apiHostList,
      envList,
      customFuncList,
      pageWrapData
    }
  }


  /**
   * 
   * @param dto 
   * @returns 
   */
  @Get('database')
  async getQueryAndDatabseByTagId(@Query() dto: any) {
    const { tagId } = dto
    console.log('tagIdtagId-----', tagId)
    if (!tagId) {
      throw new Error('tagId must array')
    }
    const data = await this.service.getAllDataSource(dto)
    return await this.service.getQueryAndDatabse(data)
  }


  // 获取大屏信息
  @Get(':pageId')
  async getInfo(@Param() dto: any) {
    const queryData = await this.service.getInfo({
      id: dto.pageId,
    });
    if (!queryData) {
      throw new HttpException('获取组件信息失败3', HttpStatus.FORBIDDEN);
    }
    return queryData;
  }


}
