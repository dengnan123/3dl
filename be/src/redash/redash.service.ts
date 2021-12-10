import { Injectable, HttpService } from '@nestjs/common';
import { CreateRedashDto } from './dto/create-redash.dto';
import { UpdateRedashDto } from './dto/update-redash.dto';
import { Queries } from './entities/Queries'
import { DataSources } from './entities/DataSources'
import { InjectRepository, InjectEntityManager, InjectConnection } from '@nestjs/typeorm';
import { Repository, getRepository, In, Connection, getConnection, createConnection } from 'typeorm';
import { Database } from '../entities/Database'
import { REDASH_API_HOST, REDASH_API_AUTH } from '../config'
import { Parser } from 'node-sql-parser'
const parser = new Parser();

@Injectable()
export class RedashService {
  constructor(
    @InjectRepository(Queries, 'pgConnection')
    private readonly queryRepository: Repository<Queries>,
    public httpService: HttpService,
    @InjectRepository(Database)
    private readonly databaseRepository: Repository<Database>,
  ) { }

  databaseConnectionCache = {}

  create(createRedashDto: CreateRedashDto) {
    return 'This action adds a new redash';
  }

  findAll() {
    return `This action returns all redash`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redash`;
  }

  update(id: number, updateRedashDto: UpdateRedashDto) {
    return `This action updates a #${id} redash`;
  }

  remove(id: number) {
    return `This action removes a #${id} redash`;
  }

  async getSchemaList(data_source_id) {
    const baseUrl = `${REDASH_API_HOST}/api/data_sources/${data_source_id}/schema`
    const res: any = await this.httpService
      .get(baseUrl, {
        headers: {
          Authorization: REDASH_API_AUTH
        },
      })
      .toPromise()
    return res.data
  }

  async addOrUpdateQuery(cond) {
    console.log('REDASH_API_HOST-----', REDASH_API_HOST)
    let baseUrl = `${REDASH_API_HOST}/api/queries`
    if (cond.id) {
      baseUrl = `${baseUrl}/${parseInt(cond.id)}`
    }
    if (cond.id) {
      cond.id = parseInt(cond.id)
    }
    console.log('condcond', cond)
    const res: any = await this.httpService
      .post(baseUrl, cond, {
        headers: {
          Authorization: REDASH_API_AUTH
        },
      })
      .toPromise()
    return res.data
  }

  async findAllQuery(cond) {
    const { current = 1, pageSize = 9999, dataSourceId } = cond
    const qb = getRepository(Queries, 'pgConnection')
      .createQueryBuilder('queries')
      .where(`data_source_id = ${dataSourceId}`);
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
    await getConnection('pgConnection')
      .createQueryBuilder()
      .update(Queries)
      .set({ 'dataSource': dataSourceId })
      .where(`id in (${ids})`)
      .execute();
  }

  async findDatasourceListAndCount(cond) {
    const { current = 1, pageSize = 12 } = cond
    const qb = getRepository(DataSources, 'pgConnection')
      .createQueryBuilder('dataSources')
      .select(['dataSources.id', 'dataSources.name', 'dataSources.type'])
    const list: any = await qb.skip((current - 1) * pageSize).take(pageSize).getMany();
    const total = await qb.getCount();
    return {
      list,
      total
    }
  }


  async baseHttp({ url, cond, method }) {
    const newUrl = `${REDASH_API_HOST}${url}`
    if (method === 'get') {
      const res: any = await this.httpService.get(newUrl, {
        headers: {
          Authorization: REDASH_API_AUTH
        },
      })
        .toPromise()
      return res.data
    }
    const res: any = await this.httpService[method](newUrl, cond, {
      headers: {
        Authorization: REDASH_API_AUTH
      },
    })
      .toPromise()
    return res.data
  }

  async getQueryId(id) {
    if (!id) {
      throw new Error('id is must')
    }
    const data = await this.baseHttp({
      url: `/api/jobs/${id}`,
      cond: {},
      method: 'get'
    })
    const status = data?.job?.status
    const query_result_id = data?.job?.query_result_id
    if (status === 4) {
      throw new Error(data?.job?.error)
    }
    if (query_result_id) {
      return query_result_id
    }
    return await this.getQueryId(data?.job?.id)
  }
  async doQuery(cond) {
    const jobData = await this.baseHttp({
      url: `/api/query_results`,
      cond,
      method: 'post'
    })
    if (jobData.query_result) {
      return jobData
    }
    const jobId = jobData?.job?.id
    if (!jobId) {
      throw new Error('no jobId')
    }
    const queryId = await this.getQueryId(jobId)
    return await this.baseHttp({
      url: `/api/query_results/${queryId}`,
      cond: {},
      method: 'get'
    })
  }

  async getQueryInfoById(id) {
    return await this.baseHttp({
      url: `/api/queries/${id}`,
      cond: {},
      method: 'get'
    })
  }

  checkParameters(initParameters = {}, queryParameters = {}) {
    const keys = Object.keys(initParameters)
    for (const key of keys) {
      if (!queryParameters[key]) {
        throw new Error(`${key} field no exit`)
      }
    }
  }

  async addDatabase(cond) {
    return await this.baseHttp({
      url: `/api/data_sources`,
      cond,
      method: 'post'
    })
  }

  async updateDatabase(cond) {
    return await this.baseHttp({
      url: `/api/data_sources/${cond.id}`,
      cond,
      method: 'post'
    })
  }
  async getDatabaseInfo(cond) {
    return await this.baseHttp({
      url: `/api/data_sources/${cond.id}`,
      cond,
      method: 'get'
    })
  }


  async testDatabase(cond) {
    return await this.baseHttp({
      url: `/api/data_sources/${cond.id}/test`,
      cond,
      method: 'post'
    })
  }

  async getDyConnection(opts) {
    // const defaultOptions = getDefaultOptions()
    const defaultOptions = {
      type: "mysql",
      entities: []
    }
    return createConnection({
      ...defaultOptions,
      ...opts,
    });
  }

  async dyQuery(dbOpts, rawSql) {
    const connection = await this.getDyConnection(dbOpts)
    const entityManager = connection.manager;
    const rawData = await entityManager.query(rawSql);
    return rawData
  }

  async getDbSchemas(dbOpts) {
    const connection = await this.getDyConnection(dbOpts)
    const entityManager = connection.manager;
    const tables = await entityManager.query('show tables');
    const promissArr = tables.map(async v => {
      if (v.Tables_in_screen === 'database' || v.Tables_in_screen === 'replace') {
        return {}
      }
      const colsQuery = `SHOW COLUMNS FROM ${v.Tables_in_screen}`
      const cols = await entityManager.query(colsQuery);
      return {
        name: v.Tables_in_screen,
        columns: cols.map(v => v.Field)
      }
    })
    return Promise.all(promissArr)
  }

  checkSqlOnlySelect(sql) {
    const ast: any = parser.astify(sql);
    const { type } = ast
    if (type !== 'select') {
      throw new Error('query only  support select')
    }
  }
  async saveOrUpdateDatabase(cond) {
    if (cond.options) {
      cond.options = JSON.stringify(cond.options)
    }
    return await this.databaseRepository.save(cond)
  }

  async findDatabase(id) {
    const data = await this.databaseRepository.findOne(id)
    if (data.options) {
      return {
        ...data,
        options: JSON.parse(data.options)
      }
    }
    return data
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
      return {
        match: v,
        replace: parameters[value],
      };
    });
  };

  regexMapReplace(str, map) {
    map.forEach(function (err, regexItem) {
      str = str.replace(map[regexItem].match, map[regexItem].replace);
    });
    return str;
  }


}
