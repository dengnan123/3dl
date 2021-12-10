import qs from 'query-string';
import { isArray, isObject, isNumber, isString, groupBy, sortBy } from 'lodash';
import * as lodash from 'lodash';
import moment from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday'
import objectSupport from 'dayjs/plugin/objectSupport';
import { getRouterParams, getPageId } from './view';
import {
  setStorageBykey,
  getStorageByKey,
  setSessionStorageBykey,
  getSessionStorageByKey,
} from './storage';
import { getWeatherNameByCode } from './weather';
import { staticPath, isElectronLocalDeploy, isPrivateDeployment } from '@/config';
import { formatQueryDataToTable, formatDataToTable } from '@/helpers/database/table';
import { formatQueryDataToEchart } from '@/helpers/database/echart';
import { downLoadXlsx } from './download';
import API from '@/helpers/api';
import * as sid from 'short-uuid';
const translator = sid();
moment.extend(advancedFormat);
moment.extend(weekOfYear);
moment.extend(objectSupport);
moment.extend(weekday);

/**
 *
 * @returns 生成uid
 */
export const newUuid = () => {
  return translator.new();
};

/**
 * 获取当天的开始时间
 */

export const getDayStartTime = () => {
  return moment()
    .startOf('day')
    .valueOf();
};

/**
 * 获取当天的结束时间
 */
export const getDayEndTime = () => {
  return moment()
    .endOf('day')
    .valueOf();
};

/**
 *
 * 获取当前时间戳
 */
export const getNowTime = () => {
  return moment().valueOf();
};

/**
 * 展示千分位
 * @param {any} num
 * @param {any} decimalNumber 小数位数
 */
export function thousandsDigitFormat(num, decimalNumber) {
  let number = parseFloat((num || '').toString());
  if (number.toString() === 'NaN') {
    number = 0;
  }
  number = ![undefined, null].includes(decimalNumber) ? number.toFixed(decimalNumber) : number;
  const res = number.toString().replace(/\d+/, function(n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
      return $1 + ',';
    });
  });
  return res;
}

const notEmptyObj = data => {
  return data && isObject(data) && JSON.stringify(data) !== '{}';
};

const jumpUrl = data => {
  if (!data) {
    return;
  }
  if (isString(data)) {
    window.location.href = data;
  }
  if (isObject(data) && data.pageId) {
    const { type } = getRouterParams();
    const initData = {
      ...data,
    };
    if (type) {
      initData.type = type;
    }
    if (!isPrivateDeployment) {
      // 不是私有部署 就是用的线上的预览页面 需要加上 /preview NGINX 前缀
      window.location.href = `${window.location.origin}/preview?${qs.stringify(initData)}`;
      return;
    }
    if (isElectronLocalDeploy) {
      // 本地部署 而且是ele环境
      window.location.href = `./index.html?${qs.stringify(initData)}`;
      return;
    }
    // 正常本地部署
    window.location.href = `${window.location.origin}/?${qs.stringify(initData)}`;
  }
};

const delSelfThenInsert = ({ arr = [], key = 'id', value, insertArr = [] }) => {
  let selfIndex;
  const filterArr = arr.filter((v, index) => {
    const nv = isObject(v) ? v[key] : v;
    if (nv !== value) {
      return true;
    }
    selfIndex = index;
    return false;
  });
  filterArr.splice(selfIndex, 0, ...insertArr);
  return filterArr;
};

/**
 *
 * 项目初始化 给windwo上挂载的方法
 */
export const windowUtil = (data = {}) => {
  const isHash = {
    isArray,
    isObject,
    isNumber,
    isString,
    groupBy,
    sortBy,
    delSelfThenInsert,
    lodash,
    getDayStartTime,
    getDayEndTime,
    getRouterParams,
    setStorageBykey,
    getStorageByKey,
    setSessionStorageBykey,
    getSessionStorageByKey,
    notEmptyObj,
    getNowTime,
    downLoadXlsx,
    jumpUrl,
    formatQueryDataToTable,
    formatQueryDataToEchart,
    newUuid,
    formatDataToTable,
    getWeatherNameByCode,
    qs,
    moment,
    thousandsDigitFormat,
    ...data,
  };

  window.DP_ENV = process.env.DP_ENV_KEY;
  window.DP_PROXY_API = API;
  window.DP_STATIC_PATH = `${staticPath}/${getPageId()}`;
  const keys = Object.keys(isHash);
  keys.map(v => {
    window[v] = isHash[v];
    return null;
  });
};

/**
 *
 * @param {Object} data
 */
export const addFuncsToWindow = data => {
  const funcs = Object.keys(data);
  if (!funcs?.length) {
    return;
  }
  for (const func of funcs) {
    window[func] = data[func];
  }
};

/**
 * 挂载在window上的工具类方法
 */
export const windowUtilList = [
  {
    label: 'lodash方法',
    children: [
      {
        label: 'isArray',
        usage: 'isArray(arr)',
        description: 'lodash中的isArray方法',
      },
      {
        label: 'isObject',
        usage: 'isObject(obj)',
        description: 'lodash中的isObject方法',
      },
      {
        label: 'isNumber',
        usage: 'isNumber(num)',
        description: 'lodash中的isNumber方法',
      },
      {
        label: 'isString',
        usage: 'isString(str)',
        description: 'lodash中的isString方法',
      },
      {
        label: 'groupBy',
        usage: 'groupBy',
        description: 'lodash中的groupBy方法',
      },
      {
        label: 'sortBy',
        usage: 'sortBy',
        description: 'lodash中的sortBy方法',
      },
      {
        label: 'lodash',
        usage: 'lodash',
        description: 'lodash对象',
      },
      {
        label: 'delSelfThenInsert',
        usage: 'delSelfThenInsert({arr, key = "id", value, insertArr})',
        description: '删除数据中指定的元素，然后在被删除元素位置上插入新数据',
      },
    ],
  },
  {
    label: '时间类方法',
    children: [
      {
        label: 'getDayStartTime',
        usage: 'getDayStartTime()',
        description: '获取当天开始时间戳',
      },
      {
        label: 'getDayEndTime',
        usage: 'getDayEndTime()',
        description: '获取当天结束时间戳',
      },
      {
        label: 'getNowTime',
        usage: 'getNowTime()',
        description: '获取当前时间戳',
      },
    ],
  },
  {
    label: '浏览器存储',
    children: [
      {
        label: 'setStorageBykey',
        usage: 'setStorageBykey(key, value)',
        description: 'localStorage存储数据, key值会自动拼接pageId前缀',
      },
      {
        label: 'getStorageByKey',
        usage: 'getStorageByKey(key)',
        description: 'localStorage读取数据, key值会自动拼接pageId前缀',
      },
      {
        label: 'setSessionStorageBykey',
        usage: 'setSessionStorageBykey(key, value)',
        description: 'sessionStorage存储数据, key值会自动拼接pageId前缀',
      },
      {
        label: 'getSessionStorageBykey',
        usage: 'getSessionStorageBykey(key)',
        description: 'sessionStorage读取数据, key值会自动拼接pageId前缀',
      },
      {
        label: 'setLang',
        usage: 'setLang(lang)',
        description: 'localStorage设置语言环境，lang与umi_locale保持一致',
      },
    ],
  },
  {
    label: '下载',
    children: [
      { label: 'downLoadXlsx', usage: 'downLoadXlsx(obj, fileName)', description: '下载xlsx表格' },
    ],
  },
  {
    label: 'sql数据处理',
    children: [
      {
        label: 'formatQueryDataToTable',
        usage: 'formatQueryDataToTable({ queryData, columns = [], groupBy = [] })',
        description: '格式化sql查询数据，供antd表格组件使用',
      },
      {
        label: 'formatQueryDataToEchart',
        usage:
          "formatQueryDataToEchart({ queryData, xColumn = '', yColumn = [], groupBy = '', compName: 'Line })",
        description:
          '格式化sql查询数据，供echart的折线图组件使用, compName可用值: Line、Bar、LineAndBar、Pie',
      },
    ],
  },
  {
    label: '其他方法',
    children: [
      {
        label: 'newUuid',
        usage: 'newUuid()',
        description: 'newUuid() 生成短UUID',
      },
      {
        label: 'qs',
        usage: 'qs(str)',
        description: 'npm：query-string',
      },
      {
        label: 'getRouterParams',
        usage: 'getRouterParams()',
        description: '获取url参数',
      },
      {
        label: 'thousandsDigitFormat',
        usage: 'thousandsDigitFormat(num, decimalNumber)',
        description:
          '获取千分位字符串：num-数值，decimalNumber-保留小数位数，decimalNumber为null或者undefined则不对小数位做处理',
      },
      {
        label: 'jumpUrl',
        usage: '内部页面jumpUrl({pageId:11538,b:2}) or 外链 jumpUrl("http://baidu.com") ',
        description: '页面跳转函数，兼容electron静态部署',
      },
      {
        label: 'getWeatherNameByCode',
        usage: 'getWeatherNameByCode(code, type)',
        description: '通过 code 和 type 获取天气图标路径, type: solid | linear, 默认 solid',
      },
    ],
  },
];

/**
 * window上的工具类，替换指定传入参数的值
 * @param paramName 需要替换的参数
 * @param replaceWith 需要替换的值
 */
window.replaceUrlValue = (paramName, replaceWith) => {
  var oUrl = window.location.href.toString();
  var re = new RegExp('(' + paramName + '=)([^&]*)', 'gi');
  var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
  return nUrl;
};
