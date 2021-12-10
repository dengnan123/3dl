import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import { PolygonLayer, LayerEvent, LineLayer } from '@antv/l7-react';

import { getMapData } from '../../helpers/utils';

import provinceData from '../../helpers/mapData/100000_full.json';
import { reap } from '../../../../components/SafeReaper';
// import pop from '../../assets/pop.png';
// import point from '../../assets/point.png';
// import styles from './index.less';

const chianAdCode = 100000;

const eventTypeEnums = {
  click: 'click',
  blankDoubleClick: 'blankDoubleClick',
};

function MyPolygonLayer(props) {
  const {
    onMapClick,
    onMapChange,
    style,
    dataSource = [],
    setPopupInfo,
    switchPopupInfoCarousel,
  } = props;

  const DrillDown = reap(style, 'map.drillDown', true);

  // 当前地图深度 从 0(全国) 开始
  const [level, setLevel] = useState(0);
  // 每个层级对应的adcode
  const [levelAdcode, setLevelAdcode] = useState({ 0: chianAdCode });

  const [mapSourceData, setMapSourceData] = useState(provinceData);

  const onLayerLoaded = useCallback(
    (layer, scene) => {
      onMapChange && onMapChange({ map: scene.map, layer, mapSourceData: provinceData });
    },
    [onMapChange],
  );

  // 地图单击
  const onClick = useCallback(
    info => {
      const adcode = info.feature.properties.adcode;
      let newPopupInfo = {};
      if (dataSource && dataSource.length) {
        newPopupInfo = dataSource.find(n => n.name === info.feature.properties.name);
      }
      onMapClick && onMapClick({ _eventType: eventTypeEnums.click, ...info, ...newPopupInfo });
      if (!adcode || !DrillDown) return;
      getMapData(adcode).then(res => {
        if (res) {
          setMapSourceData(res);
          setLevelAdcode({ ...levelAdcode, [level + 1]: adcode });
          setLevel(level + 1);
          onMapChange && onMapChange({ mapSourceData: res });
          setPopupInfo();
        }
      });
    },
    [levelAdcode, level, onMapChange, DrillDown, dataSource, setPopupInfo, onMapClick],
  );

  // 地图空白区域双击
  const onUnDoubleClick = useCallback(
    info => {
      if (!DrillDown) return;
      const adcode = levelAdcode[level - 1];
      if (!adcode) {
        return;
      }
      getMapData(adcode).then(res => {
        if (res) {
          onMapChange && onMapChange({ mapSourceData: res });
          onMapClick &&
            onMapClick({ _eventType: eventTypeEnums.blankDoubleClick, properties: { adcode } });
          setLevel(level - 1);
          setMapSourceData(res);
          setPopupInfo();
        }
      });
    },
    [levelAdcode, level, DrillDown, onMapChange, setPopupInfo, onMapClick],
  );

  const onMouseMove = useCallback(
    info => {
      switchPopupInfoCarousel(false);
      let newPopupInfo = undefined;
      if (dataSource && dataSource.length) {
        newPopupInfo = dataSource.find(n => n.name === info.feature.properties.name);
      }
      if (newPopupInfo) {
        newPopupInfo = { ...info, ...newPopupInfo, x: info.x, y: info.y };
      }
      setPopupInfo(newPopupInfo);
    },
    [switchPopupInfoCarousel, setPopupInfo, dataSource],
  );

  const onMouseOut = useCallback(
    info => {
      switchPopupInfoCarousel(true);
    },
    [switchPopupInfoCarousel],
  );

  return mapSourceData ? (
    <>
      <PolygonLayer
        onLayerLoaded={onLayerLoaded}
        options={{
          autoFit: true,
          animate: true,
        }}
        source={{
          data: mapSourceData,
        }}
        color={{
          field: 'name',
          values: reap(style, 'color', ['#3f50d3', '#4d6bff', '#3982ff', '#369aff']),
        }}
        shape={{
          values: reap(style, 'layer.shape.values', 'fill'),
        }}
        style={{
          opacity: reap(style, 'layer.style.opacity', 0.5),
        }}
        select={
          reap(style, 'layer.select.open', true)
            ? {
                option: { color: reap(style, 'layer.activeColor', '#FFD591') },
              }
            : null
        }
        active={
          reap(style, 'layer.active.open', true)
            ? {
                option: { color: reap(style, 'layer.activeColor', '#FFD591') },
              }
            : null
        }
      >
        <LayerEvent type="click" handler={onClick} />
        <LayerEvent type="undblclick" handler={onUnDoubleClick} />
        <LayerEvent type="mousemove" handler={onMouseMove} />
        <LayerEvent type="mouseout" handler={onMouseOut} />
      </PolygonLayer>

      <LineLayer
        options={{
          autoFit: true,
          animate: true,
        }}
        source={{
          data: mapSourceData,
        }}
        color={{
          values: reap(style, 'lineLayer.color.values', '#000000'),
        }}
        size={{
          filed: 'LINEAR',
          values: reap(style, 'layer.size.values', 0.5),
        }}
        shape={{
          values: 'line',
        }}
      />

      {/* {Array.isArray(dataSource) &&
        dataSource.map((item, index) => {
          return (
            <Marker
              key={item.id || index}
              option={
                {
                  // color: 'red',
                  // anchor: 'top-left',
                }
              }
              lnglat={item.center || [0, 0]}
              children={
                <>
                  {item.pop ? (
                    <div
                      className={styles.popContent}
                      style={{
                        color: '#fff',
                        width: 240,
                        height: 120,
                        padding: 10,
                        // backgroundColor: 'rgba(0,0,0,0.5)',
                      }}
                      onClick={() => {
                        if (item.pageId) {
                          window.location.href =
                            window.location.origin +
                            `/preview?pageId=${item.pageId}&key=${item.urlKey}`;
                        }
                      }}
                    >
                      <img
                        src={pop}
                        alt=""
                        style={{ marginRight: 10, position: 'absolute', left: 0, top: 0 }}
                      />

                      <div style={{ textAlign: 'left', fontSize: 18, paddingLeft: 35 }}>
                        {item.city}
                      </div>

                      <div className={styles.content} style={{ fontSize: 14, lineHeight: '55px' }}>
                        <div>
                          <span>{item.title}</span>
                          <span>{item.titleNumber}</span>
                        </div>
                        <div>
                          <span>{item.subtitle}</span>
                          <span>{item.subtitleNumber}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={point} alt="" />
                  )}
                </>
              }
            />
          );
        })} */}
    </>
  ) : null;
}

MyPolygonLayer.propTypes = {
  onMapClick: PropTypes.func,
  onMapChange: PropTypes.func,
  switchPopupInfoCarousel: PropTypes.func,
  setPopupInfo: PropTypes.func,
  popupInfo: PropTypes.object,
  style: PropTypes.object,
};

export default memo(MyPolygonLayer);
