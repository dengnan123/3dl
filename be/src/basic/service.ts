import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
  getManager,
  Like,
  ConnectionOptions,
  getRepository,
} from 'typeorm';
import * as moment from 'dayjs';
import { v4 as uuid } from 'uuid';
import { OrLike, dealWithFindRes, delwithInputData, snakeCase } from './util';
import { strToObj, objToStr } from '../utils/type';
import { cloneDeep, isArray } from 'lodash';

export class BaseService {
  protected dbName: ConnectionOptions['type'];
  protected textFieldshash: object;
  protected targetName: string;
  protected dbTableName: string;
  protected entityColumns: string[];
  protected entityPrimaryColumns: string[];
  protected entityColumnsHash: object;
  protected entityRelationsHash: any;
  protected sqlInjectionRegEx: RegExp[] = [
    /(%27)|(\')|(--)|(%23)|(#)/gi,
    /((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/gi,
    /w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/gi,
    /((%27)|(\'))union/gi,
  ];
  constructor(protected repo: Repository<any>) {
    this.dbName = this.repo.metadata.connection.options.type; // 数据库类型
    this.targetName = this.repo.metadata.targetName; // 表实体名字
    this.dbTableName = this.repo.metadata.tableMetadataArgs.name; // 表名字
    this.generateTextFieldshash();
  }

  generateTextFieldshash() {
    const textFieldshash = {};
    const { columns = [] } = this.repo.metadata;
    for (const key of columns) {
      const { type, propertyName, givenDatabaseName } = key;
      if (type === 'text') {
        textFieldshash[propertyName] = givenDatabaseName;
      }
    }
    this.textFieldshash = textFieldshash; //  约定json存储 都是text的格式便于数据处理
  }

  async findList(cond: any = {}) {
    const { params = {}, orderBy } = cond;
    const { pageSize = 10, current = 1 } = params;
    const newPageSize = parseInt(pageSize, 10);
    const newCurrent = parseInt(current, 10);
    const limit = newPageSize;
    const skip = newPageSize * (newCurrent - 1);

    const qb = getRepository(this.targetName)
      .createQueryBuilder(this.dbTableName)
      .take(limit)
      .skip(skip);
    if (cond.select) {
      const newSelect = cond.select.map(v => {
        return `${this.dbTableName}.${v}`;
      });
      qb.select(newSelect);
    }
    if (cond.where) {
      const fields = Object.keys(cond.where);
      for (const field of fields) {
        const { type, where } = cond.where[field];
        if (params[field]) {
          if (where) {
            qb[type](where);
          } else {
            // 处理大写 userKey 变成 user_key
            const newField = snakeCase(field);
            // 默认就是等于
            qb[type](`${newField} = "${params[field]}"`);
          }
        }
      }
    }
    if (cond.orderBy) {
      const orderByFields = Object.keys(orderBy)[0];
      qb.orderBy(orderByFields, orderBy[orderByFields]);
    }
    const res: any = await qb.getMany();
    const textFieldshash = this.textFieldshash;
    return dealWithFindRes(res, textFieldshash);
  }

  async update(condition) {
    const toUpdate = await this.findOneById(condition.id);
    const updated = Object.assign({}, toUpdate, condition);
    const textFieldshash = this.textFieldshash;
    const newData = delwithInputData(updated, textFieldshash);
    const data = await this.repo.save(newData);
    return dealWithFindRes(data, textFieldshash);
  }

  async add(condition, unique?) {
    if (unique && isArray(unique)) {
      await this.dealwithUnique(condition, unique);
    }
    const textFieldshash = this.textFieldshash;

    const addData = delwithInputData(condition, textFieldshash);
    return await this.repo.save(addData);
  }

  async findOneById(id) {
    const res: any = await this.repo.findOne(id);

    const textFieldshash = this.textFieldshash;

    return dealWithFindRes(res, textFieldshash);
  }

  async findOne(condition): Promise<any> {
    const res: any = await this.repo.findOne(condition);
    const textFieldshash = this.textFieldshash;
    return dealWithFindRes(res, textFieldshash);
  }

  async find(condition): Promise<any> {
    const res: any = await this.repo.find(condition);
    const textFieldshash = this.textFieldshash;
    return dealWithFindRes(res, textFieldshash);
  }

  async cout(cond: any = {}): Promise<any> {
    const { params = {} } = cond;
    const qb = getRepository(this.targetName).createQueryBuilder(
      this.dbTableName,
    );
    if (cond.where) {
      const fields = Object.keys(cond.where);
      for (const field of fields) {
        const { type, where } = cond.where[field];
        if (where) {
          qb[type](where);
        } else {
          // 默认就是等于
          qb[type](`${field} = ${params[field]}`);
        }
      }
    }
    return await qb.getCount();
  }

  async dealwithUnique(condition, unique) {
    const where = unique.map(v => {
      return {
        [v]: condition[v],
      };
    });
    const res = await this.findOne({
      where,
    });
    if (res) {
      throw new Error(`${unique} 已存在`);
    }
  }
}
