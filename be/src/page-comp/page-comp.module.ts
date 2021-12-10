import { PageCompService } from "./page-comp.service"
import { PageCompController } from "./page-comp.controller"
import { PageComp } from "../entities/PageComp"
import { CompDataSource } from "../entities/CompDataSource"
import { Module, HttpModule, forwardRef } from "@nestjs/common"
import { diskStorage } from "multer"
import * as path from "path"
import * as moment from "dayjs"
import { basePath, pageStaticPath } from "../utils/file"
import { MulterModule } from "@nestjs/platform-express"
import * as https from "https"
import * as http from "http"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import * as fs from "fs-extra"
import { CompDataSourceService } from "./compDataSource.service"
import { PageModule } from "../page/page.module"

@Module({
  providers: [PageCompService, CompDataSourceService],
  controllers: [PageCompController],
  imports: [
    TypeOrmModule.forFeature([PageComp]),
    TypeOrmModule.forFeature([CompDataSource]),
    HttpModule.register({
      timeout: 40000,
      httpAgent: new http.Agent({ keepAlive: true}),
      httpsAgent: new https.Agent({ keepAlive: true }),
    }),
    forwardRef(() => PageModule),
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination(req, file, cb) {
          const { fileType, pageId } = req.body
          const filePath = `${pageStaticPath}/${pageId}`
          // 检查路径 没有的话就创建一个路径
          fs.ensureDirSync(filePath)
          cb(null, filePath)
        },
        filename: (req, file, cb) => {
          // 在此处自定义保存后的文件名称
          const { saveKey, useName } = req.body
          const { originalname } = file
          const time = moment().valueOf()
          if (useName) {
            return cb(null, originalname)
          }
          const filename = `${time}_${saveKey}_${originalname}`
          return cb(null, filename)
        },
      }),
    }),
  ],
  exports: [PageCompService, CompDataSourceService],
})
export class PageCompModule { }
