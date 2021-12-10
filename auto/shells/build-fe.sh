#!/usr/bin/env bash


if [ -n "$1" ]; then
    echo "preview页面打包 $1"
    cd $1
else
    echo "正常打包"
fi


CURRENT_DIR=$(cd $(dirname $0); pwd)

echo "当前路径》》》》》>>>>>>:"$CURRENT_DIR

output="df-visual-big-screen-building-system"



echo "Dir name is: "${output}

# 删除之前打包好的项目
rm -rf ./${output} ./dist ./${output}.zip 
mkdir ./${output}





yarn  && NODE_ENV=production  npm run build:preview

# 移动dist目录到打包目录
cp -r ./dist ./${output}
cp -r ./src/assets ./${output}/dist
cp  ./replace.json ./${output}/replace.json





# node 打包

cd  $1/server



echo "cd server 当前路径》》》》》>>>>>>:" $1/server


yarn && NODE_ENV=production npm run build 


cd ..
# 把node 的dist移动到output里面 并且改名字为server

mv ./server/dist ./${output}/server

# 把node的依赖包移动到output里面
cp -r ./server/package.json ./${output}


cd ./${output}







if [ $? -ne 0 ]; then
    echo "Install runtime dependencies failed, check network first!"
    exit -1
fi

# 退回到打包目录的上一级
cd ..









