import { reap } from '../../../components/SafeReaper';
import objectPath from 'object-path';
import { merge, cloneDeep } from 'lodash';
import { formatterFunc } from './basicUtil';

import {
  getTooltip,
  getOptColor,
  getGraphColor,
  getLegend,
  getGird,
  stack,
  getDataZoomOpt,
  getToolboxOpt,
  getGradientColor,
} from './basicUtil';

export const lineAndBarOpt = ({ categories = [], series = [], option = {}, type }) => {
  const optSeries = option.series || [];

  try {
    const newSeries = getSeries(series, optSeries, type, getOptColor(option));
    const optX = getX(option.xAxis, categories);
    const optY = getY(option.yAxis);
    const legend = getLegend(series, option.legend);
    const optG = getGird(option.grid);
    const title = option.title;
    const color = getGraphColor(option);
    const tooltip = getTooltip(option);
    const dataZoom = getDataZoomOpt(option);
    const toolbox = getToolboxOpt(option);

    let initData = {
      legend,
      title,
      grid: {
        ...optG,
      },
      xAxis: optX,
      yAxis: optY,
      series: newSeries,
      color,
      tooltip,
      dataZoom,
      toolbox,
    };

    //  x y 翻转
    if (optSeries.xyInverse) {
      //   const newY = JSON.parse(JSON.stringify(initData.xAxis));
      //   const newX = JSON.parse(JSON.stringify(initData.yAxis));
      initData.xAxis = getY(option.yAxis);
      initData.yAxis = getX(option.xAxis, categories);
    }

    return initData;
  } catch (err) {}
};

function getSeries(series = [], optSeries, type, colors) {
  // 数据长度
  const seriesDataLength = reap(series[0], 'data', []).length;

  const customizeBarWidth = reap(optSeries, 'customizeBarWidth', false);
  const barBorderLTRadius = reap(optSeries, 'barBorderLTRadius', 0);
  const barBorderRTRadius = reap(optSeries, 'barBorderRTRadius', 0);
  const barBorderRBRadius = reap(optSeries, 'barBorderRBRadius', 0);
  const barBorderLBRadius = reap(optSeries, 'barBorderLBRadius', 0);

  const barBorderRadius = [
    barBorderLTRadius,
    barBorderRTRadius,
    barBorderRBRadius,
    barBorderLBRadius,
  ];

  const barWithList = reap(optSeries, 'barWithList', [{ count: 0, width: 20 }]);
  let currentBarWidth = 20;

  if (customizeBarWidth) {
    [...barWithList]
      .sort((a, b) => b.count - a.count)
      .map(item => {
        const count = reap(item, 'count', 0);
        const width = reap(item, 'width', 20);
        if (seriesDataLength < count) {
          currentBarWidth = width;
        }
        return item;
      });
  }

  let arr = series.map((v, index) => {
    const data = cloneDeep(
      merge(
        {},
        {
          itemStyle: { barBorderRadius },
          type,
          ...v,
        },
        optSeries,
      ),
    );

    if (data.stack) {
      data.stack = stack;
    }

    if (data.barGap) {
      data.barGap = '-100%';
    } else {
      data.barGap = '30%';
    }
    const zlevel = reap(data, `zlevels[${index}]`, 0);
    data.zlevel = zlevel;
    if (data.barWidth) {
      data.barWidth = `${data.barWidth}%`;
    }
    // 自定义宽度比例
    if (customizeBarWidth) {
      data.barWidth = `${currentBarWidth}%`;
    }

    const formatter = reap(data, `label.formatter`, null);
    if (formatter) {
      if (!data.label) {
        data.label = {};
      }
      data.label.formatter = params => {
        return formatterFunc(params, formatter);
      };
    }
    const openAreaStyle = reap(data, `areaStyle.openAreaStyle`, null);
    const opacity = reap(data, `areaStyle.opacity`, null);
    if (openAreaStyle) {
      data.areaStyle = {};
      if (opacity) {
        data.areaStyle.opacity = opacity;
      }
    } else {
      delete data.areaStyle;
    }

    const isOpenGradient = reap(optSeries, `areaStyle.isOpenGradient`, false);

    if (isOpenGradient) {
      objectPath.set(data, 'areaStyle.color', getGradientColor(colors[index]));
    }

    return data;
  });

  if (optSeries.stack && optSeries.stackInterval) {
    const seriesData = series[0].data;
    arr = arr.map(v => {
      return {
        ...v,
        barGap: '70%',
      };
    });
    const res = arr.reduce((pre, next, index) => {
      const name = `help${next.name}`;
      const nextData = arr[index + 1];
      const lastArr = arr.slice(index + 1);
      return [
        ...pre,
        next,
        getStackIntervalOpts(
          name,
          seriesData,
          optSeries,
          next.data,
          nextData,
          lastArr,
          barBorderRadius,
        ),
      ];
    }, []);
    res.pop();
    arr = res;
  }
  return arr;
}

function getX(optX, categories) {
  let init = {
    type: 'category',
    data: categories,
  };
  merge(init, optX);
  return init;
}

function getY(optY) {
  let init = {
    type: 'value',
  };
  merge(init, optY);
  return init;
}

function getStackIntervalOpts(
  name,
  seriesData,
  optSeries,
  data,
  nextData,
  lastArr,
  barBorderRadius,
) {
  const _color = reap(optSeries, `stackIntervalBgc`, '#fffff');
  const stackInterval = reap(optSeries, `stackInterval`, 0);

  return {
    name,
    type: 'bar',
    stack,
    itemStyle: {
      barBorderColor: _color,
      color: _color,
      barBorderRadius,
    },
    emphasis: {
      itemStyle: {
        barBorderColor: _color,
        color: _color,
      },
    },
    data: seriesData.map((v, index) => {
      const value = data[index];
      // 自己是0 的话，自己的辅助元素是null
      if (!value) {
        return null;
      }

      // 如果是最后一个数据辅助元素是null
      if (!nextData) {
        return null;
      }

      // 如果自己的下一条开始都是 数据是0,自己的辅助元素是null
      if (isAllZero(lastArr, index)) {
        return null;
      }

      return stackInterval;
    }),
  };
}

function isAllZero(arr, dataIndex) {
  const zeroLength = arr.reduce((pre, next) => {
    const { data } = next;
    if (!data[dataIndex]) {
      return pre + 1;
    }
    return pre;
  }, 0);
  return zeroLength === arr.length;
}
