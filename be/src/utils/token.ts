import * as jwt from "jsonwebtoken"
// import { JWT_SECRET } from "../config"

export const getDataByToken = (token): any => {
  return jwt.decode(token, { complete: true })
}
