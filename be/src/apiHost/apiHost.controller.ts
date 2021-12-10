import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  HttpService,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';

import { ApiHostService as Service } from './apiHost.service';
import { PageService } from '../page/page.service';
import { EnvService } from './env.service';

@Controller('apiHost')
export class ApiHostController {
  constructor(
    public service: Service,
    public pageService: PageService,
    public envService: EnvService,
  ) { }

  /**
   * 
   * @param dto 获取数据源列表
   * @returns 
   */
  @Get()
  async findList(@Query() dto: any) {
    return await this.service.findApiList(dto)
  }

  @Post()
  async add(@Body() dto: any) {
    await this.service.add(dto);
    return {};
  }

  @Patch()
  async update(@Body() dto: any) {
    await this.service.nowUseDatabaseChange(dto)
    await this.service.update(dto);
    return {};
  }

  @Patch('delete')
  async delete(@Body() dto: any) {
    /**
     * 如果api  host 被使用,则不能被删除
     */
    const { pageId, id } = dto;
    const dataSourceList = await this.pageService.findAllDataSourceConfigByPageId(
      {
        where: {
          pageId,
          apiHostId: id,
          status: 1,
        },
      },
    );
    if (dataSourceList.length) {
      throw new Error('该数据源已被使用,不能被删除！');
    }
    await this.service.update({
      id,
      status: 0,
    });
    return {};
  }

  @Get('/env')
  async findEnvList(@Query() dto: any) {
    return await this.envService.findEnvList(dto)
  }

  @Post('/env')
  async addEnv(@Body() dto: any) {
    /**
     * 先查看之前是否有数据
     */
    const res = await this.envService.findList({
      where: {
        status: {
          type: 'andWhere',
        },
      },
      params: {
        status: 1,
      },
    });
    await this.envService.add({
      ...dto,
      checked: !res.length ? 1 : 0, // 如果没有数据，那么第一条数据就设置为选中状态
    });
    return {};
  }

  @Patch('/env')
  async updateEnv(@Body() dto: any) {
    await this.envService.update(dto);
    return {};
  }

  @Patch('/env/check')
  async updateEnvCheck(@Body() dto: any) {
    const list = await this.envService.findList({
      where: {
        status: {
          type: 'andWhere',
        },
        tagId: {
          type: 'andWhere',
        },
      },
      params: {
        status: 1,
        ...dto,
      },
    });
    const { id } = dto;
    const oldCheckId = await this.service.getCheckedId({
      tagId: dto.tagId
    })
    const promissArr = list.map(async v => {
      const res = await this.envService.update({
        ...v,
        checked: v.id === id ? 1 : 0,
      });
      return res;
    });
    await Promise.all(promissArr);
    // 如果当前使用的有数据库，需要批量更改SQL 的  datasourceId
    // const apiHostList = await this.service.findApiList({
    //   tagId: dto.tagId
    // })
    // this.service.batchUpdateQueryDataSourceId({
    //   apiHostList, oldCheckId, newCheckId: id
    // })
    return {};
  }

  @Patch('/env/delete')
  async deleteEnv(@Body() dto: any) {
    await this.envService.update({
      ...dto,
      status: 0,
    });
    return {};
  }

  /**
   * 获取 redash 已经设置的数据库列表
   * @param dto 
   * @returns 
   */
  @Get('/datasource')
  async getReadashDatasource(@Param() dto: any) {
    const { id } = dto;

    return {

    };
  }

  /**
   * 更改SQL语句的 所属数据库
   * @param dto 
   * @returns 
   */

  @Get(':id')
  async findOneById(@Param() dto: any) {
    const { id } = dto;
    const res = await this.service.findOneById(id);
    return {
      ...res,
      apiHostId: res.id,
    };
  }
}
