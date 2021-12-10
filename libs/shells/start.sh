#!/usr/bin/env bash

# 找到本项目进程，杀之
pid=`ps aux | grep -i 'node server --title=screen-fe' | grep -v grep | awk {'print $2'}`

if  [ ! -n "$pid" ] ;then
    echo "No process found, go ahead as you need"
else
    kill -9 $pid
    echo "Process" $pid "were killed"
fi



DM_PATH=/home/dfadmin/webapp
DM_DIST_NAME=df-visual-big-screen-building-system
DM_DIST_ZIP_NAME=$DM_DIST_NAME.zip

 rm -rf $DM_PATH/$DM_DIST_NAME __MACOSX

unzip -d $DM_PATH/ $DM_PATH/$DM_DIST_ZIP_NAME



cd $DM_PATH/$DM_DIST_NAME/server

API_HOST_PROD=http://192.168.0.32/df-uat/screen/ PORT=4303  SOCKET_HOST_PROD=8080 nohup npm run start:prod &