import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RedashService } from './redash.service';
import { CreateRedashDto } from './dto/create-redash.dto';
import { UpdateRedashDto } from './dto/update-redash.dto';
import { getQueryInitParameters } from './const'

@Controller('query13')
export class RedashController {
  constructor(private readonly redashService: RedashService) { }

  @Post('save')
  async create(@Body() dto: any) {
    // query 语句保存或者更新
    const initParameters = getQueryInitParameters(dto)
    const newQuery = this.redashService.generateSql(dto.query, initParameters)
    this.redashService.checkSqlOnlySelect(newQuery)
    return await this.redashService.addOrUpdateQuery(dto)
  }

  /**
   * 查询接口
   */
  @Post('apiProxy')
  async queryData(@Body() dto: any) {
    console.log('dddd>>>>>>>>>', dto)
    if (dto.query_id) {
      // 预览页面 参数只有 query_id parameters
      const queryInfo = await this.redashService.getQueryInfoById(dto.query_id)
      if (!queryInfo) {
        throw new Error('no query')
      }
      const initParameters = getQueryInitParameters(queryInfo.data)
      this.redashService.checkParameters(initParameters, dto.parameters)
      dto.data_source_id = queryInfo.data_source_id
      dto.query = queryInfo.query
    }
    if (!dto.data_source_id) {
      throw new Error('data_source_id is must')
    }
    console.log('new dto', dto)
    const data = await this.redashService.doQuery(dto)
    return data?.query_result?.data
  }


  /**
 * node 直连数据库查询
 * @param dto 
 * @returns 
 */
  @Post('/apiProxy/node')
  async nodeQueryData(@Body() dto: any) {
    // 根据数据库ID 拿到数据库配置 信息
    //  const databseInfo = await this.queryService.getDatabaseInfo({
    //    id: dto.data_source_id
    //  })
    //  const { options, name } = databseInfo
    //  console.log('optionsoptionsoptions', options)
    //  // 如果有 queryID ,去拿到query,然后和parameters 生成新的query语句

    //  // 去动态查询
    const defOpts = {
      "host": "192.168.10.93",
      "username": "root",
      "password": "Admin@12345678",
      "database": "screen",
      port: 3306,
      name: 'test'
    }
    //  const testQuery = 'delete from api_host where id=33'
    //  const testQuery = 'SHOW COLUMNS FROM api_host'
    //  const testQuery = 'SHOW tables'
    return await this.redashService.getDbSchemas(defOpts)
  }


  @Post('database')
  async addDatabase(@Body() dto: any) {
    if (dto.id) {
      return await this.redashService.updateDatabase(dto)
    }
    return await this.redashService.addDatabase(dto)
  }

  @Post('/database/test')
  async testDatabase(@Body() dto: any) {
    return this.redashService.testDatabase(dto)
  }

  @Get('/database/:id')
  async getDatabaseInfo(@Param('id') id: string) {
    return await this.redashService.getDatabaseInfo({
      id
    })
  }

  @Get('/datasource')
  async findDatasourceList() {
    return await this.redashService.findDatasourceListAndCount({
      pageSize: 9999
    })
  }

  @Get('/schema/:id')
  async findSchemaList(@Param('id') data_source_id: string) {
    return await this.redashService.getSchemaList(data_source_id)
  }

  @Get('/datasource/:id')
  async getQueryByDatasourceId(@Param('id') id: string) {
    // 查出该数据库里面的所有query语句
    return await this.redashService.findAllQuery({
      dataSourceId: id
    })
  }

  @Patch('/datasource/:id')
  async updateQueryDatasource(@Param('id') id: string, @Body() updateRedashDto: any) {
    // 查出该数据库里面的所有query语句
    const { list: queries } = await this.redashService.findAllQuery({
      dataSourceId: id
    })
    if (!queries.length) {
      return
    }
    // 更新 所有query  语句的 data_source_id 到最新的数据库ID
    await this.redashService.batchUpdateQuery({
      queries,
      dataSourceId: updateRedashDto.dataSourceId
    })
    return {}
  }
}
