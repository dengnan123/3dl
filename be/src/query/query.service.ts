import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { InjectRepository, InjectEntityManager, InjectConnection } from '@nestjs/typeorm';
import { Repository, getRepository, In, Connection, getConnection, createConnection } from 'typeorm';
import { Database } from '../entities/Database'
import { SqlQuery } from '../entities/SqlQuery'
import { Parser } from 'node-sql-parser'
import * as sid from 'short-uuid'
import * as numeral from 'numeral'
import { isObject, cloneDeep } from 'lodash'
const parser = new Parser();
const translator = sid()
@Injectable()
export class QueryService {
  constructor(
    @InjectRepository(SqlQuery)
    private readonly queryRepository: Repository<SqlQuery>,
    @InjectRepository(Database)
    private readonly databaseRepository: Repository<Database>,
  ) { }


  databaseEntityManagerCache = {}
  databaseConnectionCache = {}
  shouldFilterFields = []



  async getQueryListByIds(ids = []) {
    const qb = getRepository(SqlQuery)
      .createQueryBuilder()
      .where(`id IN (${ids})`)
    return await qb.getMany()
  }


  async getDatabaseListByIds(ids = []) {
    return await getRepository(Database)
      .createQueryBuilder()
      .where(`id IN (${ids})`).getMany()
  }

  async getQueryInfoById(id) {
    const res = await this.queryRepository.findOne(id)
    return {
      ...res,
      options: JSON.parse(res.options || '{}')
    }
  }

  checkAndGetNewParameters(initParameters = {}, queryParameters = {}) {
    console.log('initParameters', initParameters)
    const keys = Object.keys(initParameters)
    let newData = {}
    for (const key of keys) {
      if (initParameters[key].isRequired && !queryParameters[key]) {
        throw new Error(`${key} field is isRequired`)
      }
      newData[key] = {
        type: initParameters[key].type,
        value: queryParameters[key], // 如果 字段是非必填，同时前端也没有传递这个参数，此时的value 就会 undefined,
        isRequired: initParameters[key].isRequired,
      }
    }
    return newData
  }

  getShouldFilterFields(parameters) {
    const keys = Object.keys(parameters)
    console.log('parametersparameters', parameters)
    console.log('keyskeyskeys', keys)
    return keys.filter(key => {
      return parameters[key].value === undefined
    })
  }

  async findDatasourceListAndCount(cond) {
    const { current = 1, pageSize = 12 } = cond
    const qb = getRepository(Database)
      .createQueryBuilder('Database')
    const list: any = await qb.skip((current - 1) * pageSize).take(pageSize).getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }

  async getDatabaseInfo(cond) {
    const data = await this.databaseRepository.findOne(cond.id)
    return {
      ...data,
      options: JSON.parse(data.options || '{}')
    }
  }


  async getSchemaList(databaseId) {
    const databaseInfo = await this.getDatabaseInfo({
      id: databaseId
    })
    const { options, id } = databaseInfo
    return await this.getDbSchemas({
      ...this.trsOpts(options),
      name: id
    })
  }


  async findAllQuery(cond) {
    const { current = 1, pageSize = 9999, dataSourceId } = cond
    const numDataSourceId = parseInt(dataSourceId)
    const qb = getRepository(SqlQuery)
      .createQueryBuilder()
      .where(`data_source_id = ${numDataSourceId}`);
    const list = await qb.skip((current - 1) * pageSize).take(pageSize).getMany();
    const total = await qb.getCount();
    const newList = list.map(v => {
      return {
        ...v,
        options: JSON.parse(v.options || '{}')
      }
    })
    return {
      list: newList,
      total
    }
  }


  async batchUpdateQuery(cond) {
    const { queries = [], dataSourceId } = cond
    const ids = queries.map(v => v.id)
    await getConnection()
      .createQueryBuilder()
      .update(SqlQuery)
      .set({ 'dataSourceId': dataSourceId })
      .where(`id in (${ids})`)
      .execute();
  }



  async addOrUpdateQuery(cond) {
    if (cond.options) {
      cond.options = JSON.stringify(cond.options)
    }
    return this.queryRepository.save(cond)
  }

  async addOrUpdateDatabase(cond) {
    if (cond.options) {
      cond.options = JSON.stringify(cond.options)
    }
    if (cond.id) {
      // 代表更新数据库信息的，那么此时 databaseEntityManagerCache 里面对应的ID 应该失效
      if (this.databaseEntityManagerCache[cond.id]) {
        this.databaseEntityManagerCache[cond.id] = null
        this.databaseConnectionCache[cond.id].close()
      }
    }
    return this.databaseRepository.save(cond)
  }

  async getDyConnection(opts) {
    const defaultOptions = {
      type: "mysql",
      entities: []
    }
    return createConnection({
      ...defaultOptions,
      ...opts,
    });
  }

  async getEntityManager(dbOpts) {
    const { name } = dbOpts
    if (this.databaseEntityManagerCache[name]) {
      return this.databaseEntityManagerCache[name]
    }
    const connection = await this.getDyConnection(dbOpts)
    const entityManager = connection.manager;
    this.databaseEntityManagerCache[name] = entityManager
    this.databaseConnectionCache[name] = connection
    return entityManager
  }

  async testDatabase(cond) {
    const { options } = cond
    const newOpts = this.trsOpts(options)
    const con = await this.getDyConnection({
      ...newOpts,
      name: '_test_'
    })
    if (con) {
      con.close()
    }
    return true
  }

  async dyQuery(dbOpts, rawSql, params) {
    const entityManager = await this.getEntityManager(dbOpts)
    const initLimit = params.pageSize || 10
    const initOffset = params.pageNumber || 1
    const disablePaging = params.disablePaging || false  // 默认查询带分页，如果disbale分页，就不分页
    const getRowData = async () => {
      const endSql = disablePaging ? rawSql : `${rawSql} LIMIT ${initLimit} OFFSET ${(initOffset - 1) * initLimit}`
      console.log('endSql>>>>', endSql)
      return await entityManager.query(endSql);
    }
    const getCount = async () => {
      const countQuerySql = `select count(*) as total from (${rawSql}) as a`
      const data = await entityManager.query(countQuerySql);
      return parseInt(data[0]?.total)
    }
    const [rawData, total] = await Promise.all([getRowData(), getCount()])
    const rawInfo = rawData[0]
    let rows = rawData
    if (!rawInfo?.id) {
      rows = rawData.map(v => {
        return {
          ...v,
          id: translator.new()
        }
      })
    }
    return {
      columns: this.getColumns(rawData),
      rows,
      total
    }
  }



  getColumns(data) {
    if (!data.length) {
      return []
    }
    const v = data[0]
    const keys = Object.keys(v)
    return keys.map(v => {
      return {
        name: v
      }
    })
  }



  async getDbSchemas(dbOpts) {
    const entityManager = await this.getEntityManager(dbOpts)
    const { database } = dbOpts
    const colsQuery = `SELECT TABLE_NAME,TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='${database}'`
    const cols = await entityManager.query(colsQuery);
    const promissArr = cols.map(async v => {
      const { TABLE_NAME } = v
      const q = `select column_name from information_schema.columns where table_schema='${database}' and table_name='${TABLE_NAME}';`
      const cols = await entityManager.query(q);
      return {
        name: TABLE_NAME,
        columns: cols.map(v => v.column_name)
      }
    })
    return Promise.all(promissArr)
  }


  async getQueryByCond(cond) {
    const getQueryTemp = async (cond) => {
      if (cond.query) {
        return cond.query
      }
      if (cond.id) {
        const res = await this.queryRepository.findOne(cond.id)
        return res.query
      }
    }
    const queryTemp = await getQueryTemp(cond)
    return this.generateSql(queryTemp, cond.parameters)
  }



  checkSqlOnlySelect(sql) {
    const ast: any = parser.astify(sql);
    const { type } = ast
    if (type !== 'select') {
      throw new Error('query only  support select')
    }
  }


  checkSqlOnlySelectAndFilterSql(sql) {
    const ast: any = parser.astify(sql);
    const { type, where } = ast
    if (type !== 'select') {
      throw new Error('query only  support select')
    }
    if (!where) {
      return sql
    }
    const newWhere = this.getNewWhere(where)
    const newAst = {
      ...ast,
      where: newWhere
    }
    return parser.sqlify(newAst);
  }


  getNewWhere(where) {
    const newData = cloneDeep(where);
    const dp = (data, pdata?, _key?) => {
      const { left, right } = data;
      const newPdata = cloneDeep(pdata);
      if (!left.operator) {
        if (right.value === 'undefined' && pdata) {
          const keys = Object.keys(data);
          for (const key of keys) {
            pdata[key] = newPdata[_key][key];
          }
        }
      } else {
        dp(left, data, "right");
        dp(right, data, "left");
      }
    };
    dp(newData);
    return this.filterUndefinedAst(newData);
  };

  filterUndefinedAst(data) {
    const leftData = data.left?.column || data.left?.left;
    const rightData = data.right?.value || data.right?.right;
    if (leftData && rightData) {
      return data;
    }
    if (leftData) {
      return data.left;
    }
    if (rightData) {
      return data.right;
    }
    return null;
  };



  generateSql(tempQuery, parameters) {
    if (!tempQuery) {
      return
    }
    const arr = this.getRegexValue({
      str: tempQuery, parameters
    })
    console.log('rep arr', arr)
    const newQuery = this.regexMapReplace(tempQuery, arr)
    return newQuery
  }

  getFilterSql(rawSql, filterFields = []) {
    if (!filterFields.length) {
      return rawSql
    }

  }

  getRegexValue = ({ str, left = '{{', right = '}}', parameters }) => {
    const reg = new RegExp(`${left}(\\w+| )+${right}`, 'g');
    const arr = str.match(reg);
    if (!arr) {
      return [];
    }
    return arr.map((v) => {
      const str1 = v.split(`${left}`)[1];
      const value = str1.split(`${right}`)[0].trim();
      const _v = parameters[value]
      const nv = this.getValueByType(_v, value)
      return {
        match: v,
        replace: nv
      };
    });
  };

  getValueByType = (v, key) => {
    const { type, value } = v
    if (!value) {
      return "'undefined'"
    }
    if (type === 'String') {
      return `'${value}'`
    }
    if (type === 'Number') {
      return value
    }
    // 最后是日期的  日期的现在默认显示字符串
    return `'${value}'`
  }

  regexMapReplace(str, map) {
    map.forEach(function (err, regexItem) {
      str = str.replace(map[regexItem].match, map[regexItem].replace);
    });
    return str;
  }


  trsOpts(data) {
    return {
      "host": data.host,
      "username": data.user,
      "password": data.passwd,
      "database": data.db,
      'port': data.port
    }
  }

  getQueryInitParameters(queryInfo) {
    const parameters = queryInfo?.options?.parameters || [];
    if (!parameters.length) {
      return {};
    }
    return parameters.reduce((pre, next) => {
      const { name, value, type, isRequired } = next;
      return {
        ...pre,
        [name]: {
          value,
          type,
          isRequired
        },
      };
    }, {});
  };
}
