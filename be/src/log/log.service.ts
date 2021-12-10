import { Injectable } from "@nestjs/common"
import { CreateLogDto } from "./dto/create-log.dto"
import { UpdateLogDto } from "./dto/update-log.dto"
import { UserActionLog } from "../entities/UserActionLog"
import { User } from "../entities/User"
import { Tag } from "../entities/Tag"
import { Page } from "../entities/Page"
import { InjectRepository } from "@nestjs/typeorm"
import * as moment from "dayjs"
import { Repository, getRepository, In, getConnection } from "typeorm"
import { actionTypeObj } from "../utils/log"
import { omit } from "lodash"

@Injectable()
export class LogService {
  constructor() { }

  async create(createLogDto: any) {
    const saveData = {
      ...createLogDto,
      createTime: moment().valueOf(),
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserActionLog)
      .values([saveData])
      .execute()
  }

  async findAll(condition) {
    const { pageNumber = 1, pageSize = 10, tagId, startTime, endTime, pageId } = condition
    const qb: any = getRepository(UserActionLog).createQueryBuilder()
    if (startTime && endTime) {
      const st = parseInt(startTime)
      const et = parseInt(endTime)
      qb.andWhere(`create_time BETWEEN "${st}" AND "${et}"`)
    }
    if (tagId) {
      qb.andWhere(`tag_id  = "${tagId}"`);
    }
    const list = await qb
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy("id", "DESC")
      .getMany()
    const total = await qb.getCount()
    const pList = list.map(async (v) => {
      const userInfo = await this.getUserInfoById(v.userId)
      const pageInfo = await this.getPageInfoById(v.pageId)
      const tagInfo = await this.getTagInfoById(v.tagId)
      return {
        ...v,
        actionName: actionTypeObj[v.actionType],
        userName: userInfo?.userName,
        pageName: pageInfo?.name,
        tagName: tagInfo?.name
      }
    })
    const newList = await Promise.all(pList)
    return {
      list: newList,
      total,
    }
  }

  async getUserInfoById(id) {
    return await getRepository(User).createQueryBuilder().where({
      id
    }).getOne()
  }
  async getTagInfoById(id) {
    return await getRepository(Tag).createQueryBuilder().where({
      id
    }).getOne()
  }

  async getPageInfoById(id) {
    return await getRepository(Page).createQueryBuilder().where({
      id
    }).getOne()
  }

  findOne(id: number) {
    console.log("ididid", id)
    return `This action returns a #${id} log`
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`
  }

  remove(id: number) {
    return `This action removes a #${id} log`
  }
  async addActionLog() {
    console.log("lllllllllll")
  }

  getActionType() { }
}
