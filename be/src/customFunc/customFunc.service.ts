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
import { CustomFunc } from '../entities/CustomFunc';

@Injectable()
export class CustomFuncService extends BaseService {
  constructor(@InjectRepository(CustomFunc) repo) {
    super(repo);
  }
}
