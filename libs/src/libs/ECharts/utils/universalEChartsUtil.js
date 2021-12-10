import { useFilterDataEs5Func } from '../../../helpers/compile';

export const useUniversalEChartsOptions = props => {
  const { style } = props;
  const opts = useFilterDataEs5Func({ filterFuncEs5Code: style.optionsFunc, data: props });
  return opts || getDefaultOpts();
};

export function getDefaultOpts() {
  const data = [15, 30, 50, 50, 55, 60, 80, 50, 100, 130];
  const colors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ];
  const option_data = {
    item0: {
      unit: '万',
      data: data.map((n, index) => ({
        value: n,
        itemStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 1,
                color: colors[index % colors.length],
              },
              {
                offset: 0,
                color: '#ffffff',
              },
            ],
            globalCoord: false,
          },
        },
      })),
      name: '总兵力',
    },
    legend: ['总兵力', '综合战力'],
    dates: ['周朝', '秦朝', '汉朝', '两晋', '隋朝', '唐朝', '宋朝', '元朝', '明朝', '清朝'],
    title: '中国历代军力对比',
  };

  return {
    angleAxis: {
      type: 'category',
      boundaryGap: false,
      startAngle: 90,
      axisLine: {
        lineStyle: {
          color: '#ccc', // 外环颜色
        },
      },
      axisLabel: {
        fontSize: 14,
        color: '#666', // 外环文字颜色
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      data: option_data.dates,
    },
    radiusAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    polar: {
      radius: '70%',
      center: ['50%', '50%'],
      zlevel: 11,
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'bar',
        name: option_data.item0.name,
        data: option_data.item0.data,
        coordinateSystem: 'polar',
      },
    ],
  };
}
