import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { CompDataSource } from "../entities/CompDataSource"
import { InjectRepository } from "@nestjs/typeorm"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { Repository, getConnection, In } from "typeorm"
import * as moment from "dayjs"
import { uniqWith, isEqual, isArray, difference } from "lodash"


@Injectable()
export class CompDataSourceService {
  constructor(
    @InjectRepository(CompDataSource)
    private readonly compDataSourceRepository: Repository<CompDataSource>
  ) { }

  // 组件更新调用
  async updateByDataSourceId({ compId, dataSourceId = [], pageId, tagId }) {
    if (!dataSourceId.length) {
      // 删除全部
      return await this.delCompDataSourceId(compId)
    }
    return await this.batchAddOrUpdateByDataSourceId({ compId, dataSourceId, pageId, tagId })

  }
  // 组件删除调用
  async delCompDataSourceId(compId) {
    const delFn = async (compId) => {
      const arr = await this.getDataSourceIdListByCompId(compId)
      const ids = arr.map(v => v.id)
      await this.batchDelete(ids)
    }
    if (isArray(compId)) {
      const promissArr = compId.map(async v => {
        await delFn(v)
      })
      return await Promise.all(promissArr)
    }
    return await delFn(compId)
  }
  async batchDelete(ids) {
    if (!ids?.length) {
      return
    }
    const promissArr = ids.map(async (id) => {
      await this.compDataSourceRepository.save({
        id,
        status: 0,
      })
    })
    await Promise.all(promissArr)
  }

  async batchDeleteByCond(cond) {
    const newCond = this.dealWithWhereCond(cond)
    const idsRes = await this.compDataSourceRepository.find({
      where: {
        ...newCond,
        status: 1
      }
    })
    const ids = idsRes.map(v => v.id)
    const promissArr = ids.map(async (id) => {
      await this.compDataSourceRepository.save({
        id,
        status: 0,
      })
    })
    await Promise.all(promissArr)
  }

  async batchAddOrUpdateByDataSourceId({ compId, dataSourceId, pageId, tagId }) {
    const list = await this.getDataSourceIdListByCompId(compId)
    const dataSourceIdList = list.map(v => v.dataSourceId)
    const delArr = difference(dataSourceIdList, dataSourceId)
    const addArr = difference(dataSourceId, dataSourceIdList)
    await this.batchDeleteByCond({
      pageId,
      tagId,
      dataSourceId: delArr,
      compId
    })
    const promissArr = addArr.map(async (id) => {
      const data = {
        dataSourceId: id,
        status: 1,
        compId,
        pageId,
        tagId
      }
      await this.compDataSourceRepository.save(data)
    })
    await Promise.all(promissArr)
  }

  async getDataSourceIdListByCompId(compId) {
    return await this.compDataSourceRepository.find({
      where: {
        compId,
        status: 1,
      },
    })
  }

  async getListByCond(cond) {
    const newCond = this.dealWithWhereCond(cond)

    return await this.compDataSourceRepository.find({
      where: {
        ...newCond,
        status: 1,
      },
    })
  }
  async getOneByCond(cond) {

  }

  dealWithWhereCond(cond) {
    const keys = Object.keys(cond)
    let newCond = {
      ...cond
    }
    for (const key of keys) {
      const value = cond[key]
      if (isArray(value)) {
        newCond[key] = In(value)
      }
    }
    return newCond
  }

  // 删除数据源调用
  async getCompListByDataSourceId({ dataSourceId, tagId }) {
    return await this.compDataSourceRepository.find({
      where: {
        dataSourceId,
        status: 1,
        tagId
      }
    })
  }

}
