import { Injectable, OnModuleInit } from '@nestjs/common';
import * as replace from 'replace-in-file';
import * as path from 'path';
import { readReplaceJson, getCmdPath } from './utils/json';
import { isObject } from 'lodash';
import * as jsonfile from 'jsonfile'
const rep: any = replace;

@Injectable()
export class InitService implements OnModuleInit {
  onModuleInit() {
    const ENVS = {
      API_BUILD_HOST_PROD: 'API_BUILD_HOST_PROD',
      API_HOST_PROD: 'API_HOST_PROD',
      UMI_ROUTER_BASE: 'UMI_ROUTER_BASE',
      UMI_PUBLIC_PATH: 'UMI_PUBLIC_PATH',
      SHOW_VCONSOLE: 'SHOW_VCONSOLE',
      API_SOCKET_HOST: 'API_SOCKET_HOST',
    };

    const defEnv = {
      UMI_ROUTER_BASE: '/',
      UMI_PUBLIC_PATH: '',
    };

    replaceWithEnv();


    function resolveFromRoot(...relativePath) {
      const repPath = path.resolve(__dirname, '..', ...relativePath);
      return repPath;
    }

    function replaceWithEnv() {
      const options: any = {
        files: [
          resolveFromRoot('dist/*.js'),
          resolveFromRoot('dist/*.css'),
          resolveFromRoot('dist/*.html'),
          resolveFromRoot('dist/pageStatic/*.js')
        ],
      };

      const keys = Object.keys(ENVS);
      const from = keys.map(key => new RegExp(ENVS[key], 'g'));
      const to = keys.map(key => process.env[key] || defEnv[key]);


      // const pkgPath = `${getCmdPath()}/package.json`
      // const { dpBuildTime } = jsonfile.readFileSync(pkgPath)
      // console.log('dpBuildTime>>>>>>>>', dpBuildTime)
      options.from = from
      options.to = to
      const cus = readReplaceJson();
      if (isObject(cus)) {
        const cusKeys = Object.keys(cus);
        const regKeys = cusKeys.map(key => new RegExp(key, 'g'));
        if (cusKeys.length) {
          const values = cusKeys.map(v => cus[v]);
          options.from = [...options.from, ...regKeys];
          options.to = [...options.to, ...values];
        }
      }



      const cusKeysFrom = getCumKeys().map(key => new RegExp(key, 'g'));
      if (cusKeysFrom.length) {
        const cusValuesTo = getCusValues();
        options.from = [...options.from, ...cusKeysFrom];
        options.to = [...options.to, ...cusValuesTo];
      }
      console.log('options.from', options.from);
      console.log('options.to', options.to);
      rep.sync(options);
    }

    /**
     * 获取包含DP_的环境变量,包含 DP_的代表是大屏自定义的动态环境变量
     */
    function getCusValues() {
      const envData = process.env;
      const keys = getCumKeys();
      return keys.map(key => {
        return envData[key];
      });
    }

    function getCumKeys() {
      const keys = getAllEnvKeys();
      return keys.filter(v => {
        return v.includes('DP_');
      });
    }

    function getAllEnvKeys() {
      const envData = process.env;
      return Object.keys(envData);
    }
  }
}
