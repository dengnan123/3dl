import { getLocaleMode } from '@/helpers/storage';
import compilers from '@/helpers/babel/compilers';
import { message, notification } from 'antd';
import UmdLoader from '@/components/UmdLoader';
import ErrorWrap from '@/components/ErrorWrap';
import { getCompScriptInfo } from '@/helpers/static';
import { isArray } from 'lodash';
import script from 'scriptjs';
import { mapServerURL, mapThemeURL, staticPath } from '@/config';
import { flattenArrByKey } from '@/helpers/arrayUtil';
import PurCompLib from '@/components/PurCompLib';
import ojectPath from 'object-path';

export const getTransform = ({ type, pageWidth, pageHeight }) => {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const widthPer = width / pageWidth;
  const heightPer = height / pageHeight;
  if (type === 'heightSpread') {
    return `scale(${heightPer})`;
    // return `scale(${widthPer})`;
  }
  if (type === 'widthSpread') {
    // return `scale(${heightPer})`;
    return `scale(${widthPer})`;
  }
  return `scale(${widthPer},${heightPer})`;
};

export const getBaseTransform = ({ type, selfWidth, selHeight, PWidth, PHeight }) => {
  if (selfWidth < PWidth) {
    return `scale(1,1)`;
  }
  const widthPer = selfWidth / PWidth;
  const heightPer = selHeight / PHeight;
  if (type === 'heightSpread') {
    return `scale(${heightPer})`;
  }
  if (type === 'widthSpread') {
    return `scale(${widthPer})`;
  }
  return `scale(${widthPer},${heightPer})`;
};

export const tranformPxToVw = (arr, pageWidth) => {
  return arr.map(v => {
    const { child, width, left, childComps, basicStyle } = v;
    const vwWidth = traVw(width, pageWidth);
    const vwLeft = traVw(left, pageWidth);
    // 判断组件是否禁止缩放
    const baseInfo = {
      ...v,
      width: basicStyle.forbidWidthScale ? width : `${vwWidth}vw`,
      left: basicStyle.forbidPositionScale ? left : `${vwLeft}vw`,
    };
    if (child && child.length) {
      return {
        ...baseInfo,
        child: tranformPxToVw(child, pageWidth),
      };
    }
    if (childComps && childComps.length) {
      return {
        ...baseInfo,
        childComps: tranformPxToVw(childComps, pageWidth),
      };
    }
    return baseInfo;
  });
};

export const traVw = (selfWidth, pageWidth) => {
  return (selfWidth / pageWidth) * 100;
};

export const getGirdMaxY = list => {
  return list.reduce((pre, next) => {
    const { h = 0 } = next;
    return pre + h;
  }, 0);
};

// 数据过滤器
export const filterDataFunc = ({
  filterFunc,
  filterFuncEs5Code,
  data,
  des,
  otherCompParams,
  basicStyle,
  style,
  condition,
}) => {
  const lang = getLocaleMode();
  // try {
  //   // eslint-disable-next-line no-new-func
  //   const filter = new Function(
  //     'data',
  //     'lang',
  //     'otherCompParams',
  //     'basicStyle',
  //     'style',
  //     'condition',
  //     `${filterFuncEs5Code}`,
  //   );
  //   return filter(data, lang, otherCompParams, basicStyle, style, condition);
  // } catch (err) {
  //   console.log('Es5Code...error message', err.message);
  //   console.log(des);
  //   console.log('filterFunc', filterFunc);
  //   return data;
  // }
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function(
      'data',
      'lang',
      'otherCompParams',
      'basicStyle',
      'style',
      'condition',
      `${filterFunc}`,
    );
    return filter(data, lang, otherCompParams, basicStyle, style, condition);
  } catch (err) {
    // 如果报错，可能是浏览器版本太低，如果有filterFuncEs5Code 代码 就走一遍new Function
    if (filterFuncEs5Code) {
      try {
        // eslint-disable-next-line no-new-func
        const filter = new Function(
          'data',
          'lang',
          'otherCompParams',
          'basicStyle',
          'style',
          'condition',
          `${filterFuncEs5Code}`,
        );
        return filter(data, lang, otherCompParams, basicStyle, style, condition);
      } catch (err) {
        console.log('Es5Code...error message', err.message);
        console.log('Es5Code', filterFuncEs5Code);
        return data;
      }
    }
    return data;
  }
};

export const filterDataEs5Func = ({
  filterFuncEs5Code,
  data,
  otherCompParams,
  basicStyle,
  style,
  errorDefaultData = {},
}) => {
  const lang = getLocaleMode();
  if (filterFuncEs5Code) {
    try {
      // eslint-disable-next-line no-new-func
      const filter = new Function(
        'data',
        'lang',
        'otherCompParams',
        'basicStyle',
        'style',
        `${filterFuncEs5Code}`,
      );
      return filter(data, lang, otherCompParams, basicStyle, style);
    } catch (err) {
      console.log('Es5Code...error message', err.message);
      console.log('Es5Code', filterFuncEs5Code);
      return errorDefaultData;
    }
  }
};

const getNewDataByAliasList = (dataSource, dataSourceIdList, childDataSourceName) => {
  const obj = {};
  for (const dataSourceId of dataSourceIdList) {
    const key = childDataSourceName ? `${dataSourceId}.${childDataSourceName}` : dataSourceId;
    obj[dataSourceId] = ojectPath.get(dataSource, key, {});
  }
  return obj;
};

const getNewData = ({ dataSource, dataSourceId, childDataSourceName, compName }) => {
  if (!isArray(dataSourceId)) {
    const key = childDataSourceName ? `${dataSourceId}.${childDataSourceName}` : dataSourceId;
    return ojectPath.get(dataSource, key, {});
  }
  if (dataSourceId.length === 1) {
    const key = childDataSourceName ? `${dataSourceId[0]}.${childDataSourceName}` : dataSourceId[0];
    return ojectPath.get(dataSource, key, {});
  }
  return getNewDataByAliasList(dataSource, dataSourceId, childDataSourceName);
};

export const getNewOtherCompParams = ({ otherCompParams, id }) => {
  return ojectPath.get(otherCompParams, id, {});
};

// 处理动态数据
// childDataSourceName 这个字段已经弃用， 现在是为了兼容以前的页面
export const getFetchData = (
  {
    filterFunc,
    filterFuncEs5Code,
    openHighConfig,
    compName,
    dataSourceId,
    aliasName,
    useDataType,
    type,
    id,
    childDataSourceName,
  },
  otherCompParams,
  dataSource,
) => {
  // dataSource 是整个preview 的model
  if (useDataType !== 'API') {
    return null;
  }
  if (!dataSource) {
    return null;
  }

  const newData = getNewData({ dataSource, dataSourceId, type, childDataSourceName, compName });

  if (openHighConfig && filterFunc) {
    // 把其他组件传递的参数合并到数据源里面
    const des = `组件过滤器组件名字-----${compName}`;
    return filterDataFunc({
      filterFunc,
      filterFuncEs5Code,
      data: newData,
      des,
      otherCompParams,
    });
  }
  return newData;
};

export const getData = ({ mockData, staticData, apiData = {}, useDataType, isPreview }) => {
  if (!isPreview) {
    if (mockData && JSON.stringify(mockData) !== '{}') {
      return mockData;
    }
    return staticData;
  }
  if (useDataType === 'API') {
    return apiData || {};
  }
  if (mockData && JSON.stringify(mockData) !== '{}') {
    return mockData;
  }
  return staticData;
};

export const getMockData = (mockData, staticData) => {
  if (mockData && JSON.stringify(mockData) !== '{}') {
    return mockData;
  }
  return staticData;
};

class CompInfoInstantClass {
  state = {};

  getCompStaticDataByCompName(compName) {
    return this.state[compName];
  }

  setCompStaticDataByCompName(props) {
    const { compName, staticData } = props;
    this.state[compName] = staticData;
  }
}

export const CompInfoInstant = new CompInfoInstantClass();

export const checkJsCode = codeStr => {
  const data = {};
  const lang = '';
  const otherCompParams = {};
  const basicStyle = {};
  const style = {};
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function(
      'data',
      'lang',
      'otherCompParams',
      'basicStyle',
      'style',
      'condition',
      codeStr,
    );
    filter(data, lang, otherCompParams, basicStyle, style);
  } catch (err) {
    return err.message;
  }
  const funcStr = `function test() {
    ${codeStr}
  }
  `;
  const { errors } = compilers.compile(funcStr);
  if (errors.length) {
    console.log('errorserrors', errors);
    message.warn('语法有误');
    return errors;
  }
  return false;
};

export const transformCode = codeStr => {
  const data = {};
  const lang = '';
  const otherCompParams = {};
  const basicStyle = {};
  const style = {};
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', 'lang', 'otherCompParams', 'basicStyle', 'style', codeStr);
    filter(data, lang, otherCompParams, basicStyle, style);
  } catch (err) {
    console.log('validateCallback err......', err.message);
    return;
  }
  const es5Code = compileCodeToEs5(codeStr);
  return es5Code;
};

export const compileCodeToEs5 = codeStr => {
  const funcStr = `function test() {
    ${codeStr}
  }
  `;
  const { code, errors } = compilers.compile(funcStr);
  if (errors.length) {
    throw new Error(errors);
  }
  // 先把 function test() { 代码去掉
  // const codeArr = code.split('function test() {');
  const codeArr = code.replace('function test() {', '');
  const str1 = codeArr;
  // 再把 } 去掉
  return str1.substring(0, str1.length - 1);
};

// compileModalCode 直接编译 不用变成 function test() 再编译
export const compileModalCode = codeStr => {
  if (!codeStr) {
    return;
  }
  const { code, errors } = compilers.compile(codeStr);
  if (errors.length) {
    throw new Error(errors);
  }
  return code;
};

export const getCodeFuncNames = () => {
  return compilers.getNames();
};

export const addEs5CodeToData = (data, keys) => {
  let newData = {
    ...data,
  };
  const getNewData = key => {
    const newKey = `${key}Es5Code`;
    const oldCode = data[key];
    if (!oldCode) {
      newData[newKey] = '';
      return;
    }
    const es5Code = compileCodeToEs5(oldCode);
    newData[newKey] = es5Code;
  };
  if (!isArray(keys)) {
    getNewData(keys);
  } else {
    for (const key of keys) {
      getNewData(key);
    }
  }
  return newData;
};

export const checkAndGetJsonByJsonStr = jsonStr => {
  let obj = {};
  let isError = false;
  try {
    obj = JSON.parse(jsonStr);
  } catch (err) {
    isError = true;
  }
  if (isError) {
    notification.open({
      message: 'Error',
      description: 'json格式有误',
    });
    return;
  }
  return obj;
};

export const checkJsonIsOk = jsonStr => {
  let isError = false;
  try {
    JSON.parse(jsonStr);
  } catch (err) {
    isError = true;
  }
  if (isError) {
    notification.open({
      message: 'Error',
      description: 'json格式有误',
    });
    return false;
  }
  return true;
};

export const getCompLib = props => {
  return <PurCompLib {...props}></PurCompLib>;
};

export const getCompConfig = props => {
  const { compName } = props;
  const { compConfigSrc, loaderConfigName } = getCompScriptInfo(compName);
  const umdLoaderProps = {
    ...props,
    url: compConfigSrc,
    name: loaderConfigName,
  };
  const Lib = (
    <ErrorWrap>
      <UmdLoader {...umdLoaderProps}>
        <p>配置加载中...</p>
      </UmdLoader>
    </ErrorWrap>
  );
  return Lib;
};

export const getCompStaticData = async compName => {
  const { compStaticDataSrc, loaderStaticDataName } = getCompScriptInfo(compName);
  return await loadScript(compStaticDataSrc, loaderStaticDataName);
};

export const loadScript = (url, name) => {
  return new Promise((reslove, reject) => {
    script(url, err => {
      const target = window[name];
      if (target) {
        reslove(target);
      } else {
        reslove({});
      }
    });
  });
};

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * msg : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content, msg) {
  const aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (msg == null) {
    message.success('复制成功');
  } else {
    message.success(msg);
  }
}

/**
 * 获取组件的itemProps
 * v: 组件的基本信息
 * dataSource: preview页面的model
 * onChange: onChange事件
 * lang：当前语言环境
 * pageConfig: 当前页面的基本信息
 * otherCompParams：所有组件的往外传递条件的集合
 * updateCompsHiddenOrShow: 控制组件显示隐藏事件
 * onClick:onClick事件
 */
export const getCompItemProps = props => {
  const { v, onChange, lang, pageConfig = {}, updateCompsHiddenOrShow, isPreview } = props;
  const { mapId, mockData = {}, style = {}, useDataType, fetchData, pageId } = v;
  // 图片 src 资源
  const src = style?.filename ? `${staticPath}/${pageId}/${style.filename}` : null;
  const data =
    getData({
      mockData,
      staticData: null,
      apiData: fetchData,
      useDataType,
      isPreview,
    }) || {};

  // antd  modal挂载容器
  const getContainer = () => {
    return (
      document.getElementById('canvas') || document.getElementById('containerDiv') || document.body
    );
  };
  const resData = {
    ...v,
    style: {
      ...style,
      src,
    },
    mapServerURL,
    mapThemeURL,
    mapId,
    data,
    fetchData,
    onChange,
    lang,
    updateCompsHiddenOrShow,
    pageConfig,
    getContainer,
    isPreview,
  };
  const sty = getNewStyle(resData);
  const basicSty = getNewBasicStyle(resData);
  return {
    ...resData,
    style: sty,
    basicStyle: basicSty,
  };
};

/**
 * 生成div ID
 */
export const generateDivId = v => {
  return `${v.id}_${v.compName}`;
};

/**
 * 根据 isHidden 和  权限确定组件是否显示
 */
export const getCompIsHidden = ({ v, authDataSource, otherCompParams }) => {
  const { authFunc, authFuncEs5Code, isHidden, openAuthFunc } = v;
  /**
   * 如果已经是隐藏状态，就直接返回
   */
  if (isHidden) {
    return isHidden;
  }
  if (openAuthFunc && authFunc && authDataSource && JSON.stringify(authDataSource) !== '{}') {
    const authRes = filterDataFunc({
      filterFunc: authFunc,
      filterFuncEs5Code: authFuncEs5Code,
      data: authDataSource,
      otherCompParams,
    });
    return authRes;
  }
  return isHidden;
};

/**
 * 更具ID 挥着ID数数组获取对应的信息
 */
export const getInfoByIds = (ids, arr) => {
  const newArr = flattenArrByKey(arr, 'child');
  return newArr.filter(v => {
    if (ids.includes(v.id)) {
      return true;
    }
    return false;
  });
};

export const getNewStyle = props => {
  const { style = {}, data = {}, otherCompParams = {} } = props;
  const { openHighConfig, styleFilterFunc, styleFilterFuncEs5Code } = style;
  if (openHighConfig && styleFilterFunc) {
    const filterSty = filterDataFunc({
      filterFunc: styleFilterFunc,
      filterFuncEs5Code: styleFilterFuncEs5Code,
      data,
      style,
      otherCompParams,
    });
    return {
      ...style,
      ...filterSty,
    };
  }
  return style;
};

export const getNewBasicStyle = props => {
  const { basicStyle = {}, data = {}, otherCompParams = {} } = props;
  const { openHighConfig, basicStyleFilterFunc, basicStyleFilterFuncEs5Code } = basicStyle;
  if (openHighConfig && basicStyleFilterFunc) {
    const filterSty = filterDataFunc({
      filterFunc: basicStyleFilterFunc,
      filterFuncEs5Code: basicStyleFilterFuncEs5Code,
      data,
      basicStyle,
      otherCompParams,
    });
    return {
      ...basicStyle,
      ...filterSty,
    };
  }
  return basicStyle;
};
