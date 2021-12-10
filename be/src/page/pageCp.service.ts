import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { Page } from '../entities/Page';
import { PageComp } from '../entities/PageComp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, In } from 'typeorm';
import * as fs from 'fs-extra';
import * as path from 'path';
import { PageCompService } from '../page-comp/page-comp.service';
import { PageService } from './page.service'
import * as moment from 'dayjs';
import { v4 as uuid } from 'uuid';
import { dealWithFindInfo } from '../page-comp/parse'




@Injectable()
export class PageCpService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(PageComp)
    private readonly pageCompRepository: Repository<PageComp>,
    public pageCompService: PageCompService,
    public pageService: PageService
  ) { }

  //页面处理
  async pageCp(dto) {
    const oldPageInfo = await this.pageRepository.findOne(
      dto.pageId
    );
    let newPage = {
      ...oldPageInfo,
      ...dto,
      createTime: moment().valueOf()
    }
    delete newPage.id;
    const newPageInfo = await this.pageRepository.save(
      newPage,
    );
    return {
      oldPageId: dto.pageId,
      newPageId: newPageInfo.id,
      newTagId: dto.tagId,
      oldTagId: oldPageInfo.tagId
    }
  }
  //组件处理
  async compCp({ oldPageId, newPageId, newTagId }) {
    const condition = {
      where: {
        pageId: oldPageId,
        status: 0,
      },
    };
    const compList = await this.pageCompService.getAllInfo(condition);
    const oldCompIdList = compList.map(v => v.id)
    const newArr = this.pageCompService.dealWithBatchAddData(compList);
    const { oldToNewHash, newCompList } = await this.getHashAndNewCompList({
      newArr, newPageId, newTagId, oldPageId
    })
    await this.dealWithDataAndUpdateComp({
      newCompList, oldToNewHash, oldCompIdList: [...oldCompIdList, oldPageId] // 把老的页面ID也放进去
    })
  }

  async getHashAndNewCompList({ newArr, newPageId, newTagId, oldPageId }) {
    let oldToNewHash = {
      [oldPageId]: newPageId
    }
    const pArr = newArr.map(async v => {
      const data = {
        ...v,
        pageId: newPageId,
        tagId: newTagId,
        dataSourceId: null,
        cacheParamsDeps: null,
        clearApiDeps:null,
        loadingDeps:null,
        id: uuid()
      }
      const oldId = v.id
      oldToNewHash[oldId] = data.id
      const nv = await this.pageCompRepository.save(data)
      return nv
    })
    const newCompList: any = await Promise.all(pArr)
    return {
      oldToNewHash,
      newCompList
    }
  }

  async dealWithDataAndUpdateComp({ newCompList, oldToNewHash, oldCompIdList }) {
    const newPArr = newCompList.map(async v => {
      const shouldDealWithData = {
        showCompsFilterFunc: v.showCompsFilterFunc,
        hiddenCompsFilterFunc: v.hiddenCompsFilterFunc,
        showComps: v.showComps,
        hiddenComps: v.hiddenComps,
        containerDeps: v.containerDeps,
        passParamsComps: v.passParamsComps,
        clearParamsComps: v.clearParamsComps,
      };
      const data = {
        id: v.id,
        groupId: oldToNewHash[v.groupId],
        ...this.funcCompIdReplace({
          oldToNewHash, data: shouldDealWithData, oldCompIdList
        })
      }
      return await this.pageCompRepository.save(data)
    })
    return await Promise.all(newPArr)
  }

  // 静态资源处理
  fileCp({ oldPageId, newPageId }) {
    const basePath = path.resolve(__dirname, '../../../static/page');
    const oldPicNamePath = `${basePath}/${oldPageId}`;
    const newPicNamePath = `${basePath}/${newPageId}`;
    if (fs.existsSync(oldPicNamePath)) {
      // 有的话 就复制
      fs.copySync(oldPicNamePath, newPicNamePath);
    }
  }

  funcCompIdReplace({ oldToNewHash, data, oldCompIdList }) {
    return this.pageService.replaceStrOldId(data, oldCompIdList, oldToNewHash)
  }
  compIdReplace({ oldToNewHash, data }) {
    const keys = Object.keys(data)
    let newData = {
      ...data
    }
    for (const key of keys) {
      if (data[key]) {
        newData[key] = this.arrIdReplace(data[key], oldToNewHash)
      }
    }
    return newData
  }
  arrIdReplace(arr = [], oldToNewHash) {
    return arr.map(v => oldToNewHash[v])
  }




}

