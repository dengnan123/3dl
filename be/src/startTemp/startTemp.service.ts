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
import { StartTemp } from '../entities/StartTemp';

@Injectable()
export class StartTempService extends BaseService {
  constructor(@InjectRepository(StartTemp) repo) {
    super(repo);
  }
}
