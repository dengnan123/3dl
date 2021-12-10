import React, { useCallback, memo, useRef } from 'react';
import PropTypes from 'prop-types';

import { reap } from '../../../../components/SafeReaper';
import { PolygonLayer, LayerEvent, LineLayer } from '@antv/l7-react';
// import { MyMarker } from '../index';

function MyPolygonLayer(props) {
  const { onDrilldown, style, mapSourceData, data } = props;

  const sceneRef = useRef(null);

  const onLayerLoaded = useCallback((layer, scene) => {
    sceneRef.current = scene;
  }, []);

  // 地图单击
  const onClick = useCallback(
    info => {
      onDrilldown && onDrilldown(info);
    },
    [onDrilldown],
  );

  if (!mapSourceData) return null;

  return (
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
          values: reap(data, 'color', ['#4086FF']),
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
          values: reap(style, 'lineLayer.size.values', 0.5),
        }}
        shape={{
          values: 'line',
        }}
      >
        {/* {mapSourceData?.features?.map((n, i) => (
          <MyMarker key={i} lnglat={n?.properties?.center}>
            <span style={{ color: 'white', fontSize: '12px' }}>{n?.properties?.name}</span>
          </MyMarker>
        ))} */}
      </LineLayer>
    </>
  );
}

MyPolygonLayer.propTypes = {
  onDrilldown: PropTypes.func,
  mapSourceData: PropTypes.object,
  style: PropTypes.object,
  data: PropTypes.object,
};

export default memo(MyPolygonLayer);
