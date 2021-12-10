import { Injectable } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { Parser } from 'node-sql-parser'
import { readJson, resolveFromRoot, objectString, getCmdPath } from '../utils/json';
import * as sid from 'short-uuid'
const translator = sid()
const parser = new Parser();



@Injectable()
export class QueryService {

  databaseEntityManagerCache = {}
  databaseConnectionCache = {}


  async getQueryInfoById(id) {
    const fileName = `query.json`;
    const data = readJson(fileName, []);
    const res =  data.filter(v => v.id === id)[0]
    return {
      ...res,
      options: JSON.parse(res.options || '{}')
    }
  }

  async getDatabaseInfo(cond) {
    const fileName = `database.json`;
    const data = readJson(fileName, []);
    const info = data.filter(v => v.id === cond.id)[0]
    if (!info) {
      return
    }
    return {
      ...info,
      options: JSON.parse(info.options || '{}')
    }
  }

  async getQueryByCond(cond) {
    const getQueryTemp = async (cond) => {
      if (cond.query) {
        return cond.query
      }
      if (cond.id) {
        const res: any = await this.getQueryInfoById(cond.id)
        return res.query
      }
    }
    const queryTemp = await getQueryTemp(cond)
    return this.generateSql(queryTemp, cond.parameters)
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


  checkSqlOnlySelect(sql) {
    const ast: any = parser.astify(sql);
    const { type } = ast
    if (type !== 'select') {
      throw new Error('query only  support select')
    }
  }





  checkParameters(initParameters = {}, queryParameters = {}) {
    const keys = Object.keys(initParameters)
    for (const key of keys) {
      if (!queryParameters[key]) {
        throw new Error(`${key} field no exit`)
      }
    }
  }



  generateSql(tempQuery, parameters) {
    if (!tempQuery) {
      return
    }
    const arr = this.getRegexValue({
      str: tempQuery, parameters
    })
    const newQuery = this.regexMapReplace(tempQuery, arr)
    return newQuery
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
      const nv = this.getValueByType(_v)
      return {
        match: v,
        replace: nv
      };
    });
  };


  getValueByType = (v) => {
    const { type, value } = v
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
      const { name, value, type } = next;
      return {
        ...pre,
        [name]: {
          value,
          type
        },
      };
    }, {});
  };

  checkAndGetNewParameters(initParameters = {}, queryParameters = {}) {
    const keys = Object.keys(initParameters)
    let newData = {}
    for (const key of keys) {
      if (!queryParameters[key]) {
        throw new Error(`${key} field no exit`)
      }
      newData[key] = {
        type: initParameters[key].type,
        value: queryParameters[key]
      }
    }
    return newData
  }

}