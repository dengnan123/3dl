import { Injectable } from '@nestjs/common'
import { uploadZipAndExecStartShell } from './utils/server'
import { ServerConfig } from './utils/server/interface'

@Injectable()
export class ServerService {
  async deploy(options: ServerConfig) {
    const { host, port, username, password, sourcePath, targetPath } = options
    const hasEmpty = [
      host,
      port,
      username,
      password,
      sourcePath,
      targetPath,
    ].some(v => [undefined, null].includes(v))
    if (hasEmpty) {
      throw new Error(
        'host or port or username or password or sourcePath or targetPath must config',
      )
    }
    return await uploadZipAndExecStartShell(options)
  }
}
