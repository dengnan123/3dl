import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, getManager, Like, In, getRepository } from 'typeorm';
import { User } from '../entities/User';
import { UserRole } from '../entities/UserRole'
import { Role } from '../entities/Role'
import { RolePage } from '../entities/RolePage'
import { RoleFeature } from '../entities/RoleFeature'
import { Page } from '../entities/Page'
import * as moment from 'dayjs';
import { v4 as uuid } from 'uuid';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { QueryRes } from '../interface/service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly photoRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePage)
    private readonly rolePageRepository: Repository<RolePage>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(RoleFeature)
    private readonly roleFeatureRepository: Repository<RoleFeature>,
  ) { }

  async getUserList(condition) {
    const { pageSize = 10, current = 1 } = condition;
    const newPageSize = parseInt(pageSize)
    const newCurrent = parseInt(current)
    const qb: any = getRepository(User)
      .createQueryBuilder('user')
    const skip = newPageSize * (newCurrent - 1);
    const userList = await qb.skip(skip).take(newPageSize).orderBy('create_time', 'DESC').getMany();
    const promissArr = userList.map(async v => {
      const userRoleList = await this.userRoleRepository.find({
        where: {
          userId: v.id,
          status: 1
        },
      })
      const roleList = await this.roleRepository.find({
        where: {
          id: In(userRoleList.map(v => v.roleId))
        }
      })
      return {
        id: v.id,
        userName: v.userName,
        email: v.email,
        status: v.status,
        roleList
      }
    })
    return await Promise.all(promissArr)
  }

  async getUserCount(condition) {
    const { pageSize, current } = condition;
    const qb = getRepository(User)
      .createQueryBuilder('user')
    // .where({
    //   status: 1,
    // });
    return await qb.getCount();
  }

  async batchAdd(arr) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(arr)
      .execute();
  }

  async updateInfo(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: condition.id,
    });
    const updated = Object.assign({}, condition, toUpdate);
    const data = await this.photoRepository.save(updated);
    return data;
  }

  async add(condition) {
    const time = moment().valueOf();
    const newId = uuid();
    const addData = {
      ...condition,
      createTime: time,
      updateTime: time,
      id: newId,
    };

    return await this.photoRepository.save(addData);
  }

  async update(condition) {
    const updateData = {
      ...condition,
      updateTime: moment().valueOf()
    }
    return await this.photoRepository.save(updateData);
  }

  async findOne(id) {
    const data: any = await this.photoRepository.findOne(id);
    return data;
  }

  async findRoleList(dto) {
    const { userId } = dto
    if (!userId) {
      return await this.roleRepository.find({
        where: {
          status: 1
        }
      });
    }
    const roleIdArr = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      },
      select: ['roleId']
    });
    if (!roleIdArr?.length) {
      return []
    }
    return await this.roleRepository.find({
      where: {
        status: 1,
        roleId: In(roleIdArr)
      }
    });
  }




  async addUserRole(dto) {
    const { roleIdList, userId } = dto
    if (!roleIdList?.length) {
      return
    }
    const addArr = roleIdList.map(async v => {
      return await this.userRoleRepository.save({
        roleId: v,
        userId
      })
    })
    await Promise.all(addArr)
  }

  async updateUserRole(dto) {
    //  先删除
    const { userId } = dto
    const userRoleList = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      }
    });
    const promissArr = userRoleList.map(async v => {
      return await this.userRoleRepository.save({
        id: v.id,
        status: 0
      })
    })
    await Promise.all(promissArr)
    // 后新增
    return await this.addUserRole(dto)
  }

  async addRolePage(dto) {
    const { pageIdList = [], roleId, tagIdList = [] } = dto
    const addTagArr = tagIdList.map(async v => {
      return await this.rolePageRepository.save({
        tagId: v,
        roleId
      })
    })
    const addArr = pageIdList.map(async v => {
      return await this.rolePageRepository.save({
        pageId: v,
        roleId
      })
    })
    await Promise.all([...addArr, ...addTagArr])
  }

  async updateRolePage(dto) {
    const { roleId } = dto
    //  先删除
    const rolePageList = await this.rolePageRepository.find({
      where: {
        status: 1,
        roleId
      }
    });
    console.log('rolePageListrolePageList', rolePageList)
    const promissArr = rolePageList.map(async v => {
      return await this.rolePageRepository.save({
        id: v.id,
        status: 0
      })
    })
    await Promise.all(promissArr)
    // 后新增
    return await this.addRolePage(dto)
  }

  async addRole(dto) {
    return await this.roleRepository.save(dto);
  }


  async findRoleDetail(dto) {
    const roleData = await this.roleRepository.findOne(dto);
    const rolePageData = await this.rolePageRepository.find({
      where: {
        status: 1,
        roleId: dto.id
      }
    });
    let tagIdList = []
    let pageIdList = []
    for (const { pageId, tagId } of rolePageData) {
      if (tagId) {
        tagIdList.push(tagId)
      }
      if (pageId) {
        pageIdList.push(pageId)
      }
    }
    const pageList = await this.pageRepository.find({
      where: {
        status: 0,
        id: In(pageIdList)
      },
      select: ['id', 'tagId']
    })
    let pageIdData = {}
    for (const { id, tagId } of pageList) {
      if (!pageIdData[tagId]) {
        pageIdData[tagId] = [id]
      } else {
        pageIdData[tagId] = [...pageIdData[tagId], id]
      }
    }
    const detail = await this.getRoleFeatureDetail(dto)
    return {
      ...roleData,
      tagIdList,
      pageIdData,
      feature: detail?.feature || null
    }
  }


  async getRoleFeatureDetail(dto) {
    const res = await this.roleFeatureRepository.findOne({
      where: {
        roleId: parseInt(dto.id)
      }
    });
    if (res?.feature) {
      res.feature = JSON.parse(res.feature)
    }
    return res
  }

  async getRoleFeatureByRoleId(dto) {
    return await this.roleFeatureRepository.findOne({
      where: {
        roleId: parseInt(dto.id)
      }
    });
  }

  async addOrUpdateRoleFeature(dto) {
    if (dto.feature) {
      dto.feature = JSON.stringify(dto.feature)
    }
    return await this.roleFeatureRepository.save(dto);
  }

  getPageIdList(dto) {
    const { pageIdData } = dto
    let pageIdList = []
    const keys = Object.keys(pageIdData)
    for (const key of keys) {
      pageIdList.push(...pageIdData[key])
    }
    return pageIdList
  }

}
