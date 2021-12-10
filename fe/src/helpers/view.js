import router from 'umi/router';
// import { message } from 'antd';
import qs from 'query-string';
import screenfull from 'screenfull';
import { pick } from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import { filterDataFunc } from '@/helpers/screen';
import { getParseSearch, clickIdHasParent } from '@/helpers/utils';
import { isString } from './object';

export function inViewPort(elem) {
  if (!elem || !elem.getBoundingClientRect) {
    return false;
  }

  const rect = elem.getBoundingClientRect();
  // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

export function destoryGlobalSpinner() {
  const spinner = document.getElementById('loading');
  if (spinner) {
    spinner.setAttribute('class', 'remove');
    // spinner.parentNode.removeChild(spinner);
  }
}

export function redirectTo(to, from) {
  if (isString(to) || isString(from)) {
    if (!from) {
      return router.push(to);
    }
    return router.push({
      pathname: to,
      query: {
        from,
      },
    });
  }
  // to为完整的RouteData
  return router.push(to);
}

export function goBack() {
  return router.goBack();
}

export function loadCssFle(url) {
  const fileref = document.createElement('link');
  fileref.setAttribute('rel', 'stylesheet');
  fileref.setAttribute('type', 'text/css');
  fileref.setAttribute('href', url);
  document.getElementsByTagName('head')[0].appendChild(fileref);
}

// eslint-disable-next-line no-script-url
export const someHref = 'javascript:void(0)';

export function animateScroll(container, element, containerTop = 0, speed = 800) {
  const rect = element.getBoundingClientRect();

  const top = container.scrollTop + rect.top - containerTop;

  animateScrollTo(top, { elementToScroll: container, speed });
}

export const getRouterParams = () => {
  const { search } = window.location;
  const params = qs.parse(search);
  return params;
};

export const getPageId = () => {
  const { pageId } = getRouterParams();
  return pageId || 'def';
};

export const getApiHostValue = ({ apiHostId, apiHostList = [] }) => {
  const data = apiHostList.filter(v => v.apiHostId === apiHostId)[0];
  if (!data) {
    return;
  }
  const { envList = [] } = data;
  const envData = envList.filter(v => v.checked)[0];
  if (!envData) {
    return;
  }
  return envData.value;
};

export const getApiHostValueById = ({ id, apiHostList = [] }) => {
  const data = apiHostList.filter(v => v.id === id)[0];
  if (!data) {
    return;
  }
  const { sourceList } = data;
  const envData = sourceList.filter(v => v.checked)[0];
  if (!envData) {
    return;
  }
  return envData;
};

/**
 * 旧版本的dataApiUrl,需要兼容
 */
export const getOldDataApiUrl = ({
  openDataApiUrlFilter,
  dataApiUrlFilter,
  condition,
  dataApiUrlFilterEs5Code,
  dataApiUrl,
}) => {
  let newDataApiUrl;
  if (openDataApiUrlFilter && dataApiUrlFilter) {
    newDataApiUrl = filterDataFunc({
      filterFunc: dataApiUrlFilter,
      filterFuncEs5Code: dataApiUrlFilterEs5Code,
      data: condition,
    });
  } else {
    newDataApiUrl = dataApiUrl;
  }
  return newDataApiUrl;
};

/**
 * 最新版本的 dataApiUrl
 */
export const getNewDataApiUrl = props => {
  // const {
  //   condition,
  //   apiRouter,
  //   apiRouterFilter,
  //   apiRouterFilterEs5Code,
  //   openApiRouterFilter,
  // } = props;
  const apiHostValue = getNowUseApihostValue(props);
  const newApiRouter = getApiRouter(props);
  return `${apiHostValue}${newApiRouter}`;
};

export const getApiRouter = props => {
  const {
    condition,
    apiRouter,
    apiRouterFilter,
    apiRouterFilterEs5Code,
    openApiRouterFilter,
  } = props;
  let newApiRouter = apiRouter;
  if (openApiRouterFilter && apiRouterFilter) {
    newApiRouter = filterDataFunc({
      filterFunc: apiRouterFilter,
      filterFuncEs5Code: apiRouterFilterEs5Code,
      data: condition,
    });
  }
  return newApiRouter;
};

/**
 * 获取合成的dataApiUrl
 * @param {string} dataApiUrl
 * @param {number} apiHostId
 * @param {boolean} openDataApiUrlFilter
 * @param {function} dataApiUrlFilter
 * @param {boolean} directDataSource
 * @param {array} envList - 环境块数据
 * @param {array} apiHostList - 后端数据源数组
 * @param {boolean} isDebug - 是否是在编辑页面调用api
 * @param {object} condition
 */
export const getDataApiUrl = props => {
  const { directDataSource } = props;
  /**
   * 如果是直连数据源，就用老的逻辑，否则用新逻辑
   */
  if (directDataSource) {
    return getOldDataApiUrl(props);
  }
  return getNewDataApiUrl(props);
};

/**
 * 根据链接 获取 链接的
 */

export const getHostByApiHostId = ({ apiHostId, apiHostList = [], envList = [] }) => {
  const keys = ['http://', 'https://'];
  const checkedValue = getNowUseApihostValue({ apiHostId, apiHostList, envList });
  if (!checkedValue) {
    return null;
  }
  for (const key of keys) {
    if (checkedValue.includes(key)) {
      const arr = checkedValue.split(key);
      const newValue = arr[1];
      const data = newValue.split('/');
      if (data?.length) {
        return data[0];
      }
      return newValue;
    }
  }
};

/**
 *
 * 获取当前的使用的环境
 */
export const getNowEnvData = envList => {
  const { ENV_KEY } = getParseSearch();
  if (ENV_KEY) {
    for (const v of envList) {
      if (v.envKey === ENV_KEY) {
        return v;
      }
    }
  }
  return envList.filter(v => v.checked)[0];
};

/**
 * 获取当前使用的 后端数据源
 */
export const getNowUseApihostValue = ({ apiHostId, apiHostList = [], envList = [] }) => {
  const checkedEnv = getNowEnvData(envList);
  if (!checkedEnv) {
    return;
  }
  for (const v of apiHostList) {
    const { id, sourceList } = v;
    if (id === apiHostId) {
      for (const item of sourceList) {
        const { envId, value } = item;
        if (envId === checkedEnv.id) {
          return value;
        }
      }
    }
  }
};

/**
 * 根据当前的环境ID 获取,筛选数据源
 */
export const getApiHostByEnvId = (envId, apiHostList = []) => {
  if (!envId) {
    return [];
  }
  return apiHostList.map(v => {
    const { sourceList } = v;
    for (const item of sourceList) {
      if (item.envId === envId) {
        return {
          apiHostName: v.apiHostName,
          value: item.value,
        };
      }
    }
    return {};
  });
};

/**
 * 根据当前的组件ID 获取 hiddenList
 * 如果组件是在一个成组组件或者容器组件里面，右键操作是需要受限制的
 */

export const getHiddenActionListById = ({ eventArr, id, initUseCompList }) => {
  const filterActionList = ['locking', 'unlock', 'doGroup', 'cancelGroup'];
  let hasParent = clickIdHasParent(initUseCompList, id);
  if (hasParent) {
    // 代表是在成组组件 或者容器里面
    return eventArr.filter(v => {
      const { eventName } = v;
      return !filterActionList.includes(eventName);
    });
  }
  return eventArr;
};

/**
 * 设置页面全屏
 */
export const fullScreen = (id, cb) => {
  const ele = document.getElementById(id) || document.body;
  if (screenfull.isEnabled) {
    screenfull.request(ele);
    screenfull.on('change', () => {
      cb && cb(screenfull.isFullscreen);
    });
  }
};

/**
 * 退出全屏
 */
export const exitFullScreen = () => {
  screenfull.exit();
};

/**
 * 处理数据，只保存 left top width height id pageId compName
 */
export const dealWithDoGroupData = data => {
  const keyArr = ['left', 'top', 'width', 'height', 'id', 'pageId', 'groupId', 'compName'];
  const { child = [] } = data;
  const newData = cleanTreeData(child, keyArr);
  return {
    ...pick(data, keyArr),
    child: newData,
  };
};

/**
 * 清洗树状结构的数据
 */
export const cleanTreeData = (arr, keyArr) => {
  return arr.map(v => {
    const { child } = v;
    if (!child || !child.length) {
      return pick(v, keyArr);
    }
    const newChild = cleanTreeData(child, keyArr);
    return {
      ...pick(v, keyArr),
      child: newChild,
    };
  });
};

export const closeSync = ({ isSelectCompInfo, data }) => {
  const { compName } = isSelectCompInfo;
  if (compName === 'PageWrap') {
    // PageWrap 是一个也特殊的组件，里面的child是其他页面获取来的，只能更新自己
    return true;
  }
  const keys = ['left', 'top', 'width', 'height'];
  const closeSync = isSelectCompInfo.basicStyle?.closeSync;
  if (closeSync) {
    // 如果closeSync  只更新自己 不更新子组件
    return true;
  }
  // 如果 'left,top,width,height' 任何一个不相等，就需要同步
  for (const key of keys) {
    if (data[key] !== undefined && isSelectCompInfo[key] !== data[key]) {
      return false;
    }
  }
  return true;
};

/**
 * 判断元素是否在可视区域，并且显示
 */
export const isInViewPort = (ele, cb) => {
  if (!ele) {
    return;
  }
  let options = {
    threshold: 1.0,
  };
  const callback = (entries, observer) => {
    const { boundingClientRect } = entries[0];
    const has = judgmentEleIsInView(boundingClientRect);
    cb(has);
  };
  let observer = new IntersectionObserver(callback, options);
  observer.observe(ele);
};

export const judgmentEleIsInView = boundingClientRect => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left, width, height } = boundingClientRect;
  if (left === 0 && top === 0 && width === 0 && height === 0) {
    // 元素被隐藏
    return false;
  }
  // 元素不在可视区域
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
};

export const eleInView = ele => {
  if (!ele) {
    return;
  }
  const boundingClientRect = ele.getBoundingClientRect();
  return judgmentEleIsInView(boundingClientRect);
};
