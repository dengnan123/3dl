import { reap } from '../../../components/SafeReaper';

import { getTooltip, getGraphColor, getToolboxOpt } from './basicUtil';

export const dashBoardOpt = ({ option = {}, value = 0 }) => {
  const optSeries = option.series || [];
  const newSeries = getDashBoardSeries(value, optSeries);

  const title = option.title;
  const color = getGraphColor(option);
  const tooltip = getTooltip(option);
  const toolbox = getToolboxOpt(option);

  const initData = {
    title,
    series: newSeries,
    color,
    tooltip,
    toolbox,
  };

  return initData;
};

function getDashBoardSeries(value, optSeries) {
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
            [value / 100, '#333FFF'],
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
      ...item.axisTick,
    };
    item.splitLine = {
      show: false,
      ...item.splitLine,
    };
    item.detail = {
      show: false,
      ...item.detail,
    };
    item.axisLabel = {
      show: false,
      ...item.axisLabel,
    };
    return item;
  });

  return _series.length ? _series : initSeries;
}
