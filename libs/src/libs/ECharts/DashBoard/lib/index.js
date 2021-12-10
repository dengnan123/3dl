import React, { useRef } from 'react';
import ReactEcharts from '../../../../components/EchartsForReact';
import { getNewOptions } from '../../utils/option';
import { dashBoardOpt } from '../../utils/dashBoardUtil';
export default function DashBoard(props) {
  const { data = {}, style: option } = props;
  const { value = 0 } = data;
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

  // useEffect(() => {
  //   const echarts_instance = chartRef.current.getEchartsInstance();
  //   if (echarts_instance) {
  //     const opt = dashBoardOpt({ option, value });
  //     echarts_instance.setOption(getNewOptions(props, opt));
  //   }
  // }, [option, value]);

  const getOptions = () => {
    const opts = dashBoardOpt({ option, value });
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
