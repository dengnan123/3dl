import { NodeSSH } from 'node-ssh'
import { ServerConfig } from './interface'
const ssh = new NodeSSH()

//执行远端部署脚本
export async function startRemoteShell(options: ServerConfig) {
  //在服务器上cwd配置的路径下执行sh start.sh脚本来实现发布
  await sshConnect(options)
  await execShell(options)
}

async function sshConnect({ host, username, password, port }) {
  await ssh.connect({
    host,
    username,
    password,
    port: port || 22,
  })
}

async function execShell({ targetPath }) {
  console.log('targetPath', targetPath)
  return new Promise((reslove, reject) => {
    ssh.execCommand('sh start.sh', {
      cwd: targetPath,
      stdin: 'exit',
      onStdout(chunk: any) {
        const str = chunk.toString('utf8')
        console.log(str)
        if (str.includes('running on port')) {
          reslove({ success: true })
        }
      },
      onStderr(chunk: any) {
        console.log('stderr', chunk.toString('utf8'))
        reject(new Error('启动脚本失败'))
      },
    })
  })
}
