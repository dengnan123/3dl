import { ServerConfig } from './interface'
const client = require('scp2')

export async function uploadFile(options: ServerConfig) {
  return new Promise((resolve, reject) => {
    console.log('options', options)
    let { targetPath, sourcePath, host, username, password } = options
    console.log('Uploading...')
    client.scp(
      sourcePath,
      {
        host: host,
        username: username,
        password: password,
        path: targetPath,
      },
      (err: Error) => {
        if (err) {
          console.error(err)
          reject(new Error('Upload failed!'))
          process.exit(1)
        }
        console.log('Upload success!')
        resolve({ success: true })
      },
    )
  })
}
