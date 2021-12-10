import { cloneDeep } from 'lodash';
import { reap } from '../../../components/SafeReaper';

import { getGraphColor, getLegend, getAxisData, getToolboxOpt } from './basicUtil';

export const radarOpt = ({ series = [], categories = [], option = {}, indicator = [] }) => {
  const title = option.title;
  const data = [];
  for (let i = 0; i < series.length; i++) {
    const _data = reap(series[i], 'data', []);
    for (let j = 0; j < _data.length; j++) {
      const value = reap(_data[j], 'value', []);
      data.push(...value);
    }
  }

  const seriesData = series[0]?.data || [];

  const showOneAxislineConfig = getShowOneAxislineOpt(data, option);
  const radar = getRadar(data, indicator, option);
  const legend = getLegend(seriesData, option.legend);
  const newSeries = getRadarSeries(series, option);
  const color = getGraphColor(option);
  const tooltip = getRadarTooltip(option);
  tooltip.trigger = 'item';
  const toolbox = getToolboxOpt(option);

  const initData = {
    title,
    radar,
    legend,
    series: newSeries,
    color,
    tooltip,
    ...showOneAxislineConfig,
    toolbox,
  };

  return initData;
};

function getRadarSeries(series, option) {
  const showArea = reap(option, 'showArea', false);
  const areaStyle = reap(option, 'areaStyle', {});
  const showSymbol = reap(option, 'showSymbol', false);
  const lineStyle = reap(option, 'lineStyle', {});

  const _opt = {
    type: 'radar',
    lineStyle,
  };

  if (!showSymbol) {
    _opt['symbol'] = 'none';
  }

  const _series = series.map(v => {
    const _data = reap(v, 'data', []).map(item => {
      const obj = { ...item };
      if (showArea) {
        obj['areaStyle'] = areaStyle;
      }
      return obj;
    });
    return {
      ...v,
      data: _data,
      ..._opt,
    };
  });

  return _series;
}

function getRadar(data, indicator, option) {
  const radar = reap(option, 'radar', {});
  const showOneAxisLine = reap(option, 'showOneAxisLine', false);
  const optionIndicator = reap(radar, 'indicator', []);
  const splitNumber = reap(radar, 'splitNumber', 5);

  const { max, min } = getAxisData(splitNumber, data);

  const newIndicator = (indicator || []).map(item => {
    const current = optionIndicator.find(n => n.name === item.name) || {};

    return { ...current, ...item, max, min };
  });

  const defaultIndicator = [
    { name: '校招' },
    { name: '其他' },
    { name: '交流' },
    { name: '借调' },
    { name: '实习' },
    { name: '内部调动' },
    { name: '社招' },
  ];

  const newRadar = {
    ...radar,
    indicator: newIndicator.length ? newIndicator : defaultIndicator,
  };

  if (showOneAxisLine) {
    newRadar['axisTick'] = {
      show: false,
    };

    newRadar['axisLabel'] = {
      show: false,
    };
  }

  return newRadar;
}

function getShowOneAxislineOpt(data, option) {
  // 是否只显示一个坐标轴
  const showOneAxisLine = reap(option, 'showOneAxisLine', false);
  const radius = reap(option, 'radar.radius', '75%');
  const center = reap(option, 'radar.center', ['50%', '50%']);
  const splitNumber = reap(option, 'radar.splitNumber', 5);
  const axisTick = reap(option, 'radar.axisTick', {});
  const axisLabel = reap(option, 'radar.axisLabel', {});
  const axisLine = reap(option, 'radar.axisLine', {});
  const oneAxisLine = reap(option, 'oneAxisLine.axisLine', {});

  const { max, min, interval } = getAxisData(splitNumber, data);

  const opt = {
    polar: {
      radius,
      center,
    },
    radiusAxis: {
      min,
      max,
      zlevel: 2,
      interval,
      splitNumber,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick,
      axisLabel,
      axisLine: {
        ...axisLine,
        show: true,
        ...oneAxisLine,
      },
    },
    angleAxis: {
      show: false,
    },
  };

  return showOneAxisLine ? opt : {};
}

function getRadarTooltip(opts) {
  const { tooltip = {} } = opts;
  if (!tooltip.show) {
    return {
      show: false,
    };
  }
  const data = cloneDeep(tooltip);
  const formatter = reap(data, `formatter`, null);

  data.formatter = formatter
    ? params => {
        return radarFormatterFunc(params, formatter);
      }
    : {};

  return data;
}

function radarFormatterFunc(params, formatterFunc) {
  return newFunc(params, formatterFunc);
}

function newFunc(params, formatterFunc) {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('params', formatterFunc);
    return func(params);
  } catch (err) {
    console.log('newFunc params', params);
    console.log('newFunc formatterFunc', formatterFunc);
    console.log('newFunc error', err.message);
  }
}
