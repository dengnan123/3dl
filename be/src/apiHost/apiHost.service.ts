import { Injectable, HttpService } from '@nestjs/common';
import { BaseService } from '../basic/service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
  getManager,
  Like,
  ConnectionOptions,
  getRepository,
} from 'typeorm';
import { ApiHost } from '../entities/ApiHost';
import { EnvService } from './env.service';
import { LOCAL_API_HOST } from '../config'
import { isArray } from 'lodash'


@Injectable()
export class ApiHostService extends BaseService {
  constructor(@InjectRepository(ApiHost) repo, public envService: EnvService, public httpService: HttpService,) {
    super(repo);
  }

  async findApiList(dto) {
    const res = await this.findList({
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
        ...dto,
      },
    });
    return res.map(v => {
      const { sourceList } = v
      return {
        ...v,
        apiHostId: v.id,
        sourceList: isArray(sourceList) ? sourceList : []
      };
    });
  }

  async getCheckedId({ tagId }) {
    const envList = await this.envService.findEnvList({ tagId })
    const checkEnvArr = envList.filter(v => v.checked)
    if (checkEnvArr?.length) {
      return checkEnvArr[0].id
    }
  }

  async getApiHostList(dto) {
    const checkedId = await this.getCheckedId(dto)
    const resData = await this.findApiList(dto)
    if (checkedId) {
      return resData.map(v => {
        const { sourceList } = v
        const nowUseUrl = this.getNowUseUrl(checkedId, sourceList)
        return {
          ...v,
          nowUseUrl
        }
      })
    }
    return resData
  }

  getNowUseUrl(checkedId, sourceList) {
    for (const v of sourceList) {
      const { envId, value } = v
      if (checkedId === envId) {
        return value
      }
    }
  }

  async batchUpdateQueryDataSourceId({ apiHostList, oldCheckId, newCheckId }) {
    const databaseArr = apiHostList.filter(v => v.type === 'database')
    if (!databaseArr?.length) {
      return
    }
    const promissArr = databaseArr.map(async v => {
      await this.nowUseDatabaseChange({
        ...v,
        oldCheckId, newCheckId
      })
    })
    await Promise.all(promissArr)
  }


  async nowUseDatabaseChange(dto) {
    const oldData = await this.findOneById(dto.id)
    const checkedId = await this.getCheckedId(dto)
    const newCheckId = dto.newCheckId || checkedId
    const oldCheckId = dto.oldCheckId || checkedId
    const oldDatasourceId = this.getNowUseUrl(oldCheckId, oldData.sourceList)
    const newDataSourceId = this.getNowUseUrl(newCheckId, dto.sourceList)
    if (oldDatasourceId !== newDataSourceId) {
      // 说明更改了 数据库ID，需要redash 批量更新
      this.httpService
        .patch(`${LOCAL_API_HOST}/query/datasource/${oldDatasourceId}`, {
          dataSourceId: newDataSourceId
        }, {
        })
        .toPromise()
    }
  }




}
