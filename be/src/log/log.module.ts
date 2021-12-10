import { Module, forwardRef } from "@nestjs/common"
import { LogService } from "./log.service"
import { LogController } from "./log.controller"
import { UserActionLog } from "../entities/UserActionLog"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { User } from "../entities/User"
import { Tag } from "../entities/Tag"
import { Page } from "../entities/Page"

@Module({
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
  imports: [
    TypeOrmModule.forFeature([UserActionLog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Page]),
  ],
})
export class LogModule {}
