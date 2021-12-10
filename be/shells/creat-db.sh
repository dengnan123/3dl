#!/usr/bin/env bash

rm -rf ./src/entities 

# npx typeorm-model-generator -h 3dl.mysql.database.chinacloudapi.cn -d 3dl -p 3306 -u dfocus3dl@3dl -x Admin@123456*3DL --ssl true -e mysql -o ./src/entities --noConfig true --ce pascal --cp camel


npx typeorm-model-generator -h 192.168.10.93 -d test -p 3306 -u root -x Admin@12345678 -e mysql -o ./src/entities --noConfig true --ce pascal --cp camel

