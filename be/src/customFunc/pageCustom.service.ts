import { Injectable } from '@nestjs/common';
import { BaseService } from '../basic/service';
import { InjectRepository } from '@nestjs/typeorm';
import { PageCustomFunc } from '../entities/PageCustomFunc';
import { CustomFunc } from '../entities/CustomFunc';
import { omit } from 'lodash'
import {
  getConnection,
  Repository,
  getManager,
  Like,
  ConnectionOptions,
  getRepository,
  Connection
} from 'typeorm';

@Injectable()
export class PageCustomService extends BaseService {
  constructor(@InjectRepository(PageCustomFunc) repo,
    @InjectRepository(CustomFunc)
    private readonly customFuncRepository: Repository<CustomFunc>,) {
    super(repo);
  }

  public async getListByCondition(cond) {
    const query = getConnection()
      .createQueryBuilder(PageCustomFunc, 'pageCustomFunc')
      .leftJoinAndMapOne('pageCustomFunc.expand', CustomFunc, 'customFunc', 'pageCustomFunc.funcId=customFunc.id')
    if (cond.pageId) {
      query.where("pageCustomFunc.pageId=:pageId", cond)
    }
    if (cond.tagId) {
      query.andWhere("pageCustomFunc.tagId=:tagId", cond)
    }
    const res: any = await query.getMany()
    return res.map(v => {
      const newData = {
        ...v.expand,
        ...v
      }
      return omit(newData, ['expand'])
    })
  }

  public async getListByOrCondition(cond) {

    if (cond.pageId) {
      cond.pageId = parseInt(cond.pageId)
    }
    if (cond.tagId) {
      cond.tagId = parseInt(cond.tagId)
    }

    const query = getConnection()
      .createQueryBuilder(PageCustomFunc, 'pageCustomFunc')
      .leftJoinAndMapOne('pageCustomFunc.expand', CustomFunc, 'customFunc', 'pageCustomFunc.funcId=customFunc.id')
    if (cond.pageId) {
      query.where("pageCustomFunc.pageId=:pageId", cond)
    }
    if (cond.tagId) {
      query.orWhere("pageCustomFunc.tagId=:tagId", cond)
    }
    const res: any = await query.getMany()
    return res.map(v => {
      const newData = {
        ...v.expand,
        ...v
      }
      return omit(newData, ['expand'])
    })
  }
}
