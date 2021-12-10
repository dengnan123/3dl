import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpService,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { getDataByToken } from "../utils/token"
import { onlyReadUserId } from '../config'


@Injectable()
export class OnlyReadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest()
    const { headers, method, url } = req
    if (this.shouldSkip({ url, method })) {
      return next
        .handle()
        .pipe()
    }
    const { authorization }: any = headers
    const {
      payload: { userId },
    } = getDataByToken(authorization)
    //test1qaz 账号
    if (userId === onlyReadUserId) {
      throw new Error('only read')
    }
    return next
      .handle()
      .pipe()
  }
  shouldSkip({ url, method }) {
    if (method === 'GET') {
      return true
    }
    const urlArr = ['/user/login', '/page-comp/apiProxy','/page-comp/upload','/page/upload','/query/apiProxy']
    if (urlArr.includes(url)) {
      return true
    }
    return false
  }

}
