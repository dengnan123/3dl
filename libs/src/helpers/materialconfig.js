import border1 from '../assets/border/border-1.png';
import border21 from '../assets/border/border-2-1.png';
import border22 from '../assets/border/border-2-2.png';
import border23 from '../assets/border/border-2-3.png';
import border24 from '../assets/border/border-2-4.png';
import border25 from '../assets/border/border-2-5.png';
import border26 from '../assets/border/border-2-6.png';
import border27 from '../assets/border/border-2-7.png';
import border28 from '../assets/border/border-2-8.png';
import border29 from '../assets/border/border-2-9.gif';
import border210 from '../assets/border/border-2-10.gif';
import border211 from '../assets/border/border-2-11.gif';
import border212 from '../assets/border/border-2-12.gif';
import border213 from '../assets/border/border-2-13.png';
import border214 from '../assets/border/border-2-14.png';

// 属性配置项
export const MaterialTypeName = [
  'Circle',
  'Arrow',
  'DividingLine',
  'Oval',
  'Rectangle',
  'BorderBox',
  'Triangle',
  'RightTriangle',
  'ImageIcon'
];

// 旋转角度
export const rotateTypeName = [
  'Circle',
  'Arrow',
  'DividingLine',
  'Oval',
  'Rectangle',
  'Triangle',
  'RightTriangle',
];
// 透明度
export const opacityTypeName = [
  'Circle',
  'Arrow',
  'DividingLine',
  'Oval',
  'Rectangle',
  'Triangle',
  'RightTriangle',
];
// 边框宽度
export const borderWidthTypeName = [
  'Circle',
  'DividingLine',
  'Oval',
  'Rectangle',
  'BorderBox',
  'Triangle',
  'RightTriangle',
];
// 边框颜色
export const borderColorTypeName = [
  'Circle',
  'DividingLine',
  'Oval',
  'Rectangle',
  'BorderBox',
  'Triangle',
  'RightTriangle',
];
// 填充颜色（背景色）
export const backgroundColoryTypeName = [
  'Circle',
  'Arrow',
  'Oval',
  'Rectangle',
  'BorderBox',
  'Triangle',
  'RightTriangle',
];
// 去除边框留白（padding）
export const linepaddingTypeName = ['DividingLine'];
// 四周圆角
export const borderRadiusTypeName = ['Rectangle'];
// 边框类型设置
export const borderStyleTypeName = ['BorderBox'];

export const borderWidthTypeNameFilter = [];
// export const linepaddingTypeName = []

export const borderSettingEmus = {
  // 无
  none: 0,
  // 简单边框
  simple: 1,
  // 内置边框
  internal: 2,
  // 自定义边框
  customize: 3,
};

export const borderSettingStatus = {
  [borderSettingEmus.none]: 'none',
  [borderSettingEmus.simple]: 'simple',
  [borderSettingEmus.internal]: 'internal',
  [borderSettingEmus.customize]: 'customize',
};

// 边框的边框样式
export const borderStyleEmnu = {
  solid: 0,
  dotted: 1,
  double: 2,
  dashed: 3,
};

export const borderBackgroundImage = [
  border1,
  border21,
  border22,
  border23,
  border24,
  border25,
  border26,
  border27,
  border28,
  border29,
  border210,
  border211,
  border212,
  border213,
  border214,
];
