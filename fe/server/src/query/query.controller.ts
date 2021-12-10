import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueryService } from './query.service';
@Controller('query')
export class QueryController {

  constructor(private readonly queryService: QueryService) { }

  /**
 * node 直连数据库查询
 * @param dto 
 * @returns 
 */
  @Post('/apiProxy')
  async nodeQueryData(@Body() dto: any) {
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
      dto.data_source_id = queryInfo.dataSourceId
      dto.query = queryInfo.query
      dto.parameters = np
    }
    const databseInfo = await this.queryService.getDatabaseInfo({
      id: dto.data_source_id
    })
    const { options } = databseInfo
    //  // 如果有 queryID ,去拿到query,然后和parameters 生成新的query语句
    const query = await this.queryService.getQueryByCond(dto)
    this.queryService.checkSqlOnlySelect(query)
    const newOpts = {
      ...this.queryService.trsOpts(options),
      name: databseInfo.id
    }
    console.log('queryqueryquery>>>>>>>', query)
    return await this.queryService.dyQuery(newOpts, query, {
      pageSize,
      pageNumber,
      disablePaging
    })
  }
}