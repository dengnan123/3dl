import { getLocale } from 'umi-plugin-react/locale';
import { message } from 'antd';

/**
 * 数据过滤器
 * @param {string} filterFunc filter函数字符串
 * @param {any} data 数据
 * @param {string} des 错误描述信息
 */
export const filterDataFunc = (filterFunc, data, des) => {
  const lang = getLocale();
  try {
    // const filterByRule = filterFunc.replace(/[\r\n]/g, '');
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', 'lang', `${filterFunc}`);
    return filter(data, lang);
  } catch (err) {
    console.error('过滤器代码有误', err.message);
    console.error('描述des', des);
    message.warn('过滤数据失败');
    return data;
  }
};
