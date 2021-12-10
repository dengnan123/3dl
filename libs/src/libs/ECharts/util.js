import { reap } from '../../components/SafeReaper';
import objectPath from 'object-path';
import { merge, isArray, cloneDeep, isString } from 'lodash';
// import hexRgb from 'hex-rgb';
import hexRgb from 'hex-to-rgb';

const initColors = [
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];
const stack = '重合显示';

const getGradientColor = color => {
  const [red, green, blue] = hexRgb(color);
  const colorStops = new Array(10).fill(1).map((v, index) => {
    const last = (index + 1) / 10;
    const offset = 1 - last;
    return {
      offset,
      color: `rgba(${red},${green},${blue},${last})`, // 0% 处的颜色
    };
  });
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops,
    global: false, // 缺省为 false
  };
};

const newFunc = (params, formatterFunc) => {
  // eslint-disable-next-line no-new-func
  const func = new Function('params', `${formatterFunc}`);
  return func(params);
};

const formatterFunc = (params, formatterFunc) => {
  if (isArray(params)) {
    const filterArr = params.filter(v => {
      if (v.seriesName.includes('help')) {
        return false;
      }
      return true;
    });
    if (!formatterFunc) {
      const title = `${filterArr[0].name}<br/>`;
      return filterArr.reduce((pre, next) => {
        return pre + next.marker + '    ' + next.seriesName + '  ' + next.value + '<br/>';
      }, title);
    }
    return newFunc(filterArr, formatterFunc);
  }

  if (isString(params)) {
    if (!params.includes('help')) {
      if (!formatterFunc) {
        return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
      }
      return newFunc(params, formatterFunc);
    }
    return;
  }

  if (!params.name.includes('help')) {
    if (!formatterFunc) {
      return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
    }
    return newFunc(params, formatterFunc);
  }
  // return func(params);
};

export const lineAndBarOpt = ({ categories = [], series = [], option = {}, type }) => {
  const optSeries = option.series || [];

  const newSeries = getSeries(series, optSeries, type, getOptColor(option));
  const optX = getX(option.xAxis, categories);
  const optY = getY(option.yAxis);
  const legend = getLegend(series, option.legend);
  const optG = getG(option.grid);
  const title = option.title;
  let initData = {
    legend,
    title,
    grid: {
      ...optG,
    },
    xAxis: optX,
    yAxis: optY,
    series: newSeries,
    color: getOptColor(option),
    tooltip: getTooltip(option),
  };

  //  x y 翻转
  if (optSeries.xyInverse) {
    const newY = JSON.parse(JSON.stringify(initData.xAxis));
    const newX = JSON.parse(JSON.stringify(initData.yAxis));
    initData.xAxis = newX;
    initData.yAxis = newY;
  }
  return initData;
};

export const pieOpt = ({ categories = [], series = [], option = {} }) => {
  const optSeries = option.series || {};
  const newSeries = getPieSeries(series, optSeries, option.grid);
  const optL = getPieLegend(categories, option.legend);
  const optG = getG(option.grid);
  const title = option.title;
  let initData = {
    title,
    grid: optG,
    legend: {
      ...optL,
    },
    series: newSeries,
    color: getOptColor(option),
    tooltip: getTooltip(option),
  };

  return initData;
};

function getOptColor(option) {
  if (!option.color) {
    return initColors;
  }
  if (!isArray(option.color)) {
    return;
  }

  const res = initColors.map((v, index) => {
    // const customColor = reap(option, `color[${index}].customColor`, null);
    // console.log('customColorcustomColor', customColor);
    const color = reap(option, `color`, []);
    if (color && color.length) {
      if (color[index]) {
        return color[index];
      }
    }
    // if (customColor) {
    //   return customColor;
    // }
    return v;
  });

  return res;
}

function getSeries(series, optSeries, type, colors) {
  let arr = series.map((v, index) => {
    const data = cloneDeep(
      merge(
        {},
        {
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

    const formatter = reap(data, `label.formatter`, null);
    if (formatter) {
      // eslint-disable-next-line no-new-func
      const func = new Function('params', formatter);
      data.label.formatter = func;
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
        getStackIntervalOpts(name, seriesData, optSeries, next.data, nextData, lastArr),
      ];
    }, []);
    res.pop();
    arr = res;
  }

  return arr;
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

function getStackIntervalOpts(name, seriesData, optSeries, data, nextData, lastArr) {
  const _color = reap(optSeries, `stackIntervalBgc`, '#fffff');
  const stackInterval = reap(optSeries, `stackInterval`, 0);

  return {
    name,
    type: 'bar',
    stack,
    itemStyle: {
      barBorderColor: _color,
      color: _color,
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

function getLegend(series, optL = {}) {
  const data = series.map(v => {
    const value = {
      name: v.name,
    };
    const icon = reap(optL, `data.icon`, '');
    if (icon) {
      value.icon = `path://${icon}`;
    }
    return value;
  });

  let legend = {
    ...optL,
  };
  legend.data = data;
  if (legend.position === 'top') {
    legend.top = 0;
    legend.left = 'center';
  }
  if (legend.position === 'left') {
    legend.left = 0;
    legend.orient = 'vertical';
  }
  if (legend.position === 'right') {
    legend.right = 0;
    legend.orient = 'vertical';
  }
  if (legend.position === 'bottom') {
    legend.left = 'center';
    legend.bottom = 0;
  }
  return legend;
}

function getPieLegend(categories, optL = {}) {
  const data = categories.map(v => {
    const value = {
      name: v,
    };
    const icon = reap(optL, `data.icon`, '');
    if (icon) {
      value.icon = `path://${icon}`;
    }
    return value;
  });
  let legend = {
    ...optL,
  };
  const formatter = reap(optL, `formatter`, null);

  if (formatter) {
    // eslint-disable-next-line no-new-func
    legend.formatter = params => {
      return formatterFunc(params, formatter);
    };
  }
  legend.data = data;
  if (legend.position === 'top') {
    legend.top = 0;
    legend.left = 'center';
  }
  if (legend.position === 'left') {
    legend.left = 0;
    legend.orient = 'vertical';
  }
  if (legend.position === 'right') {
    legend.right = 0;
    legend.orient = 'vertical';
  }
  if (legend.position === 'bottom') {
    legend.left = 'center';
    legend.bottom = 0;
  }
  return legend;
}

function getG(optG) {
  if (!optG) {
    return {};
  }
  const _optG = JSON.parse(JSON.stringify(optG));
  if (_optG.left) {
    _optG.left = `${_optG.left}%`;
  }
  if (_optG.right) {
    _optG.right = `${_optG.right}%`;
  }
  return _optG;
}

function getPieSeries(series, optSeries, grid) {
  const roseType = reap(optSeries, 'roseType', false);
  const showLabel = reap(optSeries, 'showLabel', true);
  const labelFontSize = reap(optSeries, 'labelFontSize', 12);
  const labelFontColor = reap(optSeries, 'labelFontColor');
  let _opt = {
    type: 'pie',
    label: {
      color: labelFontColor,
      fontSize: labelFontSize,
      show: showLabel,
    },
  };

  if (roseType) {
    _opt['roseType'] = 'radius';
  }

  const curOptSeries = reap(optSeries, 'series', []);

  const _series = series.map((v, index) => {
    const optSeriesData = reap(curOptSeries[index], 'data', []);
    const data = v.data.map((d, i) => ({ ...d, ...optSeriesData[i] }));
    const radius = [
      `${reap(curOptSeries[index], 'radius[0]', 0)}%`,
      `${reap(curOptSeries[index], 'radius[1]', 100)}%`,
    ];

    return {
      ...v,
      ..._opt,
      ...grid,
      radius,
      data,
    };
  });

  return _series;
}

export const getTooltip = opts => {
  const { tooltip = {} } = opts;
  const data = cloneDeep(tooltip);
  const formatter = reap(data, `formatter`, null);
  if (formatter) {
    // eslint-disable-next-line no-new-func
    data.formatter = params => {
      return formatterFunc(params, formatter);
    };
  }

  return data;
};

export const dashBoardOpt = ({ option = {}, value = 0 }) => {
  const optSeries = option.series || [];
  const newSeries = getDashBoardSeries(value, optSeries);
  const title = option.title;

  const initData = {
    title,
    series: newSeries,
    color: getOptColor(option),
    tooltip: getTooltip(option),
  };

  return initData;
};

function getDashBoardSeries(value = 30, optSeries) {
  const initSeries = [
    {
      name: '速度',
      min: 0,
      max: 100,
      radius: '100%',
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.5, '#333FFF'],
            [1, '#d8d8d8'],
          ],
        },
      },
      data: [
        {
          itemStyle: {
            color: '#FFBB51',
          },
          value,
        },
      ],
      type: 'gauge',
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      detail: {
        show: false,
      },
    },
  ];

  const _series = optSeries.map(item => {
    const min = reap(item, 'min', 0);
    const max = reap(item, 'max', 100);
    const total = max - min;
    item.type = 'gauge';
    item.axisLine.lineStyle.color[0][0] = (value - min) / total;
    item.axisLine.lineStyle.color[1][0] = 1;
    item.data[0].value = value;
    item.axisTick = {
      show: false,
    };
    item.splitLine = {
      show: false,
    };
    item.detail = {
      show: false,
    };
    item.axisLabel = {
      show: false,
    };
    return item;
  });

  return !!_series.length ? _series : initSeries;
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

function getScatterPlotSeries(series, optSeries, optBasicSeriesConfig, type) {
  let arr = series.map((v, index) => {
    const data = cloneDeep(
      merge(
        {},
        {
          type,
          ...v,
          ...optBasicSeriesConfig,
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

  return arr;
}

export const ScatterPlotOpt = ({ categories = [], series = [], option = {}, type = 'scatter' }) => {
  const optSeries = option.series || [];
  const optBasicSeriesConfig = option.basicSeriesConfig || {};
  const newSeries = getScatterPlotSeries(series, optSeries, optBasicSeriesConfig, type);
  const optX = getScatterPlotX(option.xAxis, categories);
  const optY = getScatterPlotY(option.yAxis);
  const legend = getLegend(series, option.legend);
  const optG = getG(option.grid);
  const title = option.title;
  let initData = {
    title,
    legend,
    grid: {
      ...optG,
    },
    xAxis: optX,
    yAxis: optY,
    series: newSeries,
    color: getOptColor(option),
    tooltip: getTooltip(option),
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

function getAuxiliaryData(data) {
  const _idata = data.map(item => -item / 2);
  return _idata;
}

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
            stack: '总量',
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
    stack: '总量',
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
  return [init, { ...init, position: 'right', data: categories[1] }];
}

export const centerBarOpt = ({ categories = [], series = [], option = {}, type = 'bar' }) => {
  const optSeries = option.series || [];
  const optBasicSeriesConfig = option.basicSeriesConfig || {};
  const newSeries = getCenterBarSeries(series, optSeries, optBasicSeriesConfig, type);
  const optX = getCenterBarX(option.xAxis, categories);
  const optY = getCenterBarY(option.yAxis, categories);
  const legend = getLegend(series, option.legend);
  const optG = getG(option.grid);
  const title = option.title;
  let initData = {
    title,
    legend,
    grid: {
      ...optG,
    },
    xAxis: optX,
    yAxis: optY,
    series: newSeries,
    color: getOptColor(option),
    tooltip: getTooltip(option),
  };

  return initData;
};

/**
 * 截取百分比数字或者px
 * @param {String | Number} value
 */
export function getPercentOrPx(value) {
  if (!value) {
    return;
  }
  let number = parseFloat(value);
  if (number.toString() === 'NaN') {
    number = 0;
  }
  let percentOrPx = '';
  if (value.includes('%')) {
    percentOrPx = '%';
  }
  return `${number}${percentOrPx}`;
}
