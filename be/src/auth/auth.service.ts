import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, getManager, Like, In, getRepository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/User';
import { UserRole } from '../entities/UserRole'
import { RolePage } from '../entities/RolePage'
import { Page } from '../entities/Page'
import { RoleFeature } from '../entities/RoleFeature'
import { merge } from 'lodash'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePage)
    private readonly rolePageRepository: Repository<RolePage>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(RoleFeature)
    private readonly roleFeatureRepository: Repository<RoleFeature>,
  ) { }


  getDataByToken(authorization) {
    return this.jwtService.decode(authorization);
  }

  genenateToken(data) {
    return this.jwtService.sign(data)
  }

  async getUserTagIdListByToken(authorization) {
    const data: any = this.getDataByToken(authorization);
    const userId = data?.userId
    if (!userId) {
      return []
    }
    const roleIdArr = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      }
    });
    if (!roleIdArr?.length) {
      return []
    }
    const pageAndTagList = await this.rolePageRepository.find({
      where: {
        status: 1,
        roleId: In(roleIdArr.map(v => v.roleId))
      }
    });
    let pageIdList = []
    let tagIdList = []
    let newTagList = []
    for (const { pageId, tagId } of pageAndTagList) {
      if (pageId) {
        pageIdList.push(pageId)
      }
      if (tagId) {
        tagIdList.push(tagId)
      }
    }
    if (pageIdList.length) {
      newTagList = await this.pageRepository.find({
        where: {
          status: 0,
          id: In(pageIdList)
        }
      })
    }
    return new Set(Array.from([...tagIdList, ...newTagList.map(v => v.tagId)]))
  }


  async getUserPageIdListByToken(authorization) {
    const data: any = this.getDataByToken(authorization);
    const userId = data?.userId
    if (!userId) {
      return []
    }
    const roleIdArr = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      }
    });
    if (!roleIdArr?.length) {
      return []
    }
    const pageAndTagList = await this.rolePageRepository.find({
      where: {
        status: 1,
        roleId: In(roleIdArr.map(v => v.roleId))
      }
    });
    let pageIdList = []
    let tagIdList = []
    let newPageIdList = []
    for (const { pageId, tagId } of pageAndTagList) {
      if (pageId) {
        pageIdList.push(pageId)
      }
      if (tagId) {
        tagIdList.push(tagId)
      }
    }
    if (tagIdList.length) {
      newPageIdList = await this.pageRepository.find({
        where: {
          status: 0,
          tagId: In(tagIdList)
        },
        select: ['id']
      })
    }
    return [...pageIdList, ...newPageIdList.map(v => v.id)]
  }


  async checkUserPageId({ pageId, authorization }) {
    const isAdmin = this.getIsAdmin(authorization)
    if (isAdmin) {
      return true
    }
    const pageIdList = await this.getUserPageIdListByToken(authorization)
    if (!pageIdList.includes(parseInt(pageId))) {
      return
    }
    return true
  }


  async getUserPageIdListAndTagIdList(authorization) {
    const data: any = this.getDataByToken(authorization);
    const userId = data?.userId
    if (!userId) {
      return {
        pageIdList: [],
        tagIdList: []
      }
    }
    const roleIdArr = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      }
    });
    if (!roleIdArr?.length) {
      return {
        pageIdList: [],
        tagIdList: []
      }
    }
    const pageAndTagList = await this.rolePageRepository.find({
      where: {
        status: 1,
        roleId: In(roleIdArr.map(v => v.roleId))
      }
    });
    let pageIdList = []
    let tagIdList = []
    for (const { pageId, tagId } of pageAndTagList) {
      if (pageId) {
        pageIdList.push(pageId)
      }
      if (tagId) {
        tagIdList.push(tagId)
      }
    }
    return {
      pageIdList,
      tagIdList
    }
  }

  async getUserInfo(authorization) {
    const data: any = this.getDataByToken(authorization);
    const userId = data?.userId
    if (!userId) {
      return
    }
    const userData = await this.userRepository.findOne({
      id: userId
    })
    return {
      userName: userData.userName,
      id: userData.id
    }
  }

  getIsAdmin(authorization) {
    const data: any = this.getDataByToken(authorization);
    return data?.isAdmin
  }

  getOnlyRead(authorization){
    const data: any = this.getDataByToken(authorization);
    return data?.onlyRead
  }


  async getUserFeatures(authorization) {
    const data: any = this.getDataByToken(authorization);
    const userId = data?.userId
    if (!userId) {
      return {

      }
    }
    const roleIdArr = await this.userRoleRepository.find({
      where: {
        status: 1,
        userId
      }
    });
    if (!roleIdArr?.length) {
      return {

      }
    }
    const roleFeatureArr: any = await this.roleFeatureRepository.find({
      where: {
        status: 1,
        roleId: In(roleIdArr.map(v => v.roleId))
      }
    })
    return roleFeatureArr.reduce((pre, next) => {
      const newFeature = next?.feature ? JSON.parse(next.feature) : {}
      return merge({}, pre, newFeature);
    }, {})

  }

}