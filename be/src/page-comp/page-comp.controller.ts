import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Query,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  HttpService,
  Req,
} from "@nestjs/common"
import { v4 as uuid } from "uuid"
import * as Agent from "agentkeepalive"
import { getHostByUrl, getHeaderData, dealWithProxyUrl } from "../utils/str"
import { getManager, In } from "typeorm"
import { PageCompService } from "./page-comp.service"
import { PageService } from "../page/page.service"
import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express"
import { PageComp } from "../entities/PageComp"
import { AuthService } from "../auth/auth.service"
import { CompDataSourceService } from "./compDataSource.service"
import {
  REDASH_API_AUTH,
  REDASH_API_HOST,
  LOCAL_API_HOST,
} from "../config/index"
import { isString } from "lodash"
import * as https from "https"
const { HttpsAgent } = Agent
const agent = new https.Agent({
  rejectUnauthorized: false,
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

@Controller("page-comp")
export class PageCompController {
  constructor(
    public service: PageCompService,
    public httpService: HttpService,
    public pageService: PageService,
    private authService: AuthService,
    private compDataSourceService: CompDataSourceService
  ) { }

  // 新增
  @Post()
  async addOrUpdate(@Body() dto: any, @Req() req) {
    // 新增
    const { pageid: pageId, authorization } = req.headers
    const hasAccess = await this.authService.checkUserPageId({
      pageId,
      authorization,
    })
    if (!hasAccess) {
      return
    }
    return await this.service.add(dto)
  }

  // 批量新增
  @Post("batchAdd")
  async batchAdd(@Body() dto: any) {
    // 新增
    return await this.service.batchAdd(dto)
  }

  /**
   *
   * 复制组件到其他页面
   */
  @Post("copyBatchAdd")
  async copyBatchAdd(@Body() dto: any, @Req() req) {
    const { pageid: oldPageId } = req.headers
    const { id, newPageId: pageId } = dto
    const data = await this.service.getAllInfo({
      where: {
        pageId: oldPageId,
        status: 0,
      },
    })
    if (!data.length) {
      return
    }
    const treeData = this.service.dealWithAllData(data)
    const newData = this.service.dealWithCvData({
      initUseCompList: treeData,
      id,
    })
    if (!newData) {
      return
    }
    const { flatArr } = newData
    const addData = flatArr.map((v) => {
      return {
        ...v,
        pageId,
      }
    })
    await this.service.batchAdd(addData)
    await this.service.copyFile(addData, oldPageId)
    return {}
  }

  // 把模板组件加入到新页面中来
  @Post("addCompToOtherPage")
  async addCompToOtherPage(@Body() dto: any) {
    const { id, pageId } = dto
    // ID是组件的ID  pageId 是新大屏

    // 先找到自己
    // 在找到 groupID 为id 的子组件
    const findOneRes = await this.service.findOne(id)

    const { containerDeps } = findOneRes
    // 新增
    return {}
  }

  @Patch()
  async update(@Body() dto: any, @Req() req) {
    const { pageid: pageId, authorization, tagid: tagId } = req.headers
    const hasAccess = await this.authService.checkUserPageId({
      pageId,
      authorization,
    })
    if (!hasAccess) {
      throw new Error("no access")
    }
    // 更新 分两种 一种是单个组件的更新  一种是 Group 更新
    const { child, id, dataSourceId } = dto
    if (!child || !child.length) {
      // 单个组件更新
      const data = await this.service.updateInfo(dto)
      // 处理dataSourceId
      if (dataSourceId) {
        await this.compDataSourceService.updateByDataSourceId({
          compId: id,
          dataSourceId,
          pageId,
          tagId,
        })
      }
      return data
    }
    const newDto = []
    // 成组更新
    const list = this.service.syncGroupId([dto])
    const flatArr = this.service.reductionArr(list)
    const arr = flatArr.map(async (v) => {
      return await this.service.updateInfo(v)
    })

    return await Promise.all(arr)
  }

  // 批量更新
  @Patch("flatArrBatchUpdate")
  async flatArrBatchUpdate(@Body() dto: any, @Req() req) {
    const { pageid: pageId, tagid: tagId } = req.headers
    const arr = dto.map(async (v) => {
      const { id, dataSourceId } = v
      if (dataSourceId) {
        await this.compDataSourceService.updateByDataSourceId({
          compId: id,
          dataSourceId,
          pageId,
          tagId,
        })
      }
      return await this.service.updateInfo(v)
    })
    return await Promise.all(arr)
  }

  // 隐藏组件
  @Patch("hidden")
  async hiddenComp(@Body() dto: any) {
    // 更新 分两种 一种是单个组件的更新  一种是 Group 更新
    const { hiddenIdList, pageId, type } = dto
    const arr = hiddenIdList.map(async (v) => {
      return await this.service.updateInfo({
        id: v,
        isHidden: type === "hidden" ? 1 : 0,
      })
    })
    return await Promise.all(arr)
  }

  // 删除大屏组件
  @Patch("delete")
  async delInfo(@Body() body: any) {
    // console.log('dtodto', dto);

    const { id, type } = body
    const res = await getManager().transaction(
      async (transactionalEntityManager) => {
        // await this.service.updateInfo({
        //   id,
        //   status: 1,
        // });

        const updated = await this.service.dealWithUpdateData({
          id,
          status: 1,
        })
        await transactionalEntityManager.save(PageComp, updated)

        const condition = {
          where: {
            groupId: id,
            status: 0,
          },
        }
        // 找出那些关联此组件的组件
        const findAllRes: any = await this.service.getAllInfo(condition)

        if (findAllRes && findAllRes.length) {
          const arr = findAllRes.map(async (v) => {
            const findRes: any = await this.service.findOne(v.id)
            if (findRes) {
              // 如果 type 是 container是容器组件 那就把所有子组件的groupId变为 null,不是容器组件就正常删除
              let updateInfo
              if (type === "container") {
                updateInfo = {
                  ...findRes,
                  groupId: null,
                }
              } else {
                updateInfo = {
                  ...findRes,
                  status: 1,
                }
              }

              const newUpdated = await this.service.dealWithUpdateData(
                updateInfo
              )
              await transactionalEntityManager.save(PageComp, newUpdated)
            }
            return
          })
          await Promise.all(arr)
        }
      }
    )
    return {}
  }

  /**
   * 批量删除组件
   * @param ids
   */
  @Patch("flatArrBatchDelete")
  async flatArrBatchDelete(@Body() body: any) {
    const { ids } = body
    const promissArr = ids.map(async (id) => {
      return await this.service.updateInfo({
        id,
        status: 1,
      })
    })
    await Promise.all(promissArr)
    await this.compDataSourceService.delCompDataSourceId(ids)
    return {}
  }

  // 上传组件照片
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async UploadedFile(@UploadedFile() file, @Body() dto: any) {
    // 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
    const { filename } = file
    const { id } = dto
    // 把 filename 保存到数据库里面
    return await this.service.updateInfo({
      id,
      style: {
        filename,
      },
    })
  }

  // API 转发
  @Post("apiProxy")
  async apiProxy(@Body() dto: any, @Res() res, @Req() req): Promise<any> {
    const typeHash = {
      POST: 'post',
      PATCH: 'patch',
      PUT: 'put'
    }
    const { dataApiUrl: initUrl, condition = {}, methodType, cusHeaders } = dto
    const dataApiUrl = initUrl.trim()
    const getResData = async () => {
      if (methodType === "linkDatabase") {
        return this.httpService
          .post(`${LOCAL_API_HOST}/query/apiProxy`, condition)
          .toPromise()
      }
      const host = getHostByUrl(dataApiUrl)
      const headerData = getHeaderData({
        host,
        req,
        cusHeaders,
      })
      if (typeHash[methodType]) {
        return await this.httpService[typeHash[methodType]](dataApiUrl, condition, {
          headers: headerData,
        })
          .toPromise()
      }
      const proxyUrl = dealWithProxyUrl({
        condition,
        dataApiUrl,
      })
      console.log("get--------proxyUrl", proxyUrl)
      console.log("get--------headerData", headerData)
      return await this.httpService
        .get(proxyUrl, {
          headers: headerData,
          params: {},
        })
        .toPromise()
    }
    const resData = await getResData()
    const { data }: any = resData
    if (data) {
      // 一般公司内部的接口返回值都有data
      res.send(data)
      return
    }
    // 外部接口可能没有data，就整个返回
    res.send(resData)
  }

  // 取消成组的操作
  @Patch("cancelGroup")
  async cancelGroup(@Body() dto: any) {
    // 首先根据ID 更新  group 状态  然后找到所有groupID 为 id 的组件 把groupID 更新给null
    const { id, childIds } = dto
    console.log("childIdschildIdschildIds", childIds)
    const arr = childIds.map(async (v) => {
      await this.service.updateInfo({
        id: v,
        groupId: null,
      })
      return
    })
    await Promise.all(arr)
    const updateData = {
      id,
      status: 1, // 1 是组件删除状态
    }
    await this.service.updateInfo(updateData)
    return {}
  }

  @Post("doGroup")
  async doGroup(@Body() dto: any) {
    // 新增
    const res = await getManager().transaction(
      async (transactionalEntityManager) => {
        // 新增一个 groupId 的数据
        // const addInfo = {
        //   ...dto,
        //   left: dto.left,
        //   top: dto.top,
        //   width: dto.width,
        //   height: dto.height,
        //   compName: 'Group',
        //   pageId: dto.pageId,
        //   compId: 0,
        //   status: 0,
        // };
        let groupId
        const addRes = await transactionalEntityManager.save(PageComp, dto)
        groupId = addRes.id
        const arr = dto.child.map(async (v) => {
          const updated = await this.service.dealWithUpdateData({
            ...v,
            groupId,
          })
          await transactionalEntityManager.save(PageComp, updated)
        })
        await Promise.all(arr)
        return addRes
      }
    )
    return res
  }

  @Post("batchUpdate")
  async batchUpdate(@Body() dto: any) {
    // 批量更新
    const { compList } = dto
    const updateList = compList
      .reduce((pre, next) => {
        const { child } = next
        if (!child || !child.length) {
          return [...pre, next]
        }
        const list = this.service.syncGroupId([next])
        const flatArr = this.service.reductionArr(list)
        const selfNext = {
          ...next,
        }
        return [...pre, ...flatArr]
      }, [])
      .filter((v) => v.compName !== "Pre" && v.compName !== "Group")

    console.log("更新的数据", updateList.length)
    const arr = updateList.map(async (v) => {
      return await this.service.updateOrAddData({
        ...v,
        groupId: null,
      })
    })
    return await Promise.all(arr)
  }

  // 清空页面所有组件
  @Patch("empty")
  async emptyPage(@Body() dto: any) {
    const { pageId } = dto
    const compList = await this.service.getAllInfo({
      where: {
        pageId,
        status: 0,
      },
    })
    const prommiseArr = compList.map(async (v) => {
      const { id } = v
      await this.service.updateInfo({
        id,
        status: 1,
      })
    })
    await Promise.all(prommiseArr)
    return {}
  }

  /**
   * 批量更新
   */
  @Patch("batchUpdatePageCompStyle")
  async batchUpdatePageCompStyle(@Body() dto: any) {
    const { pageId, newPageId } = dto
    if (!pageId || !newPageId) {
      return
    }
    const compList = await this.service.getAllInfo({
      where: {
        pageId,
        status: 0,
      },
    })
    const prommiseArr = compList.map(async (v) => {
      const { id } = v
      await this.service.updateInfo({
        id,
        pageId: newPageId,
      })
    })
    await Promise.all(prommiseArr)
    return {}
  }

  // 获取redash 所有 query 列表
  @Get("/queries")
  async getRedashQueries(
    @Body() dto: any,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const initUrl = `${REDASH_API_HOST}/api/queries?order=-created_at&page=1&page_size=20`
    const resData = await this.httpService
      .get(initUrl, {
        headers: {
          Authorization: "wUdidFAXmKcsxFkGOzYINVmApRcfTahpETp02ap4",
        },
        httpsAgent: agent,
      })
      .toPromise()
    res.send(resData.data)
  }

  // 获取大屏所有组件列表
  @Get(":pageId")
  async getAll(@Param() dto: any, @Req() req) {
    const { pageid: pageId, authorization } = req.headers
    const hasAccess = await this.authService.checkUserPageId({
      pageId,
      authorization,
    })
    if (!hasAccess) {
      return []
    }
    return this.service.getAllInfoIncludesPageWrap(dto)
  }

  // 获取大屏所有组件列表
  @Get("/flat/:pageId")
  async getFlatList(@Param() dto: any, @Query() query: any) {
    const condition = {
      where: {
        pageId: dto.pageId,
        status: 0,
      },
    }
    const queryData = await this.service.getAllInfo(condition)
    return queryData
  }
}
