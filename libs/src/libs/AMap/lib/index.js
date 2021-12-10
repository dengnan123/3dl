import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AMapScene } from '@antv/l7-react';
import { reap } from '../../../components/SafeReaper';
import { MyPopUp, MyPolygonLayer } from '../components/index';
import styles from './index.less';
import MapNews from '../components/MapNews';
function AMap(props) {
  const { onChange, style, data: dataSource = [] } = props;
  const popupInfoClock = useRef({ timerId: null, index: 0 });
  const [popupInfoCarouselStart, setPopupInfoCarouselStart] = useState(true);
  const [scene, setScene] = useState();

  const [map, setMap] = useState();
  const [layer, setLayer] = useState();
  const [mapSourceData, setMapSourceData] = useState();
  const [popupInfo, setPopupInfo] = useState();

  const { show, carousel, interval } = reap(style, 'myPopUp', {
    show: false,
    carousel: false,
    interval: 2,
  });

  const compKey = reap(style, 'compKey', 'amap');

  const onMapChange = useCallback(({ map, layer, mapSourceData }) => {
    if (map) {
      setMap(map);
    }
    if (layer) {
      setLayer(layer);
    }
    if (mapSourceData) {
      setMapSourceData(mapSourceData);
    }
  }, []);

  // 向上抛数据
  const onMapClick = useCallback(
    info => {
      onChange && onChange({ [compKey]: info });
    },
    [onChange, compKey],
  );

  const onSceneLoaded = useCallback(scene => {
    setScene(scene);
  }, []);

  useEffect(() => {
    const { dragEnable, zoomEnable, doubleClickZoom } = reap(style, 'map', {
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
    });
    if (scene) {
      scene.setMapStatus({ dragEnable, zoomEnable, doubleClickZoom });
    }
  }, [scene, style]);

  useEffect(() => {
    if (layer && popupInfo && show && carousel) {
      layer.setSelect(popupInfo?.properties?.subFeatureIndex);
    }
  }, [layer, popupInfo, show, carousel]);

  // 轮巡列表
  const popupList = useMemo(() => {
    let data = dataSource || [];
    if (!map || !mapSourceData || !data.length) {
      return data;
    }

    data = dataSource
      ?.map(n => {
        const info = mapSourceData.features.find(m => m.properties.name === n.name);
        const lngLat = reap(info, 'properties.center', [0, 0]);

        if (info) {
          return { ...info, ...n, lngLat };
        }
        return null;
      })
      .filter(n => n);
    return data;
  }, [map, dataSource, mapSourceData]);

  // 信息轮巡
  useEffect(() => {
    const clearFunc = () => {
      popupInfoClock.current.timerId && clearInterval(popupInfoClock.current.timerId);
      popupInfoClock.current.timerId = null;
    };
    if (!map || !popupList.length || !show) {
      return clearFunc;
    }

    if (!popupInfoCarouselStart) {
      return clearFunc;
    }
    // popupInfoClock.current.index = 0;
    // setPopupInfo();
    const action = () => {
      const popupInfo = popupList[popupInfoClock.current.index];
      const lngLat = reap(popupInfo, 'lngLat', [0, 0]);
      const zoom = map.getZoom();
      const { x, y } = map.lngLatToContainer(lngLat, zoom);
      const newPopupInfo = { ...popupInfo, x, y };
      setPopupInfo(newPopupInfo);
      popupInfoClock.current.index++;
    };
    action();
    if (carousel) {
      popupInfoClock.current.timerId = setInterval(() => {
        if (popupInfoClock.current.index > popupList.length - 1) {
          popupInfoClock.current.index = 0;
        }
        action();
      }, interval * 1000);
    }

    return clearFunc;
  }, [map, popupList, show, interval, carousel, popupInfoCarouselStart]);

  return (
    <div className={styles.amapContainer}>
      <AMapScene
        className={styles.amap}
        map={reap(style, 'map', {
          style: 'dark',
          dragEnable: true,
          zoomEnable: true,
          doubleClickZoom: false,
        })}
        option={{
          data: [],
          logoVisible: false,
          animate: true,
          enable: true,
          size: 12,
          bubbleOption: {
            enable: true,
            size: 12,
            color: 'red',
          },
        }}
        onSceneLoaded={onSceneLoaded}
      >
        {/* 地图 */}
        <MyPolygonLayer
          onMapClick={onMapClick}
          onMapChange={onMapChange}
          switchPopupInfoCarousel={setPopupInfoCarouselStart}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
          style={style}
          dataSource={popupList}
        />
      </AMapScene>
      {/* <LoadImage name="marker" url={loadImg} /> */}

      {/* 浮动信息提示 */}
      <MyPopUp popupInfo={popupInfo} style={style} />

      {/* 角落信息展示 */}
      <MapNews map={map} mapSourceData={mapSourceData} style={style} />
    </div>
  );
}

AMap.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
};

export default AMap;
