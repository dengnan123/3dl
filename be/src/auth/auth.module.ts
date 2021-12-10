import { JwtModule } from "@nestjs/jwt"
import { Module, HttpModule, Global } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { User } from "../entities/User"
import { UserRole } from "../entities/UserRole"
import { RolePage } from "../entities/RolePage"
import { Page } from "../entities/Page"
import * as ms from "ms"
import { RoleFeature } from "../entities/RoleFeature"
import { JWT_SECRET } from "../config"

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: ms("7 days"),
      },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([RoleFeature]),
    TypeOrmModule.forFeature([Page]),
    TypeOrmModule.forFeature([RolePage]),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
