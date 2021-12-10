#!/bin/bash

echo "============== start pc ================"



pid=`ps aux | grep -i 'screen-fe' | grep -v grep | awk {'print $2'}`

if [ ! -n "$pid" ] ;then
  echo "No process found, go ahead as you need"
else
  kill -9 $pid
  echo "Process "$pid" were killed"
fi



DM_PATH=/root/screen
DM_DIST_NAME=df-visual-big-screen-building-system
DM_DIST_ZIP_NAME=df-visual-big-screen-building-system.zip

 rm -r -f $DM_PATH/$DM_DIST_NAME __MACOSX
 unzip -d $DM_PATH/ $DM_PATH/$DM_DIST_ZIP_NAME

chmod 777  -R $DM_PATH/$DM_DIST_NAME/dist


cd $DM_PATH/$DM_DIST_NAME
export PORT=3001 
export UMI_PUBLIC_PATH='' 
export UMI_ROUTER_BASE=/ 
export FENGMAP_PROD=http://3dl.dfocus.top/api/static/fengmap.min.js 
export FE_ORIGIN=http://3dl.dfocus.top 
export API_HOST_PROD=http://3dl.dfocus.top/api
export API_BUILD_HOST_PROD=http://3dl.dfocus.top/build 

npm run start:prod &
echo "============= end pc =================="



