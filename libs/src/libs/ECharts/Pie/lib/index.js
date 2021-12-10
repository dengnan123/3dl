import React, { memo, useRef } from 'react';
import ReactEcharts from '../../../../components/EchartsForReact';
import { pieOpt } from '../../utils/pieUtil';
import isEqual from 'fast-deep-equal';
import { getNewOptions } from '../../utils/option';

const Pie = props => {
  const { data = {}, style: option = {}, onClick } = props;
  const { series = [], categories = [], type = 'pie' } = data;

  const echarts_react = useRef();

  const getOption = ({ categories, series, type, option }) => {
    const op = pieOpt({ categories, series, option });
    return getNewOptions(props, op);
  };

  const _onEvents = {};

  const chartDivClick = () => {
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
  };

  return (
    <ReactEcharts
      onClick={chartDivClick}
      id="echats"
      notMerge={true}
      lazyUpdate={true}
      ref={echarts_react}
      option={getOption({
        series,
        categories,
        type,
        option,
      })}
      style={{ height: '100%', width: '100%' }}
      className="react_for_echarts"
      onEvents={_onEvents}
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

export default memo(Pie, comparator);
