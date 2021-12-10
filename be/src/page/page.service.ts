import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { Page } from '../entities/Page';
import { DataSourceConfig } from '../entities/DataSourceConfig';
import { ApiHost } from '../entities/ApiHost';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, getRepository, In } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as shell from 'shelljs';
import { dealWithFindInfo, dealWithUpdateInfo } from './parse';
import { basePath } from '../utils/file';
import { writeJson, readJson, readTempAndWriteData } from '../utils/json';
import { PageCompService } from '../page-comp/page-comp.service';
import { ApiHostService } from '../apiHost/apiHost.service';
import { EnvService } from '../apiHost/env.service';
import * as moment from 'dayjs';
import { isArray } from '../utils/type';
import { getStaticJsName } from './util';
import { uniqBy } from 'lodash'
import { from } from 'rxjs';
import { LOCAL_API_HOST } from '../config'
import { CompDataSourceService } from '../page-comp/compDataSource.service'
@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly photoRepository: Repository<Page>,

    @InjectRepository(DataSourceConfig)
    private readonly dataSourceConfigRepository: Repository<DataSourceConfig>,

    @InjectRepository(ApiHost)
    private readonly ApiHostRepository: Repository<ApiHost>,

    public pageCompService: PageCompService,
    public apiHostService: ApiHostService,
    public envService: EnvService,
    public httpService: HttpService,
    private compDataSourceService: CompDataSourceService
  ) { }

  async getInfo(condition): Promise<any> {
    const queryData: any = await this.photoRepository.findOne(condition);
    if (queryData) {
      return dealWithFindInfo(queryData);
    }
    return null;
  }

  async getAllInfo(condition) {
    const res = await this.photoRepository.find(condition);
    return res;
  }

  async getPageList(condition) {
    const { current = 1, pageSize = 12, layoutType, userId, tagId, keyword, pageIdList, isAdmin } = condition
    const qb: any = getRepository(Page)
      .createQueryBuilder('page')
      .where({
        status: 0,
      });
    if (layoutType && layoutType !== 'custom') {
      qb.andWhere(`layout_type  = "${layoutType}"`);
    }
    if (tagId) {
      qb.andWhere(`tag_id  = "${tagId}"`);
    }
    if (userId) {
      qb.andWhere(`user_id  = "${userId}"`);
    }
    if (keyword) {
      qb.andWhere(`name  like  "%${keyword}%" OR id  = "${keyword}"`);
    }
    if (!isAdmin) {
      qb.andWhere(`id  in  (${pageIdList})`);
    }

    const list = await qb.skip((current - 1) * pageSize).take(pageSize).orderBy('id', 'DESC').getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }

  async getTagPageList(condition) {
    const { current = 1, pageSize = 9999, tagId } = condition
    const qb: any = getRepository(Page)
      .createQueryBuilder('page')
      .where({
        status: 0,
      });
    qb.andWhere(`tag_id  = "${tagId}"`);
    const list = await qb.skip((current - 1) * pageSize).take(pageSize).orderBy('id', 'DESC').getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }

  async updateInfo(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: parseInt(condition.id, 10),
    });
    const updated = dealWithUpdateInfo(toUpdate, condition);
    const time = moment().valueOf();
    const article = await this.photoRepository.save({
      ...updated,
      updateTime: time,
    });
    return article;
  }

  async add(condition) {
    const time = moment().valueOf();
    const newCon = {
      ...condition,
      createTime: time,
      updateTime: time,
    };
    return this.photoRepository.save(newCon);
  }

  async addDataSourceConfig(condition) {
    return this.dataSourceConfigRepository.save(condition);
  }

  async batchAddDataSourceConfig(condition) {
    return this.dataSourceConfigRepository.save(condition);
  }

  async deleteDataSourceConfig(condition) {
    return this.dataSourceConfigRepository.save(condition);
  }

  async updateDataSourceConfig(condition) {
    const toUpdate = await this.dataSourceConfigRepository.findOne({
      id: condition.id,
    });
    const updated = dealWithUpdateInfo(toUpdate, condition);
    const article = await this.dataSourceConfigRepository.save(updated);
    return article;
  }

  async findAllDataSourceConfigByPageId(condition) {
    return this.dataSourceConfigRepository.find(condition);
  }

  async findDataSourceByCond(condition) {
    return this.dataSourceConfigRepository.findOne(condition);
  }


  // 大屏json
  async getPageJsonData({ pageId, envId, condition, tagId, depyType }) {
    // 拿到页面组件静态数据
    const queryData = await this.pageCompService.getAllInfo(condition);
    if (!queryData) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 组件数据处理
    const compList = await this.pageCompService.dealWithPreviewAllData(
      queryData,
    );

    // 拿到页面的静态数据
    const queryPageData = await this.getInfo({
      id: pageId,
    });
    if (!queryPageData) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 拿到大屏所有数据源
    let dataSourceList = await this.findAllDataSourceConfigByPageId({
      where: [
        {
          pageId,
          status: 1,
        },
        {
          tagId,
          status: 1,
        },
      ],
    });
    if (!dataSourceList) {
      throw new HttpException('获取数据失败', HttpStatus.FORBIDDEN);
    }
    // 查出页面组件所有的数据源，然后去重合并 得到页面真正需要的数据源
    const newDataSourceList = await this.dealwithDataSource({
      dataSource: dataSourceList,
      pageId,
    })
    const pageCompkey = `${pageId}-pageComp.js`;
    const pageKey = `${pageId}-page.js`;
    const dataSoureceKey = `${pageId}-dataSource.js`;
    return {
      [pageCompkey]: compList,
      [pageKey]: queryPageData,
      [dataSoureceKey]: newDataSourceList,
    };
  }

  /**
   * 项目的  apiHost 和 env
   */
  async getApiHostAndEnv({ tagId, envId, depyType }) {
    // 拿到页面的 envList
    let envList: any = await this.envService.findList({
      where: {
        status: {
          type: 'andWhere',
        },
        tagId: {
          type: 'andWhere',
        },
      },
      params: {
        status: 1,
        tagId,
      },
    });

    if (envId) {
      console.log('envIdenvIdenvIdenvId打包指定的env', envId);
      // 如果打包的时候 指定了环境就用指定的环境
      envList = envList.map(v => {
        if (v.id === envId) {
          return {
            ...v,
            checked: 1,
          };
        } else {
          return {
            ...v,
            checked: 0,
          };
        }
      });
    }

    // 拿到页面的 apiHostList
    let apiHostList = await this.apiHostService.findList({
      where: {
        status: {
          type: 'andWhere',
        },
        tagId: {
          type: 'andWhere',
        },
      },
      params: {
        status: 1,
        tagId,
      },
    });

    if (depyType === 'dist') {
      // 如果是静态部署，那么这里就要所有的数据源强制不走代理 notUseProxy
      //  设置为 true ，默认node打包是都走代理的
      apiHostList = apiHostList.map(v => {
        return {
          ...v,
          notUseProxy: 1,
        };
      });
    }
    return {
      'env.js': envList,
      'apiHost.js': apiHostList,
    };

  }
  // 大屏所有静态资源
  async getPageStaticData({ pageId, filePath, queryData }) {
    const staticFilePath = `${filePath}/static`;
    const baseFilePath = `${basePath}/${pageId}`;
    fs.copySync(baseFilePath, `${staticFilePath}/${pageId}`);
    // 处理地图数据
    // 遍历大屏组件 产看是否有地图组件

    fs.ensureDirSync(staticFilePath);
    let mapId = '';
    for (const v of queryData) {
      const { compName, style } = v;
      if (compName === 'Map') {
        mapId = style.mapId;
        break;
      }
    }

    if (mapId) {
      // 把地图相关信息 复制到文件夹里面
      async function cp(typePath) {
        const oldStorePath = `${basePath}/${typePath}`;
        const mapFiles = await fs.readdir(oldStorePath);
        const filterList = mapFiles.filter(v => {
          const splitArr = v.split(mapId);
          if (splitArr.length === 2) {
            return true;
          }
          return false;
        });
        const newStorePath = `${staticFilePath}/${typePath}`;
        fs.ensureDirSync(newStorePath);

        for (const v of filterList) {
          fs.copySync(`${oldStorePath}/${v}`, `${newStorePath}/${v}`);
        }
      }
      await Promise.all([cp('maps'), cp('themes')]);
    }
  }

  // 页面npm包需要的umd格式js
  async getNpmUmdJs({ filePath, compList }) {
    const fileCp = (oldFilePath, newPath) => {
      if (fs.existsSync(oldFilePath)) {
        fs.copySync(oldFilePath, newPath);
      }
    };

    const staticFilePath = `${filePath}/static`;
    compList.map(v => {
      const oldFilePath = `${basePath}/dist/${v}`;
      const newPath = `${staticFilePath}/dist/${v}`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    });

    if (compList.includes('Map')) {
      // 地图路径不一样特殊处理
      const oldFilePath = `${basePath}/fengmap.min.js`;
      const newPath = `${staticFilePath}/fengmap.min.js`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    }
    if (compList.includes('AMap')) {
      // 地图路径不一样特殊处理
      const oldFilePath = `${basePath}/l7.js`;
      const newPath = `${staticFilePath}/l7.js`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    }
  }

  async writePageJson(jsonData, newFilePath) {
    const jsonArr = Object.keys(jsonData).map(v => {
      return {
        data: jsonData[v],
        filePath: newFilePath,
        fileName: v,
      };
    });
    const promiseArr = jsonArr.map(async v => {
      return await readTempAndWriteData({
        data: v.data,
        filePath: v.filePath,
        fileName: v.fileName,
      });
    });
    await Promise.all(promiseArr);
  }

  generateNewData(arr, pageId) {
    // 生成hash 依赖对象
    const hashgroupId = {};
    const hashId = {};
    for (const v of arr) {
      const { id, groupId } = v;
      hashId[id] = 1;
      if (groupId) {
        if (!hashgroupId[groupId]) {
          hashgroupId[groupId] = 1;
        }
      }
    }
    return arr
      .map(v => {
        const info = {
          ...v,
        };
        const newId = uuid();
        const { id } = v;
        // 新旧ID关系
        hashId[id] = newId;
        if (hashgroupId[id]) {
          // 新旧groupId的建立关系
          hashgroupId[id] = newId;
        }
        return {
          ...info,
          id: newId,
          pageId,
        };
      })
      .map(v => {
        const { groupId, containerDeps, deps } = v;
        // 新的替换旧值
        const newContainerDeps = containerDeps.map(value => {
          return hashId[value];
        });
        const newDeps = deps.map(value => {
          return hashId[value];
        });
        let resData = {
          ...v,
          containerDeps: newContainerDeps,
          deps: newDeps,
        };
        if (groupId) {
          resData = {
            ...resData,
            groupId: hashgroupId[groupId],
          };
        }
        return resData;
      });
  }

  /**
   *  新旧ID互换
   */
  replaceOldId(hash, fields) {
    const keys = Object.keys(fields);
    const data = {};
    const repFunc = oldIdArr => {
      if (oldIdArr?.length) {
        return oldIdArr.map((value: string | number) => {
          return hash[value];
        });
      }
      return [];
    };
    for (const key of keys) {
      data[key] = repFunc(fields[key]);
    }
    return data;
  }

  replaceStrOldId(strObj, oldArr, hash) {
    const keys = Object.keys(strObj);
    const data = {};
    const rep = (str: any) => {
      let newStr = str;
      if (!newStr) {
        return '';
      }
      for (const id of oldArr) {
        if (newStr.includes(id)) {
          newStr = newStr.replace(id, hash[id]);
        }
      }
      return newStr;
    };

    for (const key of keys) {
      data[key] = rep(strObj[key]);
    }

    return data;

  }

  /**
   * dealwithDataSource
   */
  async dealwithDataSource({ dataSource, pageId }) {
    const compList = await this.pageCompService.getAllInfo({
      pageId,
      status: 0,
    })
    const obj = {}
    // 拿到当前页面所有组件依赖的数据源数组 
    const allDataSourceIds = compList.reduce((pre, next) => {
      const { dataSourceId, id } = next // 组件依赖的数据源ID数组
      for (const v of dataSourceId) {
        if (obj[v]) {
          obj[v] = {
            ...obj[v],
            [id]: 1
          }
        } else {
          obj[v] = {
            [id]: 1
          }
        }
      }
      if (isArray(dataSourceId)) {
        return [...pre, ...dataSourceId]
      }
      return [...pre, dataSourceId]
    }, [])

    return dataSource.filter(v => allDataSourceIds.includes(v.id)).map(v => {
      const { id } = v
      const compHashData = obj[id]
      return {
        ...v,
        compHashData
      }
    })
  }


  async getAllDataSource(dto) {
    const { list } = await this.getTagPageList({
      tagId: dto.tagId
    })
    const pageIdlist = list.map(v => v.id)
    let dataSourceList = await this.findAllDataSourceConfigByPageId({
      where: [
        {
          pageId: In(pageIdlist),
          status: 1,
        },
        {
          tagId: dto.tagId,
          status: 1,
        },
      ],
    });

    let promiseResultList = dataSourceList.map(async n => {
      const list = await this.compDataSourceService.getListByCond({
        dataSourceId: n.id,
        tagId: n.tagId
      })
      return { ...n, used: !!list.length }
    })
    dataSourceList = await Promise.all(promiseResultList)
    
    if (dto.isPreview || dto.pageId) {
      //只需要用到的数据源 
      const pData = await this.dealwithDataSource({
        dataSource: dataSourceList,
        pageId: dto.pageId,
      })
      return pData
    }
    // 在编辑页面用户需要看到所有的数据源
    return dataSourceList
  }

  dealwithDataAndFunc({ pageWrapArr, dataSourceList, customFuncList }) {
    let newDataList = [
      ...dataSourceList
    ]
    let newFuns = [
      ...customFuncList
    ]
    for (const v of pageWrapArr) {
      const { dataSourceList, customFuncList } = v
      newDataList.push(...dataSourceList)
      newFuns.push(...customFuncList)
    }
    return {
      dataSourceList: uniqBy(newDataList, 'id'),
      customFuncList: uniqBy(newFuns, 'id'),
    }
  }
  getPageWrapList(pageWrapData) {
    let arr = []
    for (const id in pageWrapData) {
      arr = [
        ...arr,
        pageWrapData[id]
      ]
    }
    return arr
  }


  async getQueryAndDatabse(data = []) {
    const ids = data.filter(v => v.useDataType === 'linkDatabase').map(v => v.queryId)
    const queryList = await this.getQueryList(ids)
    const databaseIdList = [...new Set(queryList.map(v => v.dataSourceId))].filter(v => v)
    const databaseList = await this.getDatabaseList(databaseIdList)
    return {
      queryList,
      databaseList
    }
  }



  async getDatabaseList(ids) {
    console.log('getDatabaseList ids', ids)
    const res = await this.httpService
      .post(`${LOCAL_API_HOST}/query/database/ids`, {
        ids
      })
      .toPromise()
    return res?.data?.data || []
  }

  async getQueryList(ids) {
    const res = await this.httpService
      .post(`${LOCAL_API_HOST}/query/ids`, {
        ids
      })
      .toPromise()
    return res?.data?.data || []
  }

  async getPageIdListByTagId(tagId: number) {
    return await this.photoRepository.find({ select:['id'], where: { tagId } })
  }

}
