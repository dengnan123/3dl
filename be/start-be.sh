



#!/bin/bash

echo "============== start screen ================"


DM_PATH=/opt/screen
DM_DIST_NAME=dist
DM_DIST_ZIP_NAME=dist.zip

 rm -rf $DM_PATH/$DM_DIST_NAME __MACOSX
 unzip -d $DM_PATH/ $DM_PATH/$DM_DIST_ZIP_NAME

 chmod 777  -R $DM_PATH/$DM_DIST_NAME/dist

cd $DM_PATH/$DM_DIST_NAME

 PORT=3005  nohup npm run start:prod &

echo "============= end desk =================="

