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
import { Plugin } from '../entities/Plugin';

@Injectable()
export class PluginService extends BaseService {
  constructor(@InjectRepository(Plugin) repo) {
    super(repo);
  }

  async findList(condition) {
    const { current = 1, pageSize = 12, pluginTagId, keyword } = condition
    const qb = getRepository(Plugin)
      .createQueryBuilder('plugin')
      .where({
        status: 1,
      });
    if (pluginTagId) {
      qb.andWhere(`plugin_tag_id = '${pluginTagId}'`)
    }
    if (keyword) {
      qb.andWhere(`plugin_name  like  "%${keyword}%" OR plugin_key  = "${keyword}"`);
    }
    const list = await qb.skip((current - 1) * pageSize).take(pageSize).orderBy('create_time', 'DESC').getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }
}
