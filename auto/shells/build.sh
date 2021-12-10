#!/usr/bin/env bash




zipName="auto-build"
rm -rf ./${zipName}
rm -rf ./${zipName}.zip
rm -rf ./dist


npm run build


mkdir auto-build


cp -r ./shells ./${zipName}

cp -r ./dist ./${zipName}

cp -r ./package.json ./${zipName}

cp -r ./pm2.json ./${zipName}



cd  ./${zipName}

yarn install --production


cd ..

# 生成压缩包
zip -r "${zipName}.zip" ${zipName}