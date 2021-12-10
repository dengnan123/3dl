import * as fs from 'fs-extra';
import * as shell from 'shelljs';
import {
    tranfromBranchName,
    doFetchGit,
    getRecentGitDiff,
    feChange,
    beChange,
    getRecentGitChangeFile,
    getSrcPageChangeFile
} from '../utils/git';

async function build() {
    const str = process.argv[2];
    const data = JSON.parse(str); // 获取参数
    const { branch, storeFilePath, gitFileName, buildAll = false } = data;
    console.log('branchbranch', branch);
    const newBranchName = tranfromBranchName(branch);
    const branchPath = `${storeFilePath}/${newBranchName}`;
    try {
        if (fs.existsSync(branchPath)) {
            // 拉去最新代码
            shell.cd(branchPath);
            doFetchGit({
                ...data,
                branchPath,
                hasCode: true,
            });
        } else {
            // 创建文件件，拉去代码
            shell.mkdir('-p', `${branchPath}`);
            shell.cd(branchPath);
            doFetchGit({
                ...data,
                branchPath,
                hasCode: false,
            });
        }
        const filePath = `${branchPath}/${gitFileName}`;
        const gitFileArr = getRecentGitChangeFile(data);
        const changeFileArr = getSrcPageChangeFile(gitFileArr)
        if (!changeFileArr.length) {
            process.send('no change file');
            return
        }
        console.log('changeFileArrchangeFileArr....', changeFileArr)
        console.log('cd filePath....', filePath)
        shell.cd(filePath);
        const initNodeStr =
            'yarn install --production=false && node ./shells/build.js';
        const nodeStr = changeFileArr.reduce((pre, next) => {
            return `${pre} ${next}`;
        }, initNodeStr);
        shell.exec(nodeStr);
        process.send('ok');
    } catch (err) {
        console.log('eeeeeee', err);
        console.log('删除 branchPath', branchPath);
        fs.removeSync(branchPath);
    }
}

build();
