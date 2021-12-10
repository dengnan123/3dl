import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueryService } from './query.service';
import { FilterNoValue } from '../filters/FormateData'
@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) { }
  @Post('save')
  async create(@Body() dto: any) {
    // query 语句保存或者更新
    const initParameters = this.queryService.getQueryInitParameters(dto)
    const newQuery = this.queryService.generateSql(dto.query, initParameters)
    this.queryService.checkSqlOnlySelect(newQuery)
    const dataSourceId = dto['data_source_id']
    const newData = {
      ...dto,
      dataSourceId
    }
    return await this.queryService.addOrUpdateQuery(newData)
  }

  /**
   * node 直连数据库查询
   * @param dto 
   * @returns 
   */
  @Post('/apiProxy')
  async nodeQueryData(@Body(FilterNoValue) dto: any) {
    // 根据数据库ID 拿到数据库配置 信息
    console.log('dtodtodto', dto)
    dto.query_id = dto.query_id || dto.id
    const pageSize = dto?.parameters?.pageSize
    const pageNumber = dto?.parameters?.pageNumber
    const disablePaging = dto?.parameters?.disablePaging
    if (dto.query_id) {
      const queryInfo = await this.queryService.getQueryInfoById(dto.query_id)
      if (!queryInfo) {
        throw new Error('no query')
      }
      const initParameters = this.queryService.getQueryInitParameters(queryInfo)
      const np = this.queryService.checkAndGetNewParameters(initParameters, dto.parameters)
      if (!dto.data_source_id) {
        // 如果前端传了 就用前端的data_source_id，没有就用默认的
        dto.data_source_id = queryInfo.dataSourceId
      }
      dto.query = queryInfo.query
      dto.parameters = np
    }
    const databseInfo = await this.queryService.getDatabaseInfo({
      id: dto.data_source_id
    })
    const { options } = databseInfo
    //  // 如果有 queryID ,去拿到query,然后和parameters 生成新的query语句
    const query = await this.queryService.getQueryByCond(dto)
    console.log('queryqueryquery', query)
    const newQuery = this.queryService.checkSqlOnlySelectAndFilterSql(query)
    const newOpts = {
      ...this.queryService.trsOpts(options),
      name: databseInfo.id
    }
    return await this.queryService.dyQuery(newOpts, newQuery, {
      pageSize,
      pageNumber,
      disablePaging
    })
  }

  @Post('database')
  async addDatabase(@Body() dto: any) {
    return await this.queryService.addOrUpdateDatabase(dto)
  }

  @Post('/ids')
  async getQueryListByIds(@Body() dto: any) {
    const { ids } = dto
    if (!ids.length) {
      return
    }
    return await this.queryService.getQueryListByIds(ids)
  }
  @Post('/database/ids')
  async getDatabaseListByIds(@Body() dto: any) {
    const { ids } = dto
    if (!ids.length) {
      return
    }
    return await this.queryService.getDatabaseListByIds(ids)
  }


  @Get('/datasource')
  async findDatasourceList() {
    return await this.queryService.findDatasourceListAndCount({
      pageSize: 9999
    })
  }


  @Post('/database/test')
  async testDatabase(@Body() dto: any) {
    return this.queryService.testDatabase(dto)
  }

  @Get('/database/:id')
  async getDatabaseInfo(@Param('id') id: string) {
    return await this.queryService.getDatabaseInfo({
      id
    })
  }

  @Get('/schema/:id')
  async findSchemaList(@Param('id') databaseId: string) {
    const schema = await this.queryService.getSchemaList(databaseId)
    return {
      schema
    }
  }


  @Get('/datasource/:id')
  async getQueryByDatasourceId(@Param('id') id: string) {
    // 查出该数据库里面的所有query语句
    return await this.queryService.findAllQuery({
      dataSourceId: id
    })
  }


  @Patch('/datasource/:id')
  async updateQueryDatasource(@Param('id') id: string, @Body() updateRedashDto: any) {
    // 查出该数据库里面的所有query语句
    // const { list: queries } = await this.queryService.findAllQuery({
    //   dataSourceId: id
    // })
    // if (!queries.length) {
    //   return
    // }
    // // 更新 所有query  语句的 data_source_id 到最新的数据库ID
    // await this.queryService.batchUpdateQuery({
    //   queries,
    //   dataSourceId: updateRedashDto.dataSourceId
    // })
    return {}
  }
}
