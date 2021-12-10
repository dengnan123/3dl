#!/usr/bin/env bash




zipName="df-be-screen-building-system"
rm -rf ./${zipName}
rm -rf ./${zipName}.zip
rm -rf ./dist


yarn  build


mkdir df-be-screen-building-system


cp -r ./shells ./${zipName}

cp -r ./dist ./${zipName}

cp -r ./package.json ./${zipName}

cp -r ./pm2.json ./${zipName}



cd  ./${zipName}

yarn config get registry

yarn install --production


cd ..

# 生成压缩包
zip -r "${zipName}.zip" ${zipName}