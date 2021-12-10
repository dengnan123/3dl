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
import { Replace } from '../entities/Replace';

@Injectable()
export class ReplaceService extends BaseService {
  constructor(@InjectRepository(Replace) repo) {
    super(repo);
  }
}
