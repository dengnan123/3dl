import * as minifier from 'html-minifier'
import { minify } from 'uglify-js'
import * as shell from 'shelljs';
import * as fs from 'fs-extra';


export const mini = (filePath) => {
    if (!filePath) {
        throw new Error('filePath is must')
    }
    const { code } = minify(fs.readFileSync(filePath, "utf8"), {
        compress: {}
    })
    if (code) {
        fs.writeFileSync(filePath, code)
    }
}


export const miniFile = (filePath) => {
    const fileArr = fs.readdirSync(filePath)
    for (const fileName of fileArr) {
        if (fileName.includes('.js')) {
            const np = `${filePath}/${fileName}`
            mini(np)
        }
    }
}