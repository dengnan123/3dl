import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Comp } from '../entities/Comp';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class CompService extends TypeOrmCrudService<Comp> {
  constructor(
    @InjectRepository(Comp)
    repo,
  ) {
    super(repo);
  }

  getBodyData() {
    return {
      parsed: {
        fields: [],
        paramsFilter: [],
        authPersist: undefined,
        search: {},
        filter: [],
        or: [],
        join: [],
        sort: [],
        limit: undefined,
        offset: undefined,
        page: undefined,
        cache: undefined,
      },
      options: {},
    };
  }

  async getInfo(condition): Promise<any> {
    const queryData: any = await this.findOne(condition);
    if (queryData) {
      queryData.compId = queryData.id;
      queryData.compName = queryData.name;
      delete queryData.id;
      delete queryData.name;
    }
    return queryData;
  }

  async getAllInfo(condition): Promise<any> {
    let queryData: any = await this.find(condition);
    if (queryData.length) {
      queryData = queryData.map(v => {
        return {
          ...v,
          compId: v.id,
          compName: v.name,
        };
      });
    }
    return queryData;
  }

  async batchAdd(arr) {
    const newArr: any = arr.map(v => {
      return {
        ...v,
      };
    });
    const addRes = await this.createMany(this.getBodyData(), {
      bulk: newArr,
    });
    if (addRes.length !== newArr.length) {
      throw new HttpException('新增失败', HttpStatus.FORBIDDEN);
    }
    return addRes;
  }

  async updateInfo(condition) {
    const updateRes = await this.updateOne(this.getBodyData(), condition);
    return updateRes;
  }
}
