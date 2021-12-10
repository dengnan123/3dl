import { Injectable } from '@nestjs/common';
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
import { Loading } from '../entities/Loading';

@Injectable()
export class LoadingService extends BaseService {
  constructor(@InjectRepository(Loading) repo) {
    super(repo);
  }


  async findList(condition) {
    const { current = 1, pageSize = 12, layoutType, userId, tagId, keyword } = condition
    const qb: any = getRepository(Loading)
      .createQueryBuilder('loading')
      .where({
        status: 1,
      });
    const list = await qb.skip((current - 1) * pageSize).take(pageSize).orderBy('create_time', 'DESC').getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }
}
