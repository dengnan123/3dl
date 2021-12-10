import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useDeepCompareEffect } from 'react-use';
import PropTypes from 'prop-types';
import isEqual from 'fast-deep-equal';
import { reap } from '../../../components/SafeReaper';
import { AMapScene, SceneEvent } from '@antv/l7-react';
import { MapLevel, EventType, ClickedAreaType, ChinaAdCode } from '../helpers/enums';
import { getMapData, isValidMapLevel, getAllMapInfo } from '../helpers/utils';
import { MyPolygonLayer, MyMarker } from '../components/index';
import PropertyPointIcon from '../assets/propertyPoint.png';
import BackIcon from '../assets/back.png';
import BuildingIcon from '../assets/building.png';
import styles from './index.less';

function DataPilotMap(props) {
  const { onChange, style, data } = props;
  const styleInitLevelData = style?.initLevelData;

  const [{ initLevelData, selectMarker }, setState] = useState({
    initLevelData: styleInitLevelData,
    selectMarker: null,
  });

  const markerList = data?.markerList;
  const compKey = reap(style, 'compKey', 'amap');
  // 展示返回按钮
  const showBackBtn = reap(style, 'showBackBtn', true);
  // 双击空白处上钻
  const dillupByDBLClickBlank = reap(style, 'dillupByDBLClickBlank', true);

  useDeepCompareEffect(() => {
    if (styleInitLevelData) {
      setState(state => ({ ...state, initLevelData: styleInitLevelData }));
    }
  }, [styleInitLevelData]);

  // 向上抛数据
  const handleChange = useCallback(
    info => {
      console.log('onChange', { [compKey]: info });
      onChange && onChange({ [compKey]: info });
    },
    [onChange, compKey],
  );
  // 地图相关
  const { mapSourceData, activeLevelData, onSceneLoaded, onDrilldown, onDrillup } = useMap(
    {
      style,
      handleChange,
      initLevelData,
    },
    [],
  );

  // marker 点击事件
  const handleMarkerClick = useCallback(
    markerData => {
      setState(state => ({ ...state, selectMarker: markerData }));
      handleChange({ _clickedAreaType: ClickedAreaType.Marker, markerData });
    },
    [handleChange],
  );

  const handleBack = useCallback(() => {
    if (selectMarker) {
      setState(state => ({ ...state, selectMarker: null }));
      return;
    }
    onDrillup();
  }, [onDrillup, selectMarker]);

  // scene双击事件，需要保存引用，不然函数内部状态不会更新
  const onSceneDblClickRef = useRef(onDrillup);
  useEffect(() => {
    onSceneDblClickRef.current = dillupByDBLClickBlank ? onDrillup : () => {};
  }, [onDrillup, dillupByDBLClickBlank]);

  const selectText = selectMarker ? selectMarker?.name : activeLevelData?.name;

  return (
    <div className={styles.amapContainer}>
      {/* 返回按钮 */}
      {showBackBtn && activeLevelData?.level && activeLevelData?.level !== MapLevel.Country && (
        <div className={styles.backBtn} onClick={handleBack}>
          <img src={BackIcon} alt="back" />
          <span className={styles.text}>{selectText}</span>
        </div>
      )}
      {showBackBtn && selectMarker && (
        <div className={styles.building}>
          <img src={BuildingIcon} alt="building" />
        </div>
      )}
      <AMapScene
        className={styles.amap}
        style={{
          display: showBackBtn && selectMarker ? 'none' : 'block',
        }}
        map={{
          style: 'dark',
          dragEnable: true,
          zoomEnable: true,
          doubleClickZoom: false,
          minZoom: 4,
          ...style?.map,
        }}
        option={{
          logoVisible: false,
        }}
        onSceneLoaded={onSceneLoaded}
      >
        {/* 双击返回上一级 */}
        <SceneEvent type="dblclick" handler={e => onSceneDblClickRef.current()} />

        {/* 地图 */}
        <MyPolygonLayer
          onDrilldown={onDrilldown}
          mapSourceData={mapSourceData}
          style={style}
          data={data}
        />

        {/* marker */}
        {markerList?.map((m, i) => (
          <MyMarker {...m} key={i}>
            <div
              style={{ backgroundImage: `url(${PropertyPointIcon})`, ...m?.style }}
              className={styles['property-point']}
              onClick={() => !m?.disabled && handleMarkerClick(m)}
            ></div>
          </MyMarker>
        ))}
      </AMapScene>
    </div>
  );
}

DataPilotMap.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.object,
  otherCompParams: PropTypes.object,
};

export default memo(DataPilotMap, areEqual);

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}

function useMap(opts) {
  const { handleChange, style, initLevelData = {} } = opts || {};
  const [scene, setScene] = useState();
  // 所有地图adcode对应数据
  const allMapInfoRef = useRef(null);
  // 当前地图层级信息
  const [activeLevelData, setActiveLevelData] = useState(null);
  // 地图数据
  const [mapSourceData, setMapSourceData] = useState(null);

  // 开启下钻
  const drillDown = reap(style, 'map.drillDown', true);

  const onSceneLoaded = useCallback(scene => {
    setScene(scene);
  }, []);

  // 下钻
  const onDrilldown = useCallback(
    async info => {
      const properties = info?.feature?.properties;
      const adcode = properties?.adcode;
      const currentLevel = properties?.level;
      // 如果当前已经是区级，则不做任何处理
      if (activeLevelData?.level === MapLevel.District) {
        return;
      }
      if (!isValidMapLevel(currentLevel)) {
        return;
      }

      handleChange({
        _eventType: EventType.DrillDown,
        _clickedAreaType: ClickedAreaType.Map,
        data: properties,
      });
      if (!adcode || !drillDown) return;
      const mapResult = await getMapData(adcode);
      setMapSourceData(mapResult);
      setActiveLevelData(properties);
    },
    [activeLevelData, drillDown, handleChange],
  );

  // 上钻
  const onDrillup = useCallback(async () => {
    if (!drillDown) return;
    // 获取父级层级数据
    const parentAdcode = activeLevelData?.parent?.adcode;
    const parentLevelData = allMapInfoRef.current?.[parentAdcode];

    if (!parentLevelData) {
      return;
    }
    const mapResult = await getMapData(parentAdcode);
    if (!mapResult) return;
    handleChange({
      _eventType: EventType.DrillUp,
      _clickedAreaType: ClickedAreaType.Map,
      data: parentLevelData,
    });
    setActiveLevelData(parentLevelData);
    setMapSourceData(mapResult);
  }, [activeLevelData, drillDown, setMapSourceData, handleChange]);

  // 通过 initialAdcode 获取地图处理
  useDeepCompareEffect(() => {
    const initialAdcode = initLevelData?.adcode ?? ChinaAdCode;
    let currentLevelData = null;
    const cb = () => {
      currentLevelData = allMapInfoRef.current?.[initialAdcode];
      if (!currentLevelData) return;
      getMapData(initialAdcode).then(res => {
        if (!res) return;
        handleChange({ _eventType: EventType.Init, data: currentLevelData });
        setActiveLevelData(currentLevelData);
        setMapSourceData(res);
      });
    };
    if (!initialAdcode) return;

    if (allMapInfoRef.current) {
      cb();
      return;
    }

    getAllMapInfo().then(mapResult => {
      allMapInfoRef.current = mapResult;
      cb();
    });
  }, [initLevelData]);

  // 更新地图点击事件状态
  useEffect(() => {
    const { dragEnable, zoomEnable, doubleClickZoom, mapStyle } = reap(style, 'map', {
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
    });
    if (!scene) {
      return;
    }
    scene.setMapStatus({ dragEnable, zoomEnable, doubleClickZoom });
    scene.setMapStyle(mapStyle);
  }, [scene, style]);

  // 更新地图样式
  useEffect(() => {
    const { style: _style, mapStyle } = reap(style, 'map', { style: 'dark' });
    if (!scene) {
      return;
    }
    scene.setMapStyle(mapStyle || _style);
  }, [scene, style]);

  return {
    scene,
    activeLevelData,
    mapSourceData,
    onSceneLoaded,
    onDrilldown,
    onDrillup,
  };
}
