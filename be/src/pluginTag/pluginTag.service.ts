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
import { PluginTag } from '../entities/PluginTag';

@Injectable()
export class PluginTagService extends BaseService {
  constructor(@InjectRepository(PluginTag) repo) {
    super(repo);
  }

  async findList(condition) {
    const { current = 1, pageSize = 12 } = condition
    const qb = getRepository(PluginTag)
      .createQueryBuilder('plugin_tag')
      .where({
        status: 1,
      });
    const newCurrent = parseInt(current)
    const newPageSize = parseInt(pageSize)
    const list = await qb.skip((newCurrent - 1) * newPageSize).take(newPageSize).orderBy('zIndex', 'DESC').getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }
}
