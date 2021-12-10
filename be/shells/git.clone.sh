#!/usr/bin/env bash


if [ -n "$1" ]; then
    echo "包含第一个参数 $1"
else
    echo "没有包含第一参数"
fi

cd $1


# if [ ! -d "df-visual-big-screen-building-system" ]; then
#     echo "文件不存在"
#     git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git
#     cd $1/df-visual-big-screen-building-system
#     git checkout feature/dany/master
   
# else
#   echo '文件存在'
#     cd $1/df-visual-big-screen-building-system
#     rm -rf !(node_modules|.git) 
#     git pull 
# fi









