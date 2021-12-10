import API from '@/helpers/api';
import BuildApi from '@/helpers/api/buildApi';
import { API_BUILD_HOST } from '@/config';
import { postDownload } from '@/helpers/download';

// 获取配置列表
export function fetchRepaceJsonConfigList() {
  const res = API.get(`/replace?pageSize=999`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}

// 打包
export function buildPage(data) {
  if (data?.gitPush || data?.serverDeploy) {
    console.log(data, '===gitPush--data');
    return BuildApi.post('/build', data);
  }

  return postDownload({
    baseUrl: API_BUILD_HOST,
    apiRoute: '/build',
    condition: data,
  });
}

// 获取打包脚本列表
export function fetchStartShList() {
  const res = API.get(`/startTemp`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}

// // 测试打包
// export function uploadGitRepository(data) {
//   return CAPI(API_BUILD_HOST).post('/upload/git', data);
// }
