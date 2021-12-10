# node 打包

# 删除老的serverDist 
rm -rf ./serverDist 
mkdir ./serverDist

cd ./server


yarn && NODE_ENV=production yarn build

cd ..
# 把node 的dist移动到output里面 并且改名字为server
mv ./server/dist ./serverDist
# 把node的依赖包移动到output里面
cp -r ./server/package.json ./serverDist
cd ./serverDist

mv ./dist ./server  # 把dist 重命名 server
# # 安装运行时依赖
yarn install --production




