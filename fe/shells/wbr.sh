#!/usr/bin/env bash







output="df-visual-big-screen-building-system"



echo "Dir name is: "${output}

# 删除之前打包好的项目
rm -rf ./${output} ./dist ./${output}.zip 
mkdir ./${output}




yarn install --production=false  &&  yarn wbr

# 移动dist目录到打包目录
cp -r ./dist ./${output}
cp -r ./src/assets ./${output}/dist






# node 打包

cd ./server


yarn && NODE_ENV=production yarn build


cd ..
# 把node 的dist移动到output里面 并且改名字为server

mv ./server/dist ./${output}/server

# 把node的依赖包移动到output里面
cp -r ./server/package.json ./${output}


cd ./${output}

# # 安装运行时依赖
yarn install --production





if [ $? -ne 0 ]; then
    echo "Install runtime dependencies failed, check network first!"
    exit -1
fi

# 退回到打包目录的上一级
cd ..

# 删除老的serverDist 再cp一份
rm -rf ./serverDist 
mkdir ./serverDist
cp -r ./${output}/server ./serverDist  
cp -r ./${output}/node_modules ./serverDist
cp -r ./${output}/package.json ./serverDist
cp -r ./${output}/yarn.lock ./serverDist

zip -r "${output}.zip" ${output}





