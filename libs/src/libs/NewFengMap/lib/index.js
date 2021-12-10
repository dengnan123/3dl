import fengmapSDK from 'fengmap';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'fast-deep-equal';
import { v4 } from 'uuid';

import { getUrlParam, getParseSearch } from '../../../helpers/utils';
import { FengmapBase } from '../../../components/react-fengmap';

import {
  DefaultAppConfig,
  setMapModalColor,
  mapCenterPosition,
  clearSelectModels,
  setEndPoint,
  setStartPoint,
  setFloorStart,
  getBtnPosition,
  getBtnStyles,
  setMapBaseStyle,
  onMapInitial,
  onMapReset,
  onMapNodeClick,
  // isInViewPort,
  optimizationAllowRender,
  getFidHashMap,
} from './utils';

import {
  renderFloorControl,
  render3DControl,
  renderResetControl,
  renderCompassControl,
  renderNavigationControl,
} from './fetch';
import styles from './index.less';

class FengMap extends PureComponent {
  static defaultProps = DefaultAppConfig;

  constructor(props) {
    super(props);
    this.state = {
      fidHashMap: {},
      map: null,
      mapBtnPosition: {},
      mapFidHash: null,
      selectModels: null,
      Start: null,
      End: null,
      activeKey: getUrlParam('activeKey', 'url') || '0', // 当前所用哪个地图的key
    };
    this.timer = null;
  }

  _setMapState = obj => {
    this.setState({ ...obj });
  };

  componentDidMount() {
    const { map, activeKey } = this.state;
    const { style = {}, data } = this.props;
    const mapStyles = style[activeKey] || {};
    const mapBtnPosition = getBtnPosition(fengmapSDK);

    document.body.addEventListener('click', this.listenerClick);
    document.body.addEventListener('touchstart', this.listenerClick);
    window.addEventListener(
      'hashchange',
      eve => {
        this.setState({ activeKey: getUrlParam('activeKey', 'url') });
      },
      false,
    );
    const fidHashMap = getFidHashMap(data);
    console.log(fidHashMap, '==componentDidMount');
    this.setState({ mapBtnPosition });
    setStartPoint(map, mapStyles, data, this._setMapState);
    const that = this;
    optimizationAllowRender(vis => {
      console.log('====map--vis---', vis);
      if (that.state.map) {
        console.log('====map--vis--- 开始更改map');
        that.state.map.allowRender = vis;
      }
    });
  }

  componentWillMount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    document.body.removeEventListener('click', this.listenerClick);
    document.body.removeEventListener('touchstart', this.listenerClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { style: prevStyle, data: prevData, otherCompParams: prevOtherCompParams } = prevProps;
    const { map, activeKey, mapFidHash } = this.state;
    const { style = {}, data, otherCompParams } = this.props;
    const prevMapStyle = prevStyle[activeKey] || {};
    const mapStyles = style[activeKey] || {};

    const prevFloorKey = prevOtherCompParams?.floorKey;
    const floorKey = otherCompParams?.floorKey;
    const prevViewMode = prevOtherCompParams?.viewMode;
    const currentViewMode = otherCompParams?.viewMode;
    const prevPosition = prevOtherCompParams?.position;
    const currentPosition = otherCompParams?.position;

    // 地图标注语言设置：传参优先
    const prevLanguage = prevMapStyle?.labelLanguage;
    const currentLanguage = mapStyles?.labelLanguage;
    const prevParamsLanguage = prevOtherCompParams?.labelLanguage;
    const currentParamsLanguage = otherCompParams?.labelLanguage;

    console.log(otherCompParams, '======map-otherCompParams--cy0604===');
    if (!map) return;

    if (prevFloorKey !== floorKey && floorKey) {
      const { angle = 0, defaultMapScale, center, init3D } = mapStyles;
      map.focusGroupID = floorKey;
      // map.focusGroupID = { gid: floorKey, time: 0 };
      setTimeout(() => {
        onMapReset(map, { angle, defaultMapScale, center, init3D }, this._setMapState, true);
      }, 300);
    }
    // 设置地图模式
    const mapIndoor3DMode = map._viewMode;
    const isChangeViewMode =
      currentViewMode && currentViewMode !== prevViewMode && currentViewMode !== mapIndoor3DMode;
    // const isSameViewMode = currentViewMode && currentViewMode === prevViewMode && currentViewMode !== mapIndoor3DMode;
    if (isChangeViewMode) {
      let map3DControl = document.getElementsByClassName('fm-control-tool-3d') || [];
      let mapIndoor3DControl = map3DControl[0];
      console.log(mapIndoor3DControl, '=====mapIndoor3DControl');
      if (mapIndoor3DControl) {
        mapIndoor3DControl.click();
      } else {
        map.viewMode = currentViewMode;
      }
    }

    // 设置地图标注语言
    if (prevParamsLanguage !== currentParamsLanguage && currentParamsLanguage) {
      console.log('language=====otherCompParams=Change', currentLanguage);
      map.labelLanguage = currentParamsLanguage;
    } else if (prevLanguage !== currentLanguage) {
      console.log('language======Change', currentLanguage);
      map.labelLanguage = currentLanguage || 'zh';
    }

    // 外界传入position(fids),设置终点
    // const isPositionChanged = String(prevPosition) !== String(currentPosition);
    const isPositionChanged = !isEqual(prevPosition, currentPosition);
    if (isPositionChanged && mapFidHash) {
      console.log(isPositionChanged, '=====map--isPositionChanged');
      if (currentPosition && currentPosition.length > 0) {
        const { iconSize = 0, dynamicEndPoint } = mapStyles;
        console.log(mapFidHash, '=====map--mapFidHash');
        const selectM = mapFidHash.find(m => currentPosition.includes(m.FID));
        console.log(selectM, '=====map--selectM');

        selectM &&
          setEndPoint(selectM || {}, map, data, iconSize, dynamicEndPoint, this._setMapState);
      } else {
        this._setMapState({ End: null });
      }
    }

    // TODO: 设置 起点 / 终点

    console.log('getFidHashMap data', data);
    console.log('getFidHashMap 判断', !isEqual(prevData, data), !isEqual(prevStyle, style));
    // 设置颜色地图模型 +++ 设置起点
    if (!isEqual(prevData, data) || !isEqual(prevStyle, style)) {
      const fidHashMap = getFidHashMap(data);
      console.log('getFidHashMap fidHashMap', fidHashMap);
      this.setState({
        fidHashMap,
      });
      setMapModalColor(map, data, fengmapSDK, this._setMapState, fidHashMap);
      setStartPoint(map, mapStyles, data, this._setMapState);
    }

    // 设置地图背景颜色及旋转角度
    setMapBaseStyle(prevMapStyle, mapStyles, map);

    // // 开关地图是否渲染
    // if (prevOtherCompParams.allowRender !== otherCompParams.allowRender) {
    //   mapAllowRender({
    //     map,
    //     allowRender: otherCompParams.allowRender,
    //   });
    // }
  }

  // 重置按钮事件监听
  listenerClick = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.resetMap();
  };

  /*** 地图加载 ***/
  _onMapLoaded = (e, map) => {
    console.log('New Map -> Loaded -> ', map);
    const { allowRender } = getParseSearch();
    if (map && allowRender) {
      console.log('allowRenderallowRender', Boolean(allowRender));
      map.allowRender = false;
    }
    const { activeKey } = this.state;
    const { style, data, onChange } = this.props;
    const { angle = 0, center, backgroundColor, opacity, needPassParams } = style[activeKey] || {};
    // console.log('New Map -> Loaded -> ===map is listFloors', map.listFloors);
    const fidHashMap = getFidHashMap(data);
    this.setState({ map, fidHashMap });
    onMapInitial(map, { angle, center, backgroundColor, opacity });
    setStartPoint(map, style[activeKey], data, this._setMapState);

    // 地图加载完不需要设置颜色，因为地图加载完，会触发_onFloorChange，在_onFloorChange里面改变颜色
    setMapModalColor(map, data, fengmapSDK, this._setMapState, fidHashMap);

    // 初始加载，是否需要传参到其他组件
    if (needPassParams) {
      onChange &&
        onChange({
          includeEvents: ['passParams'],
          floorList: map.listFloors,
        });
    }
  };

  /*** 切换楼层 ***/
  _onFloorChange = (value, map) => {
    const { activeKey, fidHashMap } = this.state;
    const { style, onChange, data } = this.props;
    const { navigation, center = [], startGroup, iconSize, startPoniter } = style[activeKey];
    // 设置每层对应起点
    if (navigation && map.focusGroupID && startGroup && !!startGroup.length) {
      const startPoint = setFloorStart(startGroup, map.focusGroupID, iconSize);
      console.log('qidiantubiao startPoniter --', startPoniter);
      if (startPoniter) {
        startPoint.options.url = startPoniter;
      }
      console.log('qidiantubiao startPoint.options --', startPoint);
      this._setMapState({ Start: startPoint, End: null });
    }
    // 移动至视野中心
    if (map.focusFloor) {
      mapCenterPosition(map, center);
    }
    onChange &&
      onChange({
        includeEvents: ['fetchApi', 'passParams'],
        floor: map.focusFloor,
        floorList: map.listFloors,
      });
    setMapModalColor(map, data, fengmapSDK, this._setMapState, fidHashMap);
  };

  /*** 模型点击事件 ***/
  _mapClickNode = (e, map) => {
    const { selectModels, activeKey, mapFidHash } = this.state;
    const { data, style, onChange } = this.props;
    let finalMapDataList = [];
    if (Object.prototype.toString.call(data) === '[object Array]') {
      finalMapDataList = data;
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      finalMapDataList = data?.mapArray || [];
    }
    console.log('e.target.FID', e?.target?.FID);
    if (!e.target || !e.target.FID) {
      clearSelectModels(selectModels, finalMapDataList, this._setMapState);
      onChange &&
        onChange({
          includeEvents: ['callback'],
          noSelectData: true,
        });
      return;
    }
    const {
      OccStatus,
      modelSelectedEffect,
      navigation,
      iconSize,
      dynamicEndPoint,
      needFetchApi,
    } = style[activeKey];
    /** 地图点击导航(设置终点) **/
    if (navigation) {
      setEndPoint(e, map, data, iconSize, dynamicEndPoint, this._setMapState);
    }

    // console.log(e, '===Click+++FID===11', navigation);
    console.log(e, '=====map--Click+++FID===1133', finalMapDataList);

    const config = {
      eFid: e.target.FID,
      selectModels,
      OccStatus,
      modelSelectedEffect,
      mapFidHash,
    };
    onMapNodeClick(finalMapDataList, config, this._setMapState, onChange, needFetchApi);
  };

  // 重置地图
  resetMap = () => {
    const { style } = this.props;
    const { map, activeKey } = this.state;
    const defaultFloor = Number(getUrlParam('floor', 'url'));

    const {
      resetStatus,
      resetTime = 10,
      angle = 0,
      defaultMapScale,
      resetFocusFloor,
      center,
      init3D,
    } = style[activeKey] || {};
    this.timer && clearTimeout(this.timer);
    if (!resetStatus && this.timer) {
      this.timer = null;
      return;
    }
    if (resetStatus && map) {
      this.timer = setTimeout(() => {
        if (!map) return;

        onMapReset(
          map,
          { angle, defaultMapScale, resetFocusFloor, defaultFloor, center, init3D },
          this._setMapState,
        );
        // setTimeout(() => {
        //   onMapReset(map, { angle, defaultMapScale, resetFocusFloor, defaultFloor }, this._setMapState);
        // }, 500);
      }, resetTime * 1000);
    }
  };

  // 点击重置按钮
  onClickResetIcon = () => {
    const { style, onChange } = this.props;
    const { map, activeKey } = this.state;
    const { angle = 0, defaultMapScale, resetFocusFloor, center, init3D } = style[activeKey] || {};

    const defaultFloor = Number(getUrlParam('floor', 'url'));

    onMapReset(
      map,
      { angle, defaultMapScale, resetFocusFloor, defaultFloor, center, init3D },
      this._setMapState,
    );
    onChange &&
      onChange({ includeEvents: ['passParams'], isResetMap: v4(), floorList: map.listFloors });
    // setTimeout(() => {
    //   onMapReset(map, { angle, defaultMapScale, resetFocusFloor, defaultFloor }, this._setMapState);
    // }, 500);
  };
  // TODO:暂时未用上哈哈yuhh
  dynamicNavigation = (startPoint, endPoint) => {
    const { activeKey } = this.state;
    const { style } = this.props;
    const { dynamicStartPoint = false, dynamicEndPoint = false } = style[activeKey] || {};
    if (dynamicStartPoint && startPoint) {
      this.setState({
        Start: startPoint,
        // End: null,
      });
      // 激活自动复位
      this.resetMap();
    }
    if (dynamicEndPoint && endPoint) {
      this.setState({ End: endPoint });
      // 激活自动复位
      this.resetMap();
    }
  };

  handleClickCompass = () => {};

  render() {
    const { mapBtnPosition, Start, End, activeKey } = this.state;
    const { width, height, style = {}, appKey, appName } = this.props;
    // console.log('map ---width',width)
    // console.log('map ---height',height)
    const { disabledFloors } = style; // 禁用的楼层数组，[1,2,3]
    const mapStyles = style[activeKey] || {};
    const {
      containerId,
      mapServerURL,
      mapThemeURL,
      mapId,
      defaultMapScale = 200,
      defaultFocusGroup = 1,
      modelSelectedEffect = false,

      enableMapPinch,
      enableMapPan,
      enableMapRotate,
      enableMapIncline,
      init3D,
    } = style[activeKey] || {};

    const activeList = Object.keys(style);
    if (JSON.stringify(style) !== '{}' && !activeList.includes(activeKey)) {
      return (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          未配置对应的地图信息
        </div>
      );
    }

    const btnStyle = getBtnStyles(mapStyles);
    const urlFocusFloor = Number(getUrlParam('floor', 'url'));
    const urlFocusGroup = Number(getUrlParam('defaultFocusGroup', 'url'));
    // const defaultFloor = urlFocusGroup ? urlFocusGroup : defaultFocusGroup;
    let defaultFloor = null;
    if (urlFocusFloor) {
      defaultFloor = urlFocusFloor;
    } else if (urlFocusGroup) {
      defaultFloor = urlFocusGroup;
    } else {
      defaultFloor = defaultFocusGroup;
    }

    // const modeObject = {
    //   top: fengmapSDK.FMViewMode.MODE_2D,
    //   '3d': fengmapSDK.FMViewMode.MODE_3D,
    // };
    // let modeDefaultValue = defaultViewMode
    //   ? modeObject[defaultViewMode]
    //   : fengmapSDK.FMViewMode.MODE_2D;
    let modeDefaultValue = fengmapSDK.FMViewMode.MODE_2D;

    if (init3D && typeof init3D === 'boolean') {
      modeDefaultValue = fengmapSDK.FMViewMode.MODE_3D;
    }
    console.log(modeDefaultValue, `========mapStyles-- ${activeKey}`, init3D);
    return (
      <div
        id={!!containerId ? containerId : 'fengMap'}
        style={{ position: 'relative' }}
        className={styles.mapContainer}
      >
        <FengmapBase
          fengmapSDK={fengmapSDK}
          mapId={mapId}
          mapOptions={{
            key: appKey,
            appName,
            defaultThemeName: mapId,
            mapServerURL,
            mapThemeURL,
            compassSize: 46,
            defaultViewMode: modeDefaultValue,
            defaultMapScale: defaultMapScale, // 比例尺
            mapScaleLevelRange: [19, 23], // 比例范围
            // mapScaleRange: [200, 800], // 比例尺范围
            modelSelectedEffect, // 点击是否高亮
            defaultFocusGroup: defaultFloor,
          }}
          events={{
            loadComplete: this._onMapLoaded,
            focusGroupIDChanged: (v, map) => this._onFloorChange(v, map),
            mapClickNode: this._mapClickNode,
          }}
          loadingTxt="请填写地图ID..."
          gestureEnableController={{
            enableMapPinch,
            enableMapPan,
            enableMapRotate,
            enableMapIncline,
          }}
          style={{
            width,
            height,
            fontFamily: 'PorscheNextWAr',
            borderRadius: '50px',
          }}
          FMDirection={{
            FACILITY: 1,
          }}
        >
          {renderNavigationControl({ Start, End }, fengmapSDK)}
          {renderCompassControl(mapStyles, this.handleClickCompass)}
          {renderFloorControl(mapStyles, btnStyle, mapBtnPosition, disabledFloors)}
          {render3DControl(mapStyles, btnStyle, mapBtnPosition, fengmapSDK)}
          {renderResetControl(mapStyles, btnStyle, mapBtnPosition, this.onClickResetIcon)}
        </FengmapBase>
      </div>
    );
  }
}

FengMap.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.object,
  otherCompParams: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  appKey: PropTypes.string,
  appName: PropTypes.string,
};

export default FengMap;
