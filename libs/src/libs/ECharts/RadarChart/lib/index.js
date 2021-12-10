import { useRef, memo } from 'react';
import isEqual from 'fast-deep-equal';
import ReactEcharts from '../../../../components/EchartsForReact';
import { radarOpt } from '../../utils/radarUtil';
import { getNewOptions } from '../../utils/option';
function RadarChart(props) {
  const { data = {}, style: option } = props;
  const series = data?.series || [];
  const indicator = data?.indicator || [];
  const chartRef = useRef(null);
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
    const opts = radarOpt({ series, option, indicator });
    return getNewOptions(props, opts);
  };

  return (
    <ReactEcharts
      id="echats"
      onClick={chartDivClick}
      ref={chartRef}
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

export default memo(RadarChart, comparator);
