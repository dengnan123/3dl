import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpService,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { LogService } from "../log/log.service"
import { AuthService } from "../auth/auth.service"
import { getDataByToken } from "../utils/token"
import { actionTypeObj } from "../utils/log"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(public logService: LogService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest()
    if (this.shouldLog(req)) {
      this.toLog(req)
    }
    const now = Date.now()
    return next
      .handle()
      .pipe()
  }
  shouldLog({ url, method }) {
    if (method === "GET") {
      return false
    }
    const key = this.getActionType({ url, method })
    if (actionTypeObj[key]) {
      return true
    }
    return false
  }

  getActionType({ url, method }) {
    return `${url}/${method}`
  }

  toLog({ url, method, body, headers }) {
    const { pageid: pageId, tagid: tagId, authorization } = headers
    const actionType = this.getActionType({ url, method })
    const bodyStr = JSON.stringify(body)
    const {
      payload: { userId },
    } = getDataByToken(authorization)
    const data = {
      actionType,
      des: bodyStr,
      tagId,
      pageId,
      userId,
    }
    this.logService.create(data)
  }
}
