#!/usr/bin/env bash


cd $1



echo "1: "$1
echo "2: "$2

work_path=$(dirname $0)

echo "work_pathwork_path: " ${work_path}
# # 生成压缩包
zip -r "$1/$2.zip"  $1