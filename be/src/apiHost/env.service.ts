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
import { Env } from '../entities/Env';

@Injectable()
export class EnvService extends BaseService {
  constructor(@InjectRepository(Env) repo) {
    super(repo);
  }

  async findEnvList(dto) {
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
    return res;
  }
}
