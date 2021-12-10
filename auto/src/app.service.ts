import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
// const replace = require('replace-in-file');
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { isArray } from 'lodash'
import { getStartTemp, replaceWithEnv, newReplaceWithEnv, getFromAndTo } from './utils/shell';
import { readTempAndWriteData, writeDataToTempJs, makeFilePath, writeDataToJson } from './utils/file'
import * as compressing from 'compressing';
import { getMapIdByCompList, getCompNameArrHashByKey } from './utils/file'
import * as jsonfile from 'jsonfile'
import *  as  dayjs from 'dayjs'
import { loadingStyle2HtmlStr } from './utils/loading'

@Injectable()
export class InitService implements OnModuleInit {

  constructor(
    public httpService: HttpService,
  ) { }

  onModuleInit() { }

  checkAndGetData() { }

  /**
   * 前端静态化打包
   */
  async distBuild({ replaceJson, fileBasePath, res, baseCodeFilePath }) {
    // cp 一个临时的文件
    const tempDistName = uuid.v4();
    const newDistPath = `${fileBasePath}/${tempDistName}/dist`;
    fs.copySync(`${fileBasePath}/dist`, newDistPath); //前端文件复制进来
    // 把pageStatic 复制进来
    console.log('.....baseCodeFilePath', baseCodeFilePath)
    fs.copySync(
      `${baseCodeFilePath}/dist/pageStatic`,
      `${newDistPath}/pageStatic`,
    );
    // 需要做一些变量处理
    replaceWithEnv({
      ...getFromAndTo(replaceJson),
      baseCodeFilePath: newDistPath,
    });
    const downloadZipPath = `${newDistPath}.zip`;
    console.log('downloadZipPath>>>>>', downloadZipPath);
    await compressing.zip.compressDir(newDistPath, downloadZipPath);
    const readerStream = fs.createReadStream(downloadZipPath);
    res.setHeader('Content-Type', 'application/octet-stream');
    readerStream.pipe(res);
    readerStream.on('end', () => {
      // 删除压缩包
      console.log('下载结束');
      fs.removeSync(`${fileBasePath}/${tempDistName}`);


    });
  }


  /**
 * 前端静态化打包
 */
  async newDistBuild({ replaceJson, res, tmpFilePath, basePath, tmpFileName }) {
    // 需要做一些变量处理
    newReplaceWithEnv({
      ...getFromAndTo(replaceJson),
      distFilePath: `${tmpFilePath}/dist`,
    });
    const endCallback = () => {
      fs.removeSync(`${basePath}/${tmpFileName}`)
    }
    this.newStreamDownload({
      res, endCallback, tmpFilePath, basePath, tmpFileName
    })
  }

  /**
   * 
   * 把静态资源的路径进行替换
   */
  async replaceStaticPath({ tmpFilePath, replaceJson }) {
    const distFilePath = `${tmpFilePath}/dist`
    console.log('replaceStaticPath...replaceJson', replaceJson)
    newReplaceWithEnv({
      ...getFromAndTo(replaceJson),
      distFilePath,
    });
  }

  /**
   * 
   * 获取 replaceStaticPath 需要的replaceJson
   */
  async getStaticReplaceJson({ replaceJson, baseUrl, tagId }) {
    const loadingDivStr = await this.getLoadingDivStr({
      tagId, baseUrl
    })
    return {
      LOADING_PLACEHOLDER: loadingDivStr,
      'https://3dl.dfocus.top/api/static': `UMI_PUBLIC_PATH/pageStatic/static`
    }
  }


  /**
   * 删除临时文件
   */
  async delTmpFiles({ unzipCodeFilePath, codeFilePath }) {
    const newFiles = await fs.readdir(unzipCodeFilePath);
    let fileName;
    for (const v of newFiles) {
      if (v.includes('tmp')) {
        fileName = v;
      }
    }
    if (fileName) {
      const oldPath = `${unzipCodeFilePath}/${fileName}`;
      const newPath = `${unzipCodeFilePath}/pageStatic`;
      if (fs.existsSync(newPath)) {
        fs.removeSync(newPath);
      }
      fs.renameSync(oldPath, newPath);
      fs.removeSync(codeFilePath);
      fs.removeSync(oldPath);
    }
  }

  /**
   * stream 下载
   */
  streamDownload({ res, downloadZipPath, baseCodeFilePath }) {
    const readerStream = fs.createReadStream(downloadZipPath);
    res.setHeader('Content-Type', 'application/octet-stream');
    readerStream.pipe(res);
    readerStream.on('end', () => {
      // 删除压缩包
      console.log('下载结束');
      fs.removeSync(`${baseCodeFilePath}/pageStatic`);
      fs.removeSync(`${baseCodeFilePath}/replace.json`);
      fs.removeSync(downloadZipPath);
      console.log('删除旧的pageStatic replace.json完成');
    });
  }

  


  /**
 * stream 下载
 */
  async newStreamDownload({ res, basePath, tmpFilePath, endCallback = null, tmpFileName }) {
    const zipName = `file.zip`;
    const downloadZipPath = `${basePath}/${tmpFileName}/${zipName}`
    await compressing.zip.compressDir(tmpFilePath, downloadZipPath);
    const readerStream = fs.createReadStream(downloadZipPath);
    res.setHeader('Content-Type', 'application/octet-stream');
    readerStream.pipe(res);
    readerStream.on('end', () => {
      // 删除压缩包
      console.log('下载结束');
      fs.removeSync(downloadZipPath)
      endCallback && endCallback()
    });
  }


  /**
* stream 下载
*/
  async streamDownload2({ res, downloadPath, endCallback = null }) {
    const zipName = `file.zip`;
    // 生成一个临时的路径
    const tmpPath = `${path.resolve(__dirname, '../../')}/${uuid()}tmp`
    fs.ensureDirSync(tmpPath)
    const downloadZipPath = `${tmpPath}/${zipName}`
    await compressing.zip.compressDir(downloadPath, downloadZipPath);
    const readerStream = fs.createReadStream(downloadZipPath);
    res.setHeader('Content-Type', 'application/octet-stream');
    readerStream.pipe(res);
    readerStream.on('end', () => {
      // 删除压缩包
      console.log('下载结束');
      fs.removeSync(tmpPath)
      endCallback && endCallback()
    });
  }


  /**
   * 获取大屏资源并且生成对应的js 
   */
  async generatePageStatic({ pageIdList, depyType, tagId, envId, tmpDistFilePath, staticResourceStoragePath, baseUrl }) {
    // 处理pageIdList
    const newPageIdList = await this.getPageIdList({
      tagId,
      baseUrl,
      pageIdList
    })
    // 获取大屏所有的数据
    const promissArr = newPageIdList.map(async pageId => {
      const pageAggregateData = await this.getPageAggregateApi({
        pageId, tagId, baseUrl
      })
      return {
        pageId,
        pageAggregateData
      }
    })
    const pageDataList: any = await Promise.all(promissArr)

    const allCompNames = await this.getAllCompNameList({
      pageIdList: newPageIdList, baseUrl, tagId
    })
    //页面对应的js
    const generatePageJsArr = pageDataList.map(async v => {
      const { pageId, pageAggregateData } = v
      const { initUseCompList } = pageAggregateData
      await this.generateJs({
        pageId,
        pageAggregateData,
        depyType,
        tmpDistFilePath,
        envId,
        tagId
      })
      await this.getPageStaticData({
        pageId, tmpDistFilePath, staticResourceStoragePath, compList: initUseCompList
      })
    })
    await Promise.all(generatePageJsArr)

    // 根据默认页面生成def js
    const defPageId = this.getDefPageId(pageDataList)
    this.addDefJs({
      tmpDistFilePath, pageId: defPageId
    })
    // 根据大屏组件名字 cp 组件资源到pageStatic 顺便根据名字 处理某些特殊的js 库
    await this.getNpmUmdJs({
      allCompNames,
      tmpDistFilePath,
      staticResourceStoragePath,
    })
    // 根据一个项目的数据源判断是否有直连数据库的api 有的话，需要把对应的信息，查出来生成固定的json database.json 和  query.json
    await this.generateQueryAndDatabase({
      tmpDistFilePath,
      tagId,
      baseUrl
    })
    //如果选择了合并组件库 就要调用rollup 把用到的组件cp到临时文件里面，然后重新打包成一个新js
  }

  async fetchData({ url, data = {}, params = {} }) {
    const res = await this.httpService
      .get(url, {
        headers: {},
        params,
        data,
      })
      .toPromise();
    return res.data
  }

  async getPageIdList({ tagId, pageIdList: initList, baseUrl }) {
    let pageIdList = initList;
    if (!pageIdList || !pageIdList.length) {
      // 没有 pageIdList 的话 是打包整个项目
      const pageListRes: any = await this.fetchData({
        url: `${baseUrl}/page`,
        params: {
          tagId,
          pageSize: 999,
          current: 1
        }
      })
      console.log('pageListRes>>>>>', pageListRes)
      if (pageListRes?.errorCode !== 200) {
        return []
      }
      pageIdList = pageListRes?.data?.list?.map((v) => v.id);
    }
    return pageIdList
  }

  async getPageData({ pageId, tagId, baseUrl }) {
    const getCompListRouter = `${baseUrl}/page-comp/${pageId}`
    const getPageConfigRouter = `${baseUrl}/page/${pageId}`
    const getDataSourceRouter = `${baseUrl}/page/dataSource/all`
    const getCustomFuncRouter = `${baseUrl}/customFunc/all`
    const promissArr = [getCompListRouter, getPageConfigRouter, getDataSourceRouter, getCustomFuncRouter].map(async v => {
      const data = {
        pageId, tagId, type: 'edit', // edit 是tree形结构数据和 edit页面保持结构一致
      }
      return await this.fetchData({
        url: v,
        data,
        params: data
      })
    })
    const res = await Promise.all(promissArr)
    const compList = res[0].data
    const pageConfig = res[1].data
    const dataSourceList = res[2].data
    const customFunclist = res[3].data

    return {
      compList,
      pageConfig,
      dataSourceList,
      customFunclist
    }
  }

  async getPageAggregateApi({ pageId, tagId, baseUrl }) {
    const url = `${baseUrl}/page/aggregate`
    const res = await this.fetchData({
      url,
      params: {
        pageId, tagId
      }
    })
    const { data, errorCode } = res
    if (errorCode !== 200) {
      return
    }
    return data
  }

  async getQueryAndDatabase({ tagId, baseUrl }) {
    const url = `${baseUrl}/page/database`
    const res = await this.fetchData({
      url,
      params: {
        tagId
      }
    })
    const { data, errorCode } = res
    if (errorCode !== 200) {
      return
    }
    return data
  }

  async generateQueryAndDatabase({ tagId, baseUrl, tmpDistFilePath }) {
    const { queryList, databaseList } = await this.getQueryAndDatabase({ tagId, baseUrl })
    writeDataToJson({
      data: queryList || [],
      tmpDistFilePath,
      fileName: 'query.json'
    })
    writeDataToJson({
      data: databaseList || [],
      tmpDistFilePath,
      fileName: 'database.json'
    })
  }

  // 获取页面所有的组件名字
  async getAllCompNameList({ pageIdList, baseUrl, tagId }) {
    const promiseList = pageIdList.map(async (pageId) => {
      const url = `${baseUrl}/page-comp/flat/${pageId}`
      const data = {
        pageId,
        tagId
      }
      const compListRes: any = await this.fetchData({
        url,
        data,
        params: data
      })
      if (compListRes.errorCode !== 200) {
        return []
      }
      return compListRes?.data?.map((item) => item.compName);
    });
    const allPageCompList: any = await Promise.all(promiseList);
    let compNameList = allPageCompList.reduce((pre, next) => {
      return [...pre, ...next];
    }, []);
    compNameList = Array.from(new Set(compNameList)); // 去重
    return compNameList
  }

  // 获取当前项目的apiHostList 和 envList
  async getApiHostListAndEnvList({ tagId, baseUrl, envId }) {
    const getApihostRouter = `${baseUrl}/apiHost`
    const getHostRouter = `${baseUrl}/apiHost/env`
    const promissArr = [getApihostRouter, getHostRouter].map(async v => {
      const data = {
        tagId
      }
      return await this.fetchData({
        url: v,
        data,
        params: data
      })
    })
    const res = await Promise.all(promissArr)
    const apiHostList = res[0]?.data || []
    let envList = res[1]?.data || []
    if (envId) {
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
    return {
      apiHostList,
      envList
    }
  }


  /**
   * 
   *  获取默认页面Id
   */
  getDefPageId(arr) {
    for (const v of arr) {
      const { pageAggregateData } = v
      if (pageAggregateData.pageConfig.isDefault) {
        return v.id
      }
    }
  }

  /**
 * 加上根据默认页面ID，加上def js
 */
  addDefJs({ tmpDistFilePath, pageId }) {
    if (!pageId) {
      return
    }
    // const arr = [
    //   {
    //     oldP: `${pageId}-pageComp.js`,
    //     newP: `def-pageComp.js`,
    //   },
    //   {
    //     oldP: `${pageId}-page.js`,
    //     newP: `def-page.js`,
    //   },
    //   {
    //     oldP: `${pageId}-dataSource.js`,
    //     newP: `def-dataSource.js`,
    //   },
    // ];
    const arr = [
      {
        oldP: `${pageId}-page.js`,
        newP: `def-page.js`,
      }
    ];
    for (const v of arr) {
      const { oldP, newP } = v;
      const jsPath = `${tmpDistFilePath}/${oldP}`;
      const defJsPath = `${tmpDistFilePath}/${newP}`;
      if (fs.existsSync(jsPath)) {
        fs.copySync(jsPath, defJsPath);
      }
    }
  };




  async generatePageJs({ pageId, depyType, compList,
    pageConfig,
    dataSourceList, tmpDistFilePath, customFunclist }) {
    if (depyType === 'dist') {
      // 如果是静态部署，那么这里就要所有的数据源强制不走代理 notUseProxy
      //  设置为 true ，默认node打包是都走代理的
      dataSourceList = dataSourceList.map(v => {
        return {
          ...v,
          notUseProxy: 1,
        };
      });
    }
    const pageCompkey = `${pageId}-pageComp.js`;
    const pageKey = `${pageId}-page.js`;
    const dataSoureceKey = `${pageId}-dataSource.js`;
    const customFunclistKey = `${pageId}-customFunc.js`
    const jsonData = {
      [pageCompkey]: compList,
      [pageKey]: pageConfig,
      [dataSoureceKey]: dataSourceList,
      [customFunclistKey]: customFunclist
    }
    this.writePageJson(jsonData, tmpDistFilePath)
  }

  async generateTagJs({ apiHostList, envList, tmpDistFilePath }) {
    const jsonData = {
      'env.js': envList,
      'apiHost.js': apiHostList,
    }
    this.writePageJson(jsonData, tmpDistFilePath)
  }

  async generateJs({ pageId,
    pageAggregateData,
    depyType,
    tmpDistFilePath, envId,
    tagId }) {
    const { dataSourceList, envList } = pageAggregateData
    if (depyType === 'dist') {
      // 如果是静态部署，那么这里就要所有的数据源强制不走代理 notUseProxy
      //  设置为 true ，默认node打包是都走代理的
      pageAggregateData.dataSourceList = dataSourceList.map(v => {
        return {
          ...v,
          notUseProxy: 1,
        };
      });
    }
    if (envId) {
      // 如果打包的时候 指定了环境就用指定的环境
      pageAggregateData.envList = envList.map(v => {
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
    const pageJsKey = `${pageId}-page.js`
    const jsonData = {
      [pageJsKey]: pageAggregateData
    }
    this.writePageJson(jsonData, tmpDistFilePath)
  }


  writePageJson(jsonData, tmpDistFilePath) {
    const keys = Object.keys(jsonData)
    for (const v of keys) {
      const data = {
        data: jsonData[v],
        tmpDistFilePath,
        fileName: v,
      }
      writeDataToTempJs(data);
    }
  }

  // 页面npm包需要的umd格式js
  async getNpmUmdJs({ tmpDistFilePath, allCompNames, staticResourceStoragePath }) {
    const fileCp = (oldFilePath, newPath) => {
      if (fs.existsSync(oldFilePath)) {
        fs.copySync(oldFilePath, newPath);
      }
    };

    const staticFilePath = `${tmpDistFilePath}/pageStatic/static`; // 存放页面用到组件包
    allCompNames.map(v => {
      const oldFilePath = `${staticResourceStoragePath}/dist/${v}/lib.js`;
      const newPath = `${staticFilePath}/dist/${v}/lib.js`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    });

    if (allCompNames.includes('Map') || allCompNames.includes('NewFengMap')) {
      // 地图路径不一样特殊处理
      const oldFilePath = `${staticResourceStoragePath}/fengmap.min.js`;
      const newPath = `${staticFilePath}/fengmap.min.js`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    }
    if (allCompNames.includes('AMap')) {
      // 地图路径不一样特殊处理
      const oldFilePath = `${staticResourceStoragePath}/l7.js`;
      const newPath = `${staticFilePath}/l7.js`;
      if (fs.existsSync(oldFilePath)) {
        fileCp(oldFilePath, newPath);
      }
    }
  }

  // cp 大屏所有静态资源
  async getPageStaticData({ pageId, tmpDistFilePath, staticResourceStoragePath, compList }) {
    const pageStaticResourceStoragePath = `${staticResourceStoragePath}/page/${pageId}`
    const pageTmpDistFilePath = `${tmpDistFilePath}/pageStatic/static/page/${pageId}`
    if (fs.existsSync(pageStaticResourceStoragePath)) {
      fs.copySync(pageStaticResourceStoragePath, pageTmpDistFilePath);
    }
    // 处理地图数据
    // 遍历大屏组件 产看是否有地图组件
    const compNameHash = getCompNameArrHashByKey(compList, ['NewFengMap', 'CustomizeWeatherPanel'])
    const mapArr = compNameHash['NewFengMap']
    const weatherArr = compNameHash['CustomizeWeatherPanel']
    let mapIdArr = getMapIdByCompList(mapArr)
    console.log('mapIdArr', mapIdArr)
    if (mapIdArr?.length) {
      // 把地图相关信息 复制到文件夹里面
      for (const mapId of mapIdArr) {
        async function cp(typePath) {
          const oldStorePath = `${staticResourceStoragePath}/${typePath}`;
          const mapFiles = await fs.readdir(oldStorePath);
          const filterList = mapFiles.filter(v => {
            const splitArr = v.split(mapId);
            if (splitArr.length === 2) {
              return true;
            }
            return false;
          });
          const newStorePath = `${tmpDistFilePath}/pageStatic/static/${typePath}`;
          for (const v of filterList) {
            fs.copySync(`${oldStorePath}/${v}`, `${newStorePath}/${v}`);
          }
        }
        await Promise.all([cp('maps'), cp('themes')]);
      }
    }
    if (weatherArr?.length) {
      const weatherPath = `${tmpDistFilePath}/pageStatic/static/weather`
      if (!fs.existsSync(weatherPath)) {
        console.log('cp 天气icon')
        fs.copySync(`${staticResourceStoragePath}/weather`, weatherPath);
      }

    }
  }





  addFieldToDistPkg({ tmpFilePath }) {
    // 给前端pkg增加dpBuildTime 
    const pkgPath = `${tmpFilePath}/package.json`
    const nowTime = dayjs().valueOf()
    const oldData = jsonfile.readFileSync(pkgPath)
    const newData = {
      ...oldData,
      dpBuildTime: nowTime
    }
    jsonfile.writeFileSync(pkgPath, newData, { spaces: 2 })
  }


  async getLoadingDivStr({ tagId, baseUrl }) {
    const url = `${baseUrl}/tag/${tagId}`
    const tagDataRes = await this.fetchData({
      url,
      params: {

      }
    })
    if (tagDataRes?.errorCode !== 200) {
      return
    }
    let { loadingId } = tagDataRes?.data
    if (!loadingId) {
      // 获取默认的loadingID
      loadingId = 1
    }
    const loadingUrl = `${baseUrl}/loading/${loadingId}`
    const loadingDataRes = await this.fetchData({
      url: loadingUrl,
      params: {

      }
    })
    const loadingStyle = loadingDataRes?.data?.loadingStyle || {}
    return loadingStyle2HtmlStr(loadingStyle)
  }



}

