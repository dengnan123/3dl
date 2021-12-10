import ecStat from 'echarts-stat';
import { reap } from '../../../components/SafeReaper';
import { merge, cloneDeep, isObject } from 'lodash';

import {
  formatterFunc,
  getTooltip,
  getGraphColor,
  getLegend,
  getGird,
  getToolboxOpt,
} from './basicUtil';

export const scatterPlotOpt = ({
  categories = [],
  series = [],
  option = {},
  type = 'scatter',
  linerFuncionConfig,
}) => {
  const newSeries = getScatterPlotSeries(series, option, type, linerFuncionConfig);
  const optX = getScatterPlotX(option.xAxis, categories);
  const optY = getScatterPlotY(option.yAxis);
  const legend = getLegend(series, option.legend);
  const optG = getGird(option.grid);
  const title = option.title;
  const color = getGraphColor(option);
  const tooltip = getTooltip(option);
  const toolbox = getToolboxOpt(option);

  let initData = {
    title,
    legend,
    grid: {
      ...optG,
    },
    xAxis: optX,
    yAxis: optY,
    series: newSeries,
    color,
    tooltip,
    toolbox,
  };

  //  x y 翻转
  if (option.xyInverse) {
    const newY = JSON.parse(JSON.stringify(initData.xAxis));
    const newX = JSON.parse(JSON.stringify(initData.yAxis));
    initData.xAxis = newX;
    initData.yAxis = newY;
  }
  return initData;
};

function getScatterPlotSeries(series = [], option, type, linerFuncionConfig) {
  const drawerLineData = series.map(v => {
    const { data } = v;
    return data.map(v => {
      if (isObject(v)) {
        return v.value;
      }
      return v;
    });
  });

  const label = reap(option, 'label', {});
  const optBasicSeriesConfig = reap(option, 'basicSeriesConfig', {});
  const optSeries = reap(option, 'series', []);
  const customizeRegression = reap(option, 'regressionStatisticsConfig.customizeRegression', false);
  const firstOrderCoefficient = linerFuncionConfig
    ? reap(linerFuncionConfig, 'firstOrderCoefficient', 0.5)
    : reap(option, 'regressionStatisticsConfig.firstOrderCoefficient', 30);
  const constantTerm = linerFuncionConfig
    ? reap(linerFuncionConfig, 'constantTerm', 0)
    : reap(option, 'regressionStatisticsConfig.constantTerm', 0);
  // const data = [];
  // for (let i in series) {
  //   const _data = reap(series[i], 'data', []);
  //   data.push(..._data);
  // }
  // x坐标集合
  const xAxisList = (drawerLineData[0] || []).map(item => reap(item, '[0]', 0));
  const endX = Math.max(...xAxisList);
  const endY = endX * firstOrderCoefficient + constantTerm;
  const endCoord = [endX, endY];
  const myRegression = ecStat.regression(
    'linear',
    customizeRegression
      ? [[0, 0 * firstOrderCoefficient + constantTerm], endCoord]
      : drawerLineData[0] || [],
  );
  myRegression.points.sort(function(a, b) {
    return a[0] - b[0];
  });

  const showRegressionStatistics = reap(
    option,
    'regressionStatisticsConfig.showRegressionStatistics',
    false,
  );
  let regressionSeriesItem = reap(option, 'regressionStatisticsConfig.series', {});
  regressionSeriesItem = merge(
    {},
    {
      type: 'line',
      itemStyle: { color: 'transparent' },
      data: myRegression.points,
      markPoint: {
        label: { formatter: myRegression.expression },
        data: [
          {
            coord: myRegression.points[myRegression.points.length - 1],
          },
        ],
      },
    },
    regressionSeriesItem,
  );

  let arr = series.map((v, index) => {
    const data = cloneDeep(
      merge(
        {},
        {
          type,
          ...v,
          ...optBasicSeriesConfig,
          label,
        },
        optSeries[index],
      ),
    );

    const formatter = reap(data, `label.formatter`, null);
    if (formatter) {
      // eslint-disable-next-line no-new-func
      data.label.formatter = params => {
        return formatterFunc(params, formatter);
      };
    }

    return data;
  });

  if (showRegressionStatistics) {
    arr.push(regressionSeriesItem);
  }
  return arr;
}

function getScatterPlotX(optX, categories) {
  let init = {
    type: 'value',
    data: categories,
  };
  merge(init, optX);
  return init;
}

function getScatterPlotY(optY) {
  let init = {
    type: 'value',
  };
  merge(init, optY);
  return init;
}
