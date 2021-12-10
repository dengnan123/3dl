import { Injectable, OnModuleInit } from '@nestjs/common';
// const replace = require('replace-in-file');
import * as replace from 'replace-in-file';
import * as path from 'path';

@Injectable()
export class InitService implements OnModuleInit {
  onModuleInit() {
    console.log(`系统初始化操作`);
  }
}
