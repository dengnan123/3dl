import React, { memo, useRef, useCallback } from 'react';
import ReactEcharts from '../../../../components/EchartsForReact';
import isEqual from 'fast-deep-equal';
import { useUniversalEChartsOptions } from '../../utils/universalEChartsUtil';
import { getEvents } from '../../utils/events';

const UniversalEChartLibrary = props => {
  const { onClick, onChange } = props;

  const echarts_react = useRef();

  const chartDivClick = useCallback(() => {
    const echarts_instance = echarts_react.current.getEchartsInstance();
    if (echarts_instance) {
      const imageSrc = echarts_instance.getDataURL({
        pixelRatio: 1,
        backgroundColor: '#fff',
      });
      onClick &&
        onClick({
          imageSrc,
        });
    }
  }, [onClick]);

  const options = useUniversalEChartsOptions(props);

  return (
    <ReactEcharts
      onClick={chartDivClick}
      id="echats"
      notMerge={true}
      lazyUpdate={true}
      ref={echarts_react}
      option={options}
      style={{ height: '100%', width: '100%' }}
      className="react_for_echarts"
      onEvents={getEvents({ onChange })}
    />
  );
};

function comparator(previosProps, nextProps) {
  if (!isEqual(previosProps.data, nextProps.data)) {
    return false;
  }
  if (!isEqual(previosProps.style, nextProps.style)) {
    return false;
  }
  return true;
}

export default memo(UniversalEChartLibrary, comparator);
