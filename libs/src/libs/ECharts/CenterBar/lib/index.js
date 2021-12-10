import React, { useRef, memo } from 'react';
import ReactEcharts from '../../../../components/EchartsForReact';
import { centerBarOpt } from '../../utils/centerBarUtil';
import isEqual from 'fast-deep-equal';
import { getNewOptions } from '../../utils/option';
function CenterBar(props) {
  const { data = {}, style: option } = props;
  const chartRef = useRef(null);
  const { series, categories } = data;
  const chartDivClick = () => {
    const { onClick } = props;
    const echarts_instance = chartRef.current.getEchartsInstance();
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
  };
  const getOptions = () => {
    const opts = centerBarOpt({ categories, series, option });
    return getNewOptions(props, opts);
  };
  return (
    <ReactEcharts
      onClick={chartDivClick}
      ref={chartRef}
      id="echats"
      notMerge={true}
      lazyUpdate={true}
      option={getOptions()}
      style={{ height: '100%', width: '100%' }}
      className="react_for_echarts"
    />
  );
}

function comparator(previosProps, nextProps) {
  if (!isEqual(previosProps.data, nextProps.data)) {
    return false;
  }
  if (!isEqual(previosProps.style, nextProps.style)) {
    return false;
  }
  return true;
}

export default memo(CenterBar, comparator);
