import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Query
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service'
import { User } from '../entities/User';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { ValidationPipe } from './validate.pipe';
import { onlyReadUserId } from '../config'


interface QueryDto {
  userId: string;
}

interface LoginDto {
  account: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(public service: UserService, private authService: AuthService) { }

  // 用户注册
  @Post()
  async addUser(@Body(new ValidationPipe()) dto: CreateUserDto) {
    const params = {
      where: {
        userName: dto.userName,
      },
    };
    const queryData = await this.service.findOne(params);
    if (queryData) {
      throw new HttpException('用户已存在', HttpStatus.FORBIDDEN);
    }
    const res = await this.service.add(dto);
    await this.service.addUserRole({
      ...dto,
      userId: res.id
    })
    return {};
  }


  // 用户列表
  @Get()
  async userList(@Query() dto: any) {
    const list: any = await this.service.getUserList(dto)
    const total = await this.service.getUserCount(dto)
    return {
      list: list.filter(v => v.userName !== 'admin'),
      total
    }
  }


  // 用户登录

  @Post('login')
  async userLogin(@Body() dto: User) {
    const query = {
      where: {
        userName: dto.userName,
        password: dto.password,
      }
    };
    const queryData = await this.service.findOne(query);
    if (!queryData) {
      throw new HttpException('用户账号或者密码不对', HttpStatus.FORBIDDEN);
    }
    const { status } = queryData
    if (!status) {
      throw new HttpException('账号已禁止使用', HttpStatus.FORBIDDEN);
    }
    const isAdmin = dto.userName === 'admin'
    const onlyRead = queryData.id === onlyReadUserId
    const payload = { userId: queryData.id, isAdmin, onlyRead };
    const token = this.authService.genenateToken(payload)
    return {
      token,
    };
  }

  // 用户更新
  @Patch()
  async updateUserRole(@Body() dto: any) {
    await this.service.update(dto);
    if (dto.roleIdList) {
      await this.service.updateUserRole({
        ...dto,
        userId: dto.id
      })
    }
    return {}
  }

  // 用户禁用
  @Patch('disable')
  async disableUser(@Body() dto: any) {
    const { userId } = dto
    await this.service.update({
      ...dto,
      id: userId,
    });
    return {}
  }

  // 角色列表
  @Get('role')
  async getUserRole(@Query() dto: any) {
    const list = await this.service.findRoleList(dto)
    return {
      list,
      total: 0
    }
  }




  // 角色新增
  @Post('role')
  async addRole(@Body() dto: any) {
    const res = await this.service.addRole(dto)
    const { id } = res
    const pageIdList = this.service.getPageIdList(dto)
    await this.service.addRolePage({
      ...dto,
      roleId: id,
      pageIdList
    })
    await this.service.addOrUpdateRoleFeature({
      roleId: id,
      feature: dto.feature
    })
    return {}
  }

  @Patch('role')
  async updateRole(@Body() dto: any) {
    const res = await this.service.addRole(dto)
    const { id } = res
    const pageIdList = this.service.getPageIdList(dto)
    await this.service.updateRolePage({
      ...dto,
      roleId: id,
      pageIdList
    })
    const roleFeatureDetail = await this.service.getRoleFeatureByRoleId({
      id
    })
    await this.service.addOrUpdateRoleFeature({
      id: roleFeatureDetail?.id,
      feature: dto.feature,
      roleId: id
    })
    return {}
  }

  // 获取角色列表
  @Get('/role')
  async getRole(@Query() dto: User) {
    return await this.service.findRoleList(dto)
  }




  // 获取用户信息
  @Get(':userId')
  async getUser(@Param() dto: User) {
    const params = {
      where: {
        userName: dto.userName,
      },
    };
    const queryData = await this.service.findOne(params);
    return queryData;
  }


  // 获取角色详情
  @Get('/role/:id')
  async getRoleDetail(@Param() dto: User) {
    return await this.service.findRoleDetail(dto)
  }



}
