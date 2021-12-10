import rgbHex from 'rgb-hex';
import { isArray } from 'lodash';

import { getParseSearch, removeSpace } from '../../../helpers/utils';
/**
 * 大屏没有路由只有一个页面，所以pathname 就是配置的NGINX前缀
 */
const { pathname } = window.location;
const base = pathname !== '/' ? pathname : '';
const startPointUrl = `${base}/assets/startPoint.png`;
const endPointUrl = `${base}/assets/endPoint.png`;

function getRgbString(rgba) {
  let _rgba = removeSpace(rgba);
  if (_rgba) {
    let rgbstr = _rgba.substr(5);
    let str = rgbstr.substr(0, rgbstr.length - 1).split(',');
    // const rgb = { r: str[0], g: str[1], b: str[2], a: str[3] };
    return `rgb(${str[0]}, ${str[1]}, ${str[2]})`;
  }
  return 'rgb(255,255,255)';
}

export const DefaultAppConfig = {
  appKey: '3f5052ae825dc312df8f5ab84ab1c959',
  appName: '招商银行_SaaS平台', //开发者申请应用名称
  // mapServerURL: 'http://139.219.12.216:3003/static/maps', // 地图.fmap文件路径
  // mapThemeURL: 'http://139.219.12.216:3003/static/themes', // 地图.theme文件路径
  // mapServerURL: 'https://3dl.dfocus.top/api/static/maps', // 地图.fmap文件路径
  // mapThemeURL: 'https://3dl.dfocus.top/api/static/themes', // 地图.theme文件路径
};

// 默认地图配色
export const DefaultColors = {
  1: '#80BA01', // 绿色
  2: '#F25022', // 红色
  3: '#FFB902', // 黄色
  4: '#0240EF', // 蓝色
};

// 设置地图模型颜色
export function setMapModalColor(map, data, fengmapSDK, setStateFun, fidHashMap) {
  const request = { types: ['model'] };
  const groupId = map.focusGroupID;
  let mapArr = null;
  fengmapSDK.MapUtil.search(map, groupId, request, result => {
    var models = result;
    if (models.length <= 0) return;
    mapArr = models;
    for (let model of models) {
      if (!model.target.FID && !model.FID) return;
      const { target } = model;
      const { FID } = target;
      if (fidHashMap && fidHashMap[FID]) {
        const d = fidHashMap[FID];
        model?.target?.setColor && model.target.setColor(d.color || DefaultColors[d.state], 1);
        model?.setColor && model.setColor(d.color || DefaultColors[d.state], 1);
      }
    }
  });
  setStateFun({ mapFidHash: mapArr });
}

// 移动至视野中心
export function mapCenterPosition(map, center) {
  let currentGroup = map.focusFloor;
  let groupList = map.listFloors;
  let index = groupList.indexOf(currentGroup);
  let x = center[index] ? center[index].x : null;
  let y = center[index] ? center[index].y : null;
  if (x && y) {
    map.moveTo({ x, y });
  }
}

// 设置选中的模型颜色
export function setSelectedColorArray(selectModels, setSelected) {
  setSelected({ selectModels: selectModels });
  selectModels.forEach(item => {
    item.target?.setColor && item.target.setColor('#FFB902', 1);
    item.setColor && item.setColor('#FFB902', 1);
  });
}

// 清除选中的模型颜色
export function clearSelectModels(selectModels, data, setSelected) {
  if (!selectModels || !data) return;
  selectModels.forEach(item => {
    const found = data.find(desk => desk.fids.includes(item.target.FID));
    if (found) {
      item.target?.setColor && item.target.setColor(found.color, 1);
      item.setColor && item.setColor(found.color, 1);
    } else {
      item.setColorToDefault && item.target.setColorToDefault();
      item.setColorToDefault && item.setColorToDefault();
    }
  });
  setSelected({ selectModels: null });
}

// 设置终点
export function setEndPoint(e, map, data, iconSize, dynamicEndPoint, setEnd) {
  let end = {
    options: {
      x: e.mapCoord.x,
      y: e.mapCoord.y,
      groupID: map.focusGroupID,
      url: endPointUrl,
      size: iconSize || 50,
      height: 2,
    },
  };
  if (dynamicEndPoint) {
    end = data?.endPoint;
  }
  setEnd({ End: end });
}

export const setFloorStart = (startGroup, focusGroup, iconSize) => {
  const hasStartGroup = startGroup && startGroup.length !== 0;
  if (!hasStartGroup) {
    return null;
  }
  const { x, y, groupID } = startGroup[focusGroup - 1] || {};

  if (!x || !y) {
    return null;
  }
  const startPoint = {
    options: {
      x: parseFloat(x),
      y: parseFloat(y),
      groupID: groupID,
      url: startPointUrl,
      size: iconSize || 50,
      height: 2,
    },
  };
  return startPoint;
};

// 设置起点
export function setStartPoint(map, mapStyles, data, setPosition) {
  const {
    iconSize,
    defaultStatus,
    defaultStart,
    defaultOneStatus,
    dynamicStartPoint,
    startGroup,
  } = mapStyles;

  if (defaultStatus) {
    const { x, y } = defaultStart || {};
    if (!x || !y) {
      return setPosition({ Start: null, End: null });
    }

    const startPoint = {
      options: {
        x: parseFloat(x),
        y: parseFloat(y),
        groupID: map?.focusGroupID ? map.focusGroupID : 1,
        url: startPointUrl,
        size: iconSize || 50,
        height: 2,
      },
    };
    setPosition({ Start: startPoint, End: null });
    return;
  }

  if (defaultOneStatus) {
    const focusGroup = map?.focusGroupID || 1; // 当前地图所在楼层id
    const startPoint = setFloorStart(startGroup, focusGroup, iconSize);
    setPosition({ Start: startPoint, End: null });
    return;
  }

  if (dynamicStartPoint) {
    setPosition({ Start: data?.startPoint || null, End: null });
    return;
  }
}

// 获取按钮基本配置
export const getBtnStyles = style => {
  const {
    btnWidth = 42,
    btnHeight = 42,
    btnRadius = 0,
    btnFontSize = 12,
    btnFontWeight = 400,
    btnFontColor = '#1E82FA',
    btnBackgroundColorBool = true,
    btnBackgroundColor = 'rgba(198,198,198,1)',
    btnHighlightFontColor = '',
    btnHighlightBackgroundColor = '',
    btnShadow,
    btnBorder,
    btnBoxShadow,
    floorBgImage,
  } = style;
  const btnStyle = {
    width: btnWidth,
    height: btnHeight,
    borderRadius: btnRadius,
    lineHeight: `${btnHeight}px`,
    color: btnFontColor,
    fontSize: btnFontSize,
    fontWeight: btnFontWeight,
    backgroundColor: btnBackgroundColorBool ? btnBackgroundColor || '#fff' : 'transparent',
    btnHighlightFontColor,
    btnHighlightBackgroundColor,
    btnBackgroundColorBool,
    btnShadow,
    border: btnBorder,
    boxShadow: btnBoxShadow,
    floorBgImage,
  };
  return btnStyle;
};

// 获取按钮位置
export const getBtnPosition = fengmapSDK => {
  const criticalVersion = [2, 3, 0];
  const version = fengmapSDK.VERSION;
  const nowVersionArr = version.split('.');
  const isMaxVersion =
    Number(nowVersionArr[0]) > criticalVersion[0] || Number(nowVersionArr[1]) >= criticalVersion[1];
  if (isMaxVersion) {
    const btnPosition = {
      LEFT_TOP: fengmapSDK.FMControlPosition.LEFT_TOP,
      LEFT_BOTTOM: fengmapSDK.FMControlPosition.LEFT_BOTTOM,
      RIGHT_TOP: fengmapSDK.FMControlPosition.RIGHT_TOP,
      RIGHT_BOTTOM: fengmapSDK.FMControlPosition.RIGHT_BOTTOM,
    };
    return btnPosition;
  }

  const btnPosition = {
    LEFT_TOP: fengmapSDK.controlPositon.LEFT_TOP,
    LEFT_BOTTOM: fengmapSDK.controlPositon.LEFT_BOTTOM,
    RIGHT_TOP: fengmapSDK.controlPositon.RIGHT_TOP,
    RIGHT_BOTTOM: fengmapSDK.controlPositon.RIGHT_BOTTOM,
  };
  return btnPosition;
};

// style变化时，更新地图样式
export const setMapBaseStyle = (prevStyle, style, map) => {
  const { backgroundColor: prevBgColor, opacity: prevOpacity, angle: prevAngle } = prevStyle;
  const { backgroundColor, opacity, angle } = style;
  const isBgChanged =
    (prevBgColor !== backgroundColor || prevOpacity !== opacity) && !!backgroundColor;
  // 设置背景色和透明度
  if (isBgChanged) {
    const op = opacity || opacity === 0 ? opacity : 1;
    map.setBackgroundColor(backgroundColor, op);
  }
  // 设置角度
  if (prevAngle !== angle) {
    map.rotateTo({ to: angle });
  }
};

// 地图onLoaded初始样式
export const onMapInitial = (map, config) => {
  const { angle, center, backgroundColor, opacity } = config;
  map.rotateAngle = 0;
  map.moveToCenter();
  map.rotateTo({ to: angle });
  // 移动至视野中心
  if (map.focusFloor && center) {
    mapCenterPosition(map, center);
  }
  if (backgroundColor) {
    let bgColor = backgroundColor;
    if (backgroundColor.includes('rgba')) {
      const rgbColor = getRgbString(backgroundColor);
      const hexColor = rgbHex(rgbColor);
      bgColor = `#${hexColor}`;
    }
    console.log(bgColor, '======backgroundColor---bgColor');
    map.setBackgroundColor(bgColor, opacity);
  }
};

const changeViewMode = (isInit3D, map) => {
  let map3DControl = document.getElementsByClassName('fm-control-tool-3d');
  let mapIndoor3DControl = map3DControl[0];
  let mapIndoor3DMode = map._viewMode;

  if (isInit3D && mapIndoor3DMode === '3d') {
    return;
  }

  if (!isInit3D && mapIndoor3DMode === 'top') {
    return;
  }

  // const modeString = isInit3D ? '3d' : 'top';

  if (isInit3D && mapIndoor3DMode !== '3d') {
    if (mapIndoor3DControl) {
      mapIndoor3DControl.click();
    } else {
      map.viewMode = '3d';
    }
    return;
  }

  if (!isInit3D && mapIndoor3DMode !== 'top') {
    if (mapIndoor3DControl) {
      mapIndoor3DControl.click();
    } else {
      map.viewMode = 'top';
    }
  }
};

// 地图重置
export const onMapReset = (map, config, setEnd, hideChangeAction) => {
  const { angle, defaultMapScale, resetFocusFloor, defaultFloor, center, init3D } = config;
  !hideChangeAction && changeViewMode(init3D, map);
  setEnd({ End: null });

  map.rotateTo({
    to: angle,
    duration: 0.1,
    callback: () => {
      map.tiltTo({ to: init3D ? 30 : 0, duration: 0.1 });
    },
  });
  setTimeout(() => {
    map.scaleTo({
      scale: defaultMapScale,
      duration: 0.2,
      callback: () => {
        map.moveToCenter();
        if (defaultFloor && Number(map.focusFloor) !== Number(defaultFloor) && resetFocusFloor) {
          console.log(`======map地图楼层重置回${defaultFloor} onMapReset --reset`);
          // map.focusFloor = defaultFloor;
          map.focusGroupID = defaultFloor;
        }

        // 移动至视野中心
        if (map.focusFloor && center) {
          mapCenterPosition(map, center);
        }
      },
    });
  }, 200);
};

// 地图点击事件
export const onMapNodeClick = (data, config, setMapState, onChange, needFetchApi) => {
  const isHasFid = isArray(data);
  if (!isHasFid) {
    onChange({
      includeEvents: ['callback'],
      noSelectData: true,
    });
    return;
  }
  const { eFid, selectModels, OccStatus, modelSelectedEffect, mapFidHash } = config;
  const clickItemModel = (data || []).find(item => item.fids && item.fids.includes(eFid));
  console.log(clickItemModel, '======map-clickItemModel');
  if (!clickItemModel) {
    clearSelectModels(selectModels, data, setMapState);
    onChange &&
      onChange({
        includeEvents: ['callback'],
        noSelectData: true,
      });
    return;
  }

  let fetchApi = false;
  if (!OccStatus) {
    fetchApi = true;
    if (!modelSelectedEffect && clickItemModel.spaceStatus === 1) {
      const { fids } = clickItemModel;
      const selectM = mapFidHash.filter(
        m => fids.includes(m.target.FID) && (m.target.setColor || m.setColor),
      );
      setSelectedColorArray(selectM, setMapState);
    }
  }

  if (OccStatus && clickItemModel.spaceStatus === 1) {
    fetchApi = true;
  }

  if (!fetchApi || !onChange) {
    return;
  }
  const includeEvents = [
    'showComps',
    'hiddenComps',
    'passParams',
    'callback',
    'paramsCache',
    'langChange',
  ];
  console.log('=====map-needFetchApi is', needFetchApi);
  if (needFetchApi) {
    includeEvents.push('fetchApi');
  }
  onChange &&
    onChange({
      includeEvents,
      ...clickItemModel,
      // excludeEvents: ['showComps', 'hiddenComps']
    });
};

const getContainerEle = mapCID => {
  const selfEle = document.getElementById(mapCID);
  if (selfEle) {
    return selfEle;
  }
  return window.parent.document.getElementById(mapCID);
};

export const optimizationAllowRender = cb => {
  const { mapPP, mapCID } = getParseSearch();
  if (!mapPP) {
    return;
  }
  const mapContaninerEle = getContainerEle(mapCID);
  if (!mapContaninerEle) {
    return;
  }
  isInViewPort(mapContaninerEle, cb);
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
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const callback = (entries, observer) => {
    const { boundingClientRect } = entries[0];
    const has = isInViewPort(boundingClientRect);
    cb(has);
  };

  function isInViewPort(boundingClientRect) {
    console.log('boundingClientRectboundingClientRect---=======map', boundingClientRect);
    const { top, right, bottom, left, width, height } = boundingClientRect;
    if (left === 0 && top === 0 && width === 0 && height === 0) {
      // 元素被隐藏
      return false;
    }
    // 元素不在可视区域
    return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
  }

  let observer = new IntersectionObserver(callback, options);
  observer.observe(ele);
};

//数组转对象
export const getFidHashMap = data => {
  let mapArr = [];
  if (Object.prototype.toString.call(data) === '[object Array]') {
    mapArr = data;
  } else if (Object.prototype.toString.call(data) === '[object Object]') {
    mapArr = data?.mapArray || [];
  }

  if (!mapArr?.length) {
    return {};
  }
  let obj = {};
  for (let i = 0; i < mapArr.length; i++) {
    const v = mapArr[i];
    const { fids } = v;
    for (const fid of fids) {
      obj[fid] = v;
    }
  }
  return obj;
};
