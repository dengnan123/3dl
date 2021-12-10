import { reap } from '../../../components/SafeReaper';
import { merge, cloneDeep } from 'lodash';

import { getTooltip, getGraphColor, getLegend, getGird, stack, getToolboxOpt } from './basicUtil';

export const centerBarOpt = ({ categories = [], series = [], option = {}, type = 'bar' }) => {
  const optSeries = option.series || [];
  const optBasicSeriesConfig = option.basicSeriesConfig || {};
  const newSeries = getCenterBarSeries(series, optSeries, optBasicSeriesConfig, type);
  const optX = getCenterBarX(option.xAxis, categories);
  const optY = getCenterBarY(option.yAxis, categories);
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

  return initData;
};

function getCenterBarSeries(series, optSeries, optBasicSeriesConfig, type) {
  const barBorderRadius = reap(optBasicSeriesConfig, 'itemStyle.barBorderRadius', 0);
  let arr = series
    .filter((v, index) => index === 0)
    .map((v, index) => {
      const data = cloneDeep(
        merge(
          {},
          {
            type,
            ...v,
            ...optBasicSeriesConfig,
            label: {
              show: true,
              position: 'insideLeft',
              distance: -10,
              formatter: params => {
                return Math.abs(params.value * 2);
              },
            },
            itemStyle: {
              ...reap(optBasicSeriesConfig, 'itemStyle', {}),
              barBorderRadius: [0, barBorderRadius, barBorderRadius, 0],
            },
            stack,
            data: v.data.map(item => item / 2),
          },
          optSeries,
        ),
      );

      if (optBasicSeriesConfig.barWidth) {
        data.barWidth = `${optBasicSeriesConfig.barWidth}%`;
      }

      // const formatter = reap(data, `label.formatter`, null);
      // if (formatter) {
      //   // eslint-disable-next-line no-new-func
      //   const func = new Function('params', formatter);
      //   data.label.formatter = func;
      // }

      return data;
    });

  const serieData = series && series.length ? reap(series[0], 'data', []) : [];

  const auxiliaryData = getAuxiliaryData(serieData);

  const auxiliaryItem = {
    name: '辅助',
    stack,
    type,
    ...optBasicSeriesConfig,
    itemStyle: {
      ...reap(optBasicSeriesConfig, 'itemStyle', {}),
      barBorderRadius: [barBorderRadius, 0, 0, barBorderRadius],
    },
    data: auxiliaryData,
  };

  if (optBasicSeriesConfig.barWidth) {
    auxiliaryItem.barWidth = `${optBasicSeriesConfig.barWidth}%`;
  }

  arr.unshift(auxiliaryItem);

  return arr;
}

function getAuxiliaryData(data) {
  const _idata = data.map(item => -item / 2);
  return _idata;
}

function getCenterBarX(optX, categories) {
  let init = {
    type: 'category',
    data: categories[0],
  };
  merge(init, optX);
  return init;
}

function getCenterBarY(optY, categories) {
  let init = {
    type: 'value',
    data: categories[0],
    position: 'left',
  };
  merge(
    init,
    {
      axisTick: {
        alignWithLabel: true,
      },
    },
    optY,
  );
  return [
    { ...init, axisLine: { show: false } },
    init,
    { ...init, position: 'right', data: categories[1] },
  ];
}
