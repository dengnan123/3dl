import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { UserRole } from '../entities/UserRole'
import { Role } from '../entities/Role'
import { RolePage } from '../entities/RolePage'
import { Page } from '../entities/Page'
import { AuthModule } from '../auth/auth.module'
import { RoleFeature } from '../entities/RoleFeature'


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([UserRole]),
  TypeOrmModule.forFeature([Role]),
  TypeOrmModule.forFeature([RolePage]),
  TypeOrmModule.forFeature([Page]),
  TypeOrmModule.forFeature([RoleFeature]),
  forwardRef(() => AuthModule),
  ],
  exports: [UserService]
})
export class UserModule { }
