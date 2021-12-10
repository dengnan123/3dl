import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
// const replace = require('replace-in-file');
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { isArray } from 'lodash'
import { getStartTemp, replaceWithEnv, newReplaceWithEnv, getFromAndTo } from './utils/shell';
import { readTempAndWriteData, writeDataToTempJs, makeFilePath, writeDataToJson } from './utils/file'
import * as compressing from 'compressing';
import { getMapIdByCompList } from './utils/file'
import * as jsonfile from 'jsonfile'
import *  as  dayjs from 'dayjs'
import { loadingStyle2HtmlStr } from './utils/loading'
import * as shell from 'shelljs';
import { tranformGitUrl, getGitFileNameByUrl, getCurrentBranch } from './utils/git'
import {
    reductionBranchName,
} from './utils/git';

@Injectable()
export class GitService {




    async uploadDist(props) {

        const { tmpFilePath, branch, commit, url: oldUrl,baseTmpFile } = props
        const url = tranformGitUrl(oldUrl)
        const gitFileName = getGitFileNameByUrl(url)
        const name = reductionBranchName(branch);
        console.log('gitFileName--', gitFileName)
        console.log('url--', url)

        /**
         * 打包文件存放路径
         */
        const basePath = path.resolve(__dirname, '../../');
        if (!fs.existsSync(tmpFilePath)) {
            throw new Error('没有打包好的文件');
        }
        const oldDistPath = `${tmpFilePath}`
        /**
         * 上传到git仓库
         */
        // 目标git仓库存放路径
        const gitRepositoryPath = `${basePath}/uploadGitRepository`;

        makeFilePath(gitRepositoryPath);
        const currentGitPath = `${gitRepositoryPath}/${gitFileName}`

        try {
            const gitExist = await fs.existsSync(currentGitPath)
            console.log(gitExist, '======gitExist')
            // 仓库不存在时，克隆代码
            if (!gitExist) {
                const clone = await shell.exec(`cd ${gitRepositoryPath} && git clone ${url}`);
                if (clone?.code !== 0) {
                    console.log(clone, '====clone')
                    throw new Error(clone?.stderr);
                }
            }

            await shell.exec(`cd ${currentGitPath}`)

            const nowBranch = getCurrentBranch(currentGitPath)
            let checkoutBranch
            if (nowBranch === name) {
                console.log('分支一样不切换---')
                checkoutBranch = await shell.exec(`cd ${currentGitPath}  && git pull --rebase`)
            } else {
                // 切换分支
                console.log('切换分支---', name)
                checkoutBranch = await shell.exec(`cd ${currentGitPath} && git checkout ${name} && git pull --rebase`)
            }
            if (checkoutBranch?.code !== 0) {
                console.log('====checkout')
                throw new Error(checkoutBranch?.stderr);
            }

       
            // 替换原路径里的文件
            const filter = (namePath) => {
                return !namePath.includes('node_modules')
            }
            console.log('new file ---', oldDistPath)
            console.log('git flie ---', currentGitPath)
            fs.copySync(oldDistPath, currentGitPath, { filter });
            // git 提交
            const commitText = new Date().toISOString()
            const gitCommit = commit || `fix: Last Change ${commitText}`
            console.log('gitCommitgitCommit------', gitCommit)
            const { stdout, code, stderr } = await shell.exec(`cd ${currentGitPath} && git add . && git commit -m ${gitCommit} && git pull --rebase  && git push`);
            console.log('git ---- stdout---',stdout)
            if (code !== 0 && stderr) {
                throw new Error(stderr);
            }
            fs.removeSync(baseTmpFile)
        } catch (err) {
            console.log('git send error-----', err)
            fs.removeSync(baseTmpFile)
            fs.removeSync(currentGitPath);
            throw new Error(err)
        }




    }



    


}