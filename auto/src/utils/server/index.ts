import { uploadFile } from './upload'
import { startRemoteShell } from './shell'
import { ServerConfig } from './interface'

export async function uploadZipAndExecStartShell(options: ServerConfig) {
  // 上传
  await uploadFile(options)
  // 上传后启动 start.sh
  return await startRemoteShell(options)
}
