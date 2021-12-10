import { Icon } from 'antd';
import {
  Map,
  AMap,
  EChartMap,
  ChartLine,
  ChartBar,
  LineAndBar,
  CenterBar,
  ChartPie,
  DashBoard,
  ScatterPlot,
  RadarChart,
  CoreNumber,
  Table,
  // RollTable,
  PropertyTable,
  RankTable,
  AntdTable,
  FilterTable,
  Text,
  Image,
  CustomInput,
  Line,
  Circle,
  Oval,
  Rectangle,
  Arrow,
  BorderBox,
  Triangle,
  RightTriangle,
  ImageIcon,
  // Carousel,
  Time,
  LocaleSwitch,
  InfoBar,
  OccupancyDistribution,
  Title,
  ProgressNumber,
  LineProgress,
  DashboardProgress,
  WaterPolo,
  CustomizeButton,
  ToggleButton,
  ButtonGroup,
  NewButtonGroup,
  Pre,
  CustomizeTabs,
  CustomizeDatePicker,
  StatusCount,
  AirDataPanel,
  SearchList,
  TranslateContainer,
  RegionalCascade,
  AntdMenu,
  CustomizeCard,
  Iframe,
  CustomizeLegend,
  CustomizeSelect,
  CustomizeSvg,
  WeatherSvg,
  ClockSvg,
  AntdBreadcrumbSvg,
} from './icon';

export const menus = [
  {
    key: 'basic',
    label: '标准化',
    icon: 'area-chart',
    child: [
      {
        label: '工位图例',
        compName: 'MapStatus',
        icon: <Map />,
      },
    ],
  },
  {
    key: 'map',
    label: '地图',
    icon: 'area-chart',
    child: [
      {
        label: '蜂鸟地图',
        compName: 'Map',
        icon: <Map />,
      },
      {
        label: 'AN-MAP',
        compName: 'AMap',
        icon: <AMap />,
      },
      {
        label: 'EChartMap',
        compName: 'EChartMap',
        icon: <EChartMap />,
      },
      {
        label: '(新)蜂鸟地图',
        compName: 'NewFengMap',
        icon: <Map />,
      },
    ],
  },
  {
    key: 'chart',
    label: '图表',
    icon: 'area-chart',
    child: [
      {
        label: '折线图',
        compName: 'Line',
        libPath: 'ECharts/Line',
        icon: <ChartLine />,
      },
      {
        label: '柱状图',
        compName: 'Bar',
        libPath: 'ECharts/Bar',
        icon: <ChartBar />,
      },
      {
        label: '中部对齐柱状图',
        compName: 'CenterBar',
        libPath: 'ECharts/CenterBar',
        icon: <CenterBar />,
      },
      {
        label: '饼图',
        compName: 'Pie',
        libPath: 'ECharts/Pie',
        icon: <ChartPie />,
      },
      {
        label: '线柱混合图',
        compName: 'LineAndBar',
        libPath: 'ECharts/LineAndBar',
        icon: <LineAndBar />,
      },
      {
        label: '仪表盘',
        compName: 'DashBoard',
        libPath: 'ECharts/DashBoard',
        icon: <DashBoard />,
      },
      {
        label: '仪表盘(资产)',
        compName: 'DashBoardFinance',
        libPath: 'ECharts/DashBoardFinace',
        icon: <DashBoard />,
      },
      {
        label: '散点图',
        compName: 'ScatterPlot',
        libPath: 'ECharts/ScatterPlot',
        icon: <ScatterPlot />,
      },
      {
        label: '雷达图',
        compName: 'RadarChart',
        libPath: 'ECharts/RadarChart',
        icon: <RadarChart />,
      },
      {
        label: '万用ECharts',
        compName: 'UniversalECharts',
        libPath: 'ECharts/UniversalECharts',
        icon: <RadarChart />,
      },
      {
        label: '3D饼图',
        compName: 'Am3DPie',
        libPath: 'AmCharts/Am3DPie',
        icon: <ChartPie />,
      },
    ],
  },
  {
    key: 'table',
    label: '表格',
    icon: 'table',
    child: [
      {
        label: '表格',
        compName: 'AutoTabel',
        libPath: 'Table/AutoTabel',
        icon: <Table />,
      },
      {
        label: '属性表格',
        compName: 'PropertyTable',
        libPath: 'Table/PropertyTable',
        icon: <PropertyTable />,
      },
      {
        label: '排名表格',
        compName: 'RankTable',
        libPath: 'Table/RankTable',
        icon: <RankTable />,
      },
      {
        label: 'Antd表格',
        compName: 'AntdTable',
        libPath: 'Table/AntdTable',
        icon: <AntdTable />,
      },
      {
        label: 'FM表格',
        compName: 'FilterTable',
        libPath: 'Table/FilterTable',
        icon: <FilterTable />,
      },
    ],
  },
  {
    key: 'AntdComp',
    label: 'antd',
    child: [
      {
        label: '复选框',
        compName: 'Checkbox',
        libPath: 'AntdComp/Checkbox',
      },
    ],
  },
  {
    key: 'target',
    label: '指标',
    icon: 'percentage',
    child: [
      {
        label: '核心指标',
        compName: 'CoreNumber',
        libPath: 'Target/CoreNumber',
        icon: <CoreNumber />,
      },
      {
        label: '环形进度条',
        compName: 'CircleProgress',
        libPath: 'Target/CircleProgress',
        icon: <ProgressNumber />,
      },
      {
        label: '线性进度条',
        compName: 'LineProgress',
        libPath: 'Target/LineProgress',
        icon: <LineProgress />,
      },
      {
        label: '仪表盘',
        compName: 'DashboardProgress',
        libPath: 'Target/DashboardProgress',
        icon: <DashboardProgress />,
      },
      {
        label: '水球图',
        compName: 'WaterPolo',
        libPath: 'Target/WaterPolo',
        icon: <WaterPolo />,
      },
      {
        label: '电池进度条',
        compName: 'BatteryProgressBar',
        icon: <LineProgress />,
      },
    ],
  },
  {
    key: 'text',
    label: '文字',
    icon: 'highlight',
    child: [
      {
        label: '文本',
        compName: 'Text',
        icon: <Text />,
      },
    ],
  },
  {
    key: 'function',
    label: '功能组件',
    icon: 'control',
    child: [
      {
        label: '主页按钮',
        compName: 'Home',
        icon: <Icon type="home" />,
      },
      // {
      //   label: '轮播',
      //   compName: 'Carousel',
      //   icon: <Carousel />,
      // },
      {
        label: '中英切换',
        compName: 'LocaleSwitch',
        icon: <LocaleSwitch />,
      },
      {
        label: '日期选择器',
        compName: 'CustomizeDatePicker',
        icon: <CustomizeDatePicker />,
      },
      {
        label: '搜索列表',
        compName: 'SearchList',
        icon: <SearchList />,
      },
      {
        label: 'Iframe',
        compName: 'Iframe',
        icon: <Iframe />,
      },
      {
        label: '区域级联选择',
        compName: 'RegionalCascade',
        icon: <RegionalCascade />,
      },
      {
        label: '下拉选择',
        compName: 'CustomizeSelect',
        icon: <RegionalCascade />,
      },
      {
        label: '自定义Form',
        compName: 'CustomizeForm',
        icon: <RegionalCascade />,
      },
      {
        label: '星巴克Modal',
        compName: 'StarbucksModal',
        icon: <RegionalCascade />,
      },
      {
        label: 'FAM自定义下拉选择',
        compName: 'FamSelect',
        icon: <RegionalCascade />,
      },
      {
        label: '自定义Modal(详情)',
        compName: 'CustomizeModal',
        icon: <RegionalCascade />,
      },
      {
        label: 'ItemCard',
        compName: 'ItemCard',
        icon: <RegionalCascade />,
      },
      {
        label: 'GridCard',
        compName: 'GridCard',
        icon: <RegionalCascade />,
      },
      {
        label: 'AntdMenu',
        compName: 'AntdMenu',
        icon: <AntdMenu />,
      },
      {
        label: 'SchemaForm',
        compName: 'SchemaForm',
        icon: <Image />,
      },
      {
        label: 'InitialSearch',
        compName: 'InitialSearch',
        icon: <Image />,
      },
      {
        label: '水平滑动面板容器',
        compName: 'HorizontalScrollPanelContainer',
        libPath: 'HorizontalScrollPanelContainer',
        icon: <Image />,
      },
      {
        label: '动态增减器',
        compName: 'AddDeleteContainer',
        libPath: 'AddDeleteContainer',
        icon: <Image />,
      },
      {
        label: '页面刷新',
        compName: 'ReloadProject',
        libPath: 'ReloadProject',
        icon: <Image />,
      },
      {
        label: '输入框',
        compName: 'CustomInput',
        libPath: 'CustomInput',
        icon: <CustomInput />,
      },
      {
        label: '工具集合',
        compName: 'PageTools',
        libPath: 'PageTools',
        icon: <CustomInput />,
      },
      {
        label: '定时工具',
        compName: 'TimerTools',
        libPath: 'TimerTools',
        icon: <CustomInput />,
      },
      {
        label: '面包屑',
        compName: 'AntdBreadcrumb',
        libPath: 'AntdBreadcrumb',
        icon: <AntdBreadcrumbSvg />,
      },
      {
        label: '天气组件2',
        compName: 'CustomizeWeatherPanel',
        libPath: 'CustomizeWeatherPanel',
      },
    ],
  },
  {
    key: 'display',
    label: '显示面板',
    icon: 'laptop',
    child: [
      {
        label: '标题栏',
        compName: 'TitleBar',
        icon: <Title />,
      },
      {
        label: '信息栏',
        compName: 'InfoBar',
        icon: <InfoBar />,
      },
      {
        label: '占用率分布',
        compName: 'OccupancyDistribution',
        icon: <OccupancyDistribution />,
      },
      {
        label: '空气质量面板',
        compName: 'AirDataPanel',
        icon: <AirDataPanel />,
      },
      {
        label: '自定义卡片',
        compName: 'CustomizeCard',
        icon: <CustomizeCard />,
      },
      {
        label: '天气情况',
        compName: 'WeatherPanel',
        icon: <WeatherSvg />,
      },
      {
        label: '室内温度',
        compName: 'HouseWeatherPanel',
        icon: <WeatherSvg />,
      },
      {
        label: '面板矩阵',
        compName: 'PanelMatrix',
      },
      {
        label: '分页',
        compName: 'Pagination',
      },
      {
        label: '时钟',
        compName: 'Clock',
        icon: <ClockSvg />,
      },
      {
        label: '时间组',
        compName: 'TimeGroup',
        icon: <ClockSvg />,
      },
      {
        label: '数字滚动',
        compName: 'NumberScroll',
        icon: <CoreNumber />,
      },
      {
        label: '图片组',
        compName: 'ImagesGroup',
        icon: <Image />,
      },
      {
        label: '自定义输入框',
        compName: 'CustomizeInput',
        icon: <Image />,
      },
      {
        label: '水平滑动面板',
        compName: 'HorizontalScrollPanel',
        libPath: 'HorizontalScrollPanel',
        icon: <Image />,
      },
      {
        label: '列表',
        compName: 'CustomList',
        libPath: 'CustomList',
        icon: <Image />,
      },
      {
        label: 'Kinect',
        compName: 'Kinect',
        icon: <Pre />,
      },
      {
        label: 'FoddingPannel',
        compName: 'FoddingPannel',
        icon: <Pre />,
      },
    ],
  },
  {
    key: 'Material',
    label: '素材',
    icon: 'build',
    child: [
      {
        label: '图片',
        compName: 'Image',
        icon: <Image />,
      },
      {
        label: '分割线',
        compName: 'DividingLine',
        libPath: 'Material/DividingLine',

        icon: <Line />,
      },
      {
        label: '圆形',
        compName: 'Circle',
        libPath: 'Material/Circle',
        icon: <Circle />,
      },
      {
        label: '椭圆',
        compName: 'Oval',
        libPath: 'Material/Oval',
        icon: <Oval />,
      },
      {
        label: '矩形',
        compName: 'Rectangle',
        libPath: 'Material/Rectangle',
        icon: <Rectangle />,
      },
      {
        label: '箭头',
        compName: 'Arrow',
        libPath: 'Material/Arrow',
        icon: <Arrow />,
      },
      {
        label: '边框',
        compName: 'BorderBox',
        libPath: 'Material/BorderBox',
        icon: <BorderBox />,
      },
      {
        label: '三角形',
        compName: 'Triangle',
        libPath: 'Material/Triangle',
        icon: <Triangle />,
      },
      {
        label: '直角三角形',
        compName: 'RightTriangle',
        libPath: 'Material/RightTriangle',
        icon: <RightTriangle />,
      },
      {
        label: '图标',
        compName: 'ImageIcon',
        libPath: 'Material/ImageIcon',
        icon: <ImageIcon />,
      },
      {
        label: '时间',
        compName: 'Time',
        icon: <Time />,
      },
      {
        label: '星期',
        compName: 'WeekComponent',
        icon: <Time />,
      },
      {
        label: '按钮',
        compName: 'CustomizeButton',
        icon: <CustomizeButton />,
      },
      {
        label: '取反按钮',
        compName: 'ToggleButton',
        icon: <ToggleButton />,
      },
      {
        label: '按钮组',
        compName: 'ButtonGroup',
        icon: <ButtonGroup />,
      },
      {
        label: '新版按钮组',
        compName: 'NewButtonGroup',
        icon: <NewButtonGroup />,
      },
      {
        label: '上下页',
        compName: 'Pre',
        icon: <Pre />,
      },
      {
        label: '标签页',
        compName: 'CustomizeTabs',
        icon: <CustomizeTabs />,
      },
      {
        label: '状态计数',
        compName: 'StatusCount',
        icon: <StatusCount />,
      },
      {
        label: '平移容器',
        compName: 'TranslateContainer',
        icon: <TranslateContainer />,
      },
      {
        label: '跑马灯',
        compName: 'Marquee',
        icon: <TranslateContainer />,
      },
      {
        label: 'Lable',
        compName: 'Lable',
        icon: <TranslateContainer />,
      },
      {
        label: 'StatusBox',
        compName: 'StatusBox',
        icon: <TranslateContainer />,
      },
      {
        label: 'ValueBox',
        compName: 'ValueBox',
        icon: <TranslateContainer />,
      },
      {
        label: '区域级联选择',
        compName: 'RegionalCascade',
        icon: <RegionalCascade />,
      },
      {
        label: '自定义卡片',
        compName: 'CustomizeCard',
        icon: <CustomizeCard />,
      },
      {
        label: 'Iframe',
        compName: 'Iframe',
        icon: <Iframe />,
      },
      {
        label: '自定义图例',
        compName: 'CustomizeLegend',
        icon: <CustomizeLegend />,
      },
      {
        label: '自定义下拉框',
        compName: 'CustomizeSelect',
        icon: <CustomizeSelect />,
      },
      {
        label: 'Svg',
        compName: 'CustomizeSvg',
        icon: <CustomizeSvg />,
      },
      {
        label: 'Modal',
        compName: 'Modal',
        icon: <TranslateContainer />,
      },
      {
        label: 'AutoText',
        compName: 'AutoText',
        icon: <CustomizeSvg />,
      },
      {
        label: 'Mask',
        compName: 'Mask',
        icon: <CustomizeSvg />,
      },
      {
        label: '自动滚动文字',
        compName: 'AutoScrollText',
      },
      {
        label: '富士通业务组件',
        compName: 'FSTcomponent',
        icon: <CustomizeSvg />,
      },
      {
        label: '自定义Carousel',
        compName: 'CustomizeCarousel',
        icon: <CustomizeSvg />,
      },
      {
        label: '竖排按钮组',
        compName: 'VerticalButtons',
        icon: <NewButtonGroup />,
      },
      {
        label: '图片切换',
        compName: 'ImageSwitcher',
        icon: <Image />,
      },
    ],
  },
  {
    key: 'media',
    label: '媒体库',
    icon: 'laptop',
    child: [
      {
        label: '视频播放器',
        compName: 'Video',
        icon: <Title />,
      },
      {
        label: 'Loading',
        compName: 'Loading',
        icon: <Title />,
      },
      {
        label: 'MeetingAuthBtn',
        compName: 'MeetingAuthBtn',
        icon: <Title />,
      },
      {
        label: 'OkModal',
        compName: 'OkModal',
        icon: <Title />,
      },
      {
        label: 'QrCode',
        compName: 'QrCode',
        icon: <Title />,
      },
    ],
  },
  {
    key: 'logic',
    label: '纯逻辑组件库',
    child: [
      {
        label: '监听无操作',
        libPath: 'Logic/WatchNoAction',
        compName: 'WatchNoAction',
      },
      {
        label: '监听数据源变化',
        libPath: 'Logic/WatchDataChange',
        compName: 'WatchDataChange',
      },
    ],
  },
  {
    key: 'Meeting',
    label: '会议室组件',
    child: [
      { compName: 'MeetingList', label: '会议室列表', libPath: 'Meeting/MeetingList' },
      {
        compName: 'MeetingListDrawer',
        label: '会议室列表侧滑栏',
        libPath: 'Meeting/MeetingListDrawer',
      },
      {
        compName: 'MeetingBookingBtn',
        label: '抽屉式预订按钮组',
        libPath: 'Meeting/MeetingBookingBtn',
      },
      {
        compName: 'OkModal',
        label: '提示弹窗',
        libPath: 'OkModal',
      },
      {
        compName: 'NewThemeModal',
        label: '新主题提示弹窗',
        libPath: 'NewThemeModal',
      },
      {
        compName: 'MeetingLogic',
        label: '复杂逻辑载体',
        libPath: 'MeetingLogic',
      },
    ],
  },
  {
    key: 'DataCenter',
    label: '数据中心组件',
    child: [
      {
        compName: 'MobileRegionalCascade',
        label: 'Mobile省市区下拉选择',
      },
      {
        compName: 'ListCountStatus',
        label: '列表数据状态',
      },
    ],
  },
  {
    key: 'Roche',
    label: '罗氏',
    child: [
      {
        compName: 'Lockers',
        label: '储物柜',
      },
      {
        label: '罗氏专用链接显示',
        compName: 'TextStatus',
        icon: <Text />,
      },
    ],
  },
  {
    key: 'jiahui',
    label: '嘉会医院',
    child: [
      {
        compName: 'ToiletComponent',
        label: '厕位组件',
      },
      {
        compName: 'NewToiletComponent',
        label: '厕位组件2',
      },
      {
        compName: 'JiahuiModal',
        label: 'Modal',
      },
      {
        compName: 'CustomizeAir',
        label: '空气质量',
      },
      {
        compName: 'CustomSelectSearch',
        label: '搜索组建',
      },
      {
        compName: 'CustomAlert',
        label: '弹框组件',
      },
      {
        compName: 'NormalList',
        label: '列表组件',
      },
    ],
  },
  {
    key: 'dataPilot',
    label: '数据领航',
    child: [
      {
        label: '数据领航滑动展示卡片',
        compName: 'DataDrivenScrollCard',
        icon: <Text />,
      },
      {
        compName: 'DataPilotMap',
        label: '高德地图',
      },
      {
        compName: 'DataPilotCascade',
        label: '行政级联选择器',
      },
    ],
  },
  {
    key: 'threejs',
    label: 'Threejs',
    child: [
      {
        label: 'IntegratePPS',
        libPath: 'Threejs/IntegratePPS',
        compName: 'IntegratePPS',
      },
      {
        label: 'ThreeEngine',
        libPath: 'Threejs/ThreeEngine',
        compName: 'ThreeEngine',
      },
      {
        label: 'Building20FloorComp',
        libPath: 'Threejs/Building20FloorComp',
        compName: 'Building20FloorComp',
      },
    ],
  },
  {
    key: 'shanghaiCenter',
    label: 'ShanghaiCenter',
    child: [
      {
        label: 'OrderItemContainer',
        libPath: 'ShanghaiCenter/OrderItemContainer',
        compName: 'OrderItemContainer',
      },
    ],
  },
  {
    key: 'timeLine',
    label: 'timeLine',
    child: [
      {
        label: 'TimeLineDfocusWebsite',
        compName: 'TimeLineDfocusWebsite',
      },
    ],
  },
  {
    key: 'RankingList',
    label: '排行',
    child: [
      {
        label: 'RankingList',
        compName: 'RankingList',
      },
    ],
  },
];
