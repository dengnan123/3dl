import { Controller, Get, Post, Req, Body, Res, Query } from '@nestjs/common'
import { fork } from 'child_process'
import * as path from 'path'
import * as compressing from 'compressing'
import { fetchStream } from './utils/fetch'
import { writeJson, writeShell } from './utils/json'
import { getTsOrJsPath, makeFilePath } from './utils/file'
import { getStartTemp, replaceWithEnv, getFromAndTo } from './utils/shell'
import * as fs from 'fs-extra'
import * as shell from 'shelljs'
import { v4 as uuid } from 'uuid'
import { GitService } from './git.service'
import { ServerService } from './server.service'
import { miniFile } from './utils/min'
import {
  tranfromBranchName,
  reductionBranchName,
  noGitCode,
  hasGitCode,
  getGitFileNameByUrl,
  checkGitPathAndGetData,
} from './utils/git'
import { InitService } from './app.service'

interface DataInterface {
  gitUrl: string
  branch: string
}

@Controller()
export class AppController {
  constructor(
    public service: InitService,
    public gitService: GitService,
    public serverService: ServerService,
  ) { }
  /**
   * 大屏和大屏组件库自动打包
   */
  @Post('auto-build')
  async build(@Query() data: DataInterface, @Body() gitDto: any) {
    console.log('gitDtogitDto>>>>>>>>>', gitDto)
    const { gitUrl } = data
    if (!data.branch) {
      data.branch = 'master'
    }
    if (!gitUrl) {
      return
    }
    const { nodeShellName } = checkGitPathAndGetData(gitUrl)
    const initBuildPath = path.resolve(
      __dirname,
      `./nodeShells/${nodeShellName}.ts`,
    )
    const buildPath = getTsOrJsPath(initBuildPath)
    const gitFileName = getGitFileNameByUrl(gitUrl)
    const storeFilePath = path.resolve(
      __dirname,
      `../../gitFile/${gitFileName}`,
    )
    fs.ensureDirSync(storeFilePath)

    const cpFilesToPath = path.resolve(__dirname, '../../static/dist')
    fs.ensureDirSync(cpFilesToPath)
    const passData = {
      ...data,
      storeFilePath,
      gitUrl,
      gitFileName,
      cpFilesToPath,
    }
    const strData = JSON.stringify(passData)
    console.log('buildPath....', buildPath)
    const forked = fork(buildPath, [strData])
    forked.on('message', changeFileArr => {
      console.log('messsgae from child', changeFileArr)
      // 开始rollup 打包
    })
  }

  /**
   * 通用的插件库自动打包
   */
  @Post('plugin')
  async pluginBuild(@Body() data: any) {
    const { gitUrl } = data
    if (!data.branch) {
      data.branch = 'master'
    }
    const initBuildPath = path.resolve(__dirname, `./nodeShells/pluginBuild.ts`)
    const buildPath = getTsOrJsPath(initBuildPath)
    const gitFileName = getGitFileNameByUrl(gitUrl)
    const storeFilePath = path.resolve(
      __dirname,
      `../../gitFile/${gitFileName}`,
    )
    fs.ensureDirSync(storeFilePath)
  }

  /**
   * 大屏打包下载
   */
  @Post('build')
  async newPageBuild(@Body() dto: any, @Res() res) {
    const {
      replaceJson = {},
      json,
      branch = 'feature/dany/master',
      depyType,
      gitPush,
      gitConfig,
      serverDeploy,
      serverConfig,
    } = dto
    console.log('newBuild....... dto>>>>>>>>>', dto)
    const newBranchName = tranfromBranchName(branch)
    const gitFileName = 'df-visual-big-screen-building-system'
    const baseCodeFilePath = path.resolve(
      __dirname,
      `../../gitFile/${gitFileName}/${newBranchName}/${gitFileName}`,
    )
    if (!fs.existsSync(baseCodeFilePath)) {
      throw new Error('没有打包好的文件')
    }
    const baseUrl = 'https://3dl.dfocus.top/api'
    const tmpFileName = `${uuid()}tmp`
    const basePath = path.resolve(__dirname, '../../')
    const baseTmpFile = `${basePath}/${tmpFileName}`
    const tmpFilePath = `${baseTmpFile}/${gitFileName}` // 临时文件
    const staticResourceStoragePath = path.resolve(__dirname, '../../static') // 静态资源存放路径
    makeFilePath(tmpFilePath)
    const oldDistPath = `${baseCodeFilePath}/dist`
    const tmpDistFilePath = `${tmpFilePath}/dist`
    //把已经打包好的前端dist cp到tmpFilePath里面
    if (!fs.existsSync(oldDistPath)) {
      throw new Error('前端dist文件不存在！！！')
    }
    fs.copySync(oldDistPath, tmpDistFilePath)
    const pageStaticPath = `${tmpDistFilePath}/pageStatic`
    makeFilePath(pageStaticPath)
    makeFilePath(`${pageStaticPath}/dist`)
    makeFilePath(`${pageStaticPath}/maps`)
    makeFilePath(`${pageStaticPath}/themes`)
    makeFilePath(`${pageStaticPath}/page`)
    // 生成页面静态资源
    await this.service.generatePageStatic({
      ...dto,
      baseUrl,
      tmpDistFilePath,
      staticResourceStoragePath,
      baseCodeFilePath,
    })
    miniFile(pageStaticPath)
    const staticReplaceJson = await this.service.getStaticReplaceJson({
      ...dto,
      baseUrl,
    })
    console.log('staticReplaceJsonstaticReplaceJson', staticReplaceJson)
    // 替换某些资源，毕竟静态资源路径，比如loading样式
    await this.service.replaceStaticPath({
      tmpFilePath,
      replaceJson: staticReplaceJson,
    })

    if (depyType === 'dist') {
      await this.service.newDistBuild({
        replaceJson,
        res,
        tmpFilePath,
        basePath,
        tmpFileName,
      })
      return
    }
    // 需要把node相关包 Cp 进来
    const serverDistPath = `${baseCodeFilePath}/serverDist`
    if (!fs.existsSync(serverDistPath)) {
      throw new Error('node文件不存在！！！')
    }
    fs.copySync(serverDistPath, tmpFilePath)
    console.log('cp server success...')
    //给前端pkg增加dpBuildTime
    this.service.addFieldToDistPkg({ tmpFilePath })
    // 处理replaceJson
    writeJson({
      data: replaceJson,
      filePath: tmpFilePath,
      fileName: 'replace.json',
    })
    // 根据json 生成start.sh
    const startStr = getStartTemp(json)
    writeShell({
      str: startStr,
      filePath: baseCodeFilePath,
      fileName: 'start.sh',
    })
    // 压缩成zip
    const endCallback = () => {
      fs.removeSync(`${basePath}/${tmpFileName}`)
    }

    const operations = []
    if (gitPush) {
      // Git 推送
      operations.push(
        this.gitService.uploadDist({
          ...gitConfig,
          tmpFilePath,
          baseTmpFile,
        }),
      )
    }
    if (serverDeploy) {
      const { path, ...restServerConfig } = serverConfig
      /**
       * 本地zip包路径
       */
      const sourcePath = undefined
      // 部署到服务器
      operations.push(
        this.serverService.deploy({
          ...restServerConfig,
          targetPath: path,
          sourcePath,
        }),
      )
    }
    if (!!operations.length) {
      await Promise.all(operations)
      return res.send({
        data: null,
        errorCode: 200,
        message: 'success',
      })
    }
    console.log('大屏下载、、、、、')
    this.service.newStreamDownload({
      res,
      endCallback,
      tmpFilePath,
      basePath,
      tmpFileName,
    })
  }

  /**
   * 只下载大屏静态资源
   */
  @Post('downloadStatic')
  async downloadPageStatic(@Body() dto: any, @Res() res) {
    console.log('downloadPageStatic....... dto>>>>>>>>>', dto)
    const gitFileName = 'df-visual-big-screen-building-system'
    const baseUrl = 'https://3dl.dfocus.top/api'
    const tmpFileName = `${uuid()}tmp`
    const basePath = path.resolve(__dirname, '../../')
    const tmpFilePath = `${basePath}/${tmpFileName}/${gitFileName}` // 临时文件
    const staticResourceStoragePath = path.resolve(__dirname, '../../static') // 静态资源存放路径
    makeFilePath(tmpFilePath)
    const tmpDistFilePath = `${tmpFilePath}/dist`
    const pageStaticPath = `${tmpDistFilePath}/pageStatic`
    makeFilePath(pageStaticPath)
    // 生成页面静态资源
    await this.service.generatePageStatic({
      ...dto,
      baseUrl,
      tmpDistFilePath,
      staticResourceStoragePath,
    })
    // 压缩成zip
    const endCallback = () => {
      fs.removeSync(`${basePath}/${tmpFileName}`)
    }
    this.service.newStreamDownload({
      res,
      endCallback,
      tmpFilePath,
      basePath,
      tmpFileName,
    })
  }

  /**
   * 下载项目对应的插件
   */
  @Post('download/plugin')
  async downloadPlugin(@Body() dto: any, @Res() res) {
    console.log('downloadPageStatic....... dto>>>>>>>>>', dto)
    const { projectName, pluginKeys, downloadPath } = dto
    if (downloadPath) {
      // 直接就下载了
      this.service.streamDownload2({
        res,
        downloadPath,
      })
      return
    }
    const tmpFileName = `${uuid()}tmp`
    const basePath = path.resolve(__dirname, '../../')
    const tmpFilePath = `${basePath}/tmp/${tmpFileName}`
    const staticResourceStoragePath = `${path.resolve(
      __dirname,
      '../../static',
    )}/${projectName}` // 静态资源存放路径
    makeFilePath(tmpFilePath)
    // 复制文件
    for (const pluginKey of pluginKeys) {
      const pluginKeyPath = `${staticResourceStoragePath}/${pluginKey}`
      fs.copySync(pluginKeyPath, `${tmpFilePath}/${pluginKey}`)
    }
    // 压缩成zip
    const endCallback = () => {
      fs.removeSync(`${basePath}/tmp`)
    }
    this.service.streamDownload2({
      res,
      endCallback,
      downloadPath: tmpFilePath,
    })
  }

  /**
   * 上传到对应的git仓库
   */
  @Post('upload/git')
  async uploadDist(@Body() dto: any, @Res() res) {
    // await this.gitService.uploadDist({})
    return res.send({
      data: null,
      errorCode: 200,
      message: 'success',
    })
  }
}
