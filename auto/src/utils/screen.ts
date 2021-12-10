export const traVw = (selfWidth, pageWidth) => {
  const value = (selfWidth / pageWidth) * 100;
  return `${value}vw`;
};

export const getVwList = (list, girdLayout) => {
  // 数组以ID为key hash
  const hashData = {};
  for (const v of girdLayout) {
    const { i } = v;
    hashData[i] = v;
  }
  return list.map(v => {
    const { id } = v;
    const gird = hashData[id] || {};
    return {
      ...v,
      ...gird,
    };
  });
};

export const compList: any = [
  {
    key: 'map',
    label: '地图',
    child: [
      {
        label: '蜂鸟地图',
        compName: 'Map',
      },
    ],
  },
  {
    key: 'chart',
    label: '图表',
    child: [
      {
        label: '折线图',
        compName: 'Line',
      },
      {
        label: '柱状图',
        compName: 'Bar',
      },
      {
        label: '饼图',
        compName: 'Pie',
      },
      {
        label: '线柱混合图',
        compName: 'LineAndBar',
      },
      {
        label: '对称柱状图',
        compName: 'CenterBar',
      },
      {
        label: '仪表盘',
        compName: 'DashBoard',
      },
      {
        label: '雷达图',
        compName: 'RadarChart',
      },
    ],
  },
  {
    key: 'target',
    label: '指标',
    child: [
      // {
      //   label: '核心指标',
      //   compName: 'CoreNumber',
      // },
      {
        label: '环形进度条',
        compName: 'CircleProgress',
      },
      {
        label: '线性进度条',
        compName: 'LineProgress',
      },
      // {
      //   label: '仪表盘',
      //   compName: 'DashboardProgress',
      // },
      // {
      //   label: '水球图',
      //   compName: 'WaterPolo',
      // },
    ],
  },
  {
    key: 'text',
    label: '文字',
    child: [
      {
        label: '文本',
        compName: 'Text',
      },
    ],
  },
  {
    key: 'image',
    label: '图片组件',
    child: [
      {
        label: '图片',
        compName: 'Image',
      },
      {
        label: 'SVG',
        compName: 'CustomizeSvg',
      },
    ],
  },
  {
    key: 'material',
    label: '素材',
    child: [
      {
        label: '分割线',
        compName: 'DividingLine',
      },
      {
        label: '圆形',
        compName: 'Circle',
      },
      {
        label: '椭圆',
        compName: 'Oval',
      },
      {
        label: '矩形',
        compName: 'Rectangle',
      },
      {
        label: '箭头',
        compName: 'Arrow',
      },
      {
        label: '边框',
        compName: 'BorderBox',
      },
      {
        label: '三角形',
        compName: 'Triangle',
      },
      {
        label: '直角三角形',
        compName: 'RightTriangle',
      },
      {
        label: '图标',
        compName: 'ImageIcon',
      },
      {
        label: '轮播',
        compName: 'Carousel',
      },
      {
        label: '中英切换',
        compName: 'LocaleSwitch',
      },
      {
        label: '信息栏',
        compName: 'InfoBar',
      },
      {
        label: '占用率分布',
        compName: 'OccupancyDistribution',
      },
      {
        label: '按钮',
        compName: 'CustomizeButton',
      },
      {
        label: '标题栏',
        compName: 'TitleBar',
      },
      {
        label: '按钮组',
        compName: 'ButtonGroup',
      },
      {
        label: '取反按钮',
        compName: 'ToggleButton',
      },
      {
        label: '状态计数',
        compName: 'StatusCount',
      },
      {
        label: '空气质量面板',
        compName: 'AirDataPanel',
      },
      {
        label: '自定义卡片',
        compName: 'CustomizeCard',
      },
      {
        label: '排名表格',
        compName: 'RankTable',
      },
      {
        label: 'Iframe',
        compName: 'Iframe',
      },
      {
        label: '自定义图例',
        compName: 'CustomizeLegend',
      },
      {
        label: 'ValueBox',
        compName: 'ValueBox',
      },
      {
        label: '储物柜',
        compName: 'StatusBox',
      },
      {
        label: '状态按钮',
        compName: 'Lable',
      },
      {
        label: '天气情况',
        compName: 'WeatherPanel',
      },
      {
        label: 'icon组',
        compName: 'Home',
      },
      {
        label: '状态按钮',
        compName: 'Lable',
      },
      {
        label: '状态组',
        compName: 'StatusBox',
      },
    ],
  },
  {
    key: 'container',
    label: '容器组件',
    child: [
      {
        label: '轮播图',
        compName: 'Pre',
        type: 'container',
      },
      {
        label: '标签页',
        compName: 'CustomizeTabs',
        type: 'container',
      },
      {
        label: '平移容器组件',
        compName: 'TranslateContainer',
        type: 'container',
      },
    ],
  },
  {
    key: 'params',
    label: '条件组件',
    child: [
      {
        label: '选择器',
        compName: 'CustomizeSelect',
      },
      {
        label: '区域级联选择',
        compName: 'RegionalCascade',
      },
      {
        label: '日期选择器',
        compName: 'CustomizeDatePicker',
      },
      {
        label: '时间',
        compName: 'Time',
      },
    ],
  },
];

export const nameMapHash = {
  Svg: 'CustomizeSvg',
};

const filterNames = {
  Rectangle: 1,
  Text: 1,
  Oval: 1,
};

export const compNameList = () => {
  return compList
    .reduce((pre, next) => {
      const { child } = next;
      const names = child.map(v => v.compName);
      return [...pre, ...names];
    }, [])
    .filter(v => {
      if (filterNames[v]) {
        return false;
      }
      return true;
    });
};
