import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { Tag } from "../entities/Tag";
import { AuthModule } from "../auth/auth.module";
import { PageCompModule } from "../page-comp/page-comp.module";
import { PageModule } from "../page/page.module";

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => AuthModule),
    forwardRef(() => PageCompModule),
    forwardRef(() => PageModule),
  ],
})
export class TagModule {}
