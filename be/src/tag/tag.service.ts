import { Injectable } from "@nestjs/common";
import { BaseService } from "../basic/service";
import { InjectRepository } from "@nestjs/typeorm";
import {
  getConnection,
  Repository,
  getManager,
  Like,
  ConnectionOptions,
  getRepository,
  In,
} from "typeorm";
import { Tag } from "../entities/Tag";
import { Loading } from "../entities/Loading";
import { PageCompService } from "../page-comp/page-comp.service";
import { PageService } from "../page/page.service";

@Injectable()
export class TagService extends BaseService {
  constructor(
    @InjectRepository(Tag) repo,
    private pageCompService: PageCompService,
    private pageService: PageService
  ) {
    super(repo);
  }

  async findList(condition) {
    const { pageSize = 10, current = 1, tagIdList, isAdmin } = condition;
    const newPageSize = parseInt(pageSize);
    const newCurrent = parseInt(current);
    const qb: any = getRepository(Tag).createQueryBuilder("tag");
    if (!isAdmin) {
      qb.where({
        id: In(tagIdList),
      });
    }
    const skip = newPageSize * (newCurrent - 1);
    return await qb
      .skip(skip)
      .take(newPageSize)
      .orderBy("create_time", "DESC")
      .getMany();
  }

  async findCompList(condition) {
    const { tagId } = condition;
    const list = await this.pageService.getPageIdListByTagId(tagId);
    /**
     * 返回的是二维数组
     */
    const compPromiseList = list.map(async (n) =>
      this.pageCompService.getAllInfo({
        where: { pageId: n.id },
      })
    );
    const compList = await Promise.all(compPromiseList);

    const compNameHash = {};
    const finalCompList = [];
    compList.forEach((arr) => {
      arr.forEach((n) => {
        if (!compNameHash[n.compName]) {
          compNameHash[n.compName] = true;
          finalCompList.push(n);
          return true;
        }
      });
    });

    return finalCompList;
  }
}
