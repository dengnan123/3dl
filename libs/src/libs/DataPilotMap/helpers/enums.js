/**
 * @constant {number} 中国adcode
 */
export const ChinaAdCode = 100000;

/**
 * 地图显示级别
 * @enum
 * @property {string} MapLevel.Country 中国地图
 * @property {string} MapLevel.Province 省域地图
 * @property {string} MapLevel.City 市域地图
 * @property {string} MapLevel.District 区地图
 */
export const MapLevel = {
  Country: 'country',
  Province: 'province',
  City: 'city',
  District: 'district',
};

/**
 * 地图操作事件
 * @enum
 * @property {string} EventType.DrillDown 下钻
 * @property {string} EventType.DrillUp 上钻
 * @property {string} EventType.Init 初始化
 */
export const EventType = {
  DrillDown: 'drillDown',
  DrillUp: 'drillUp',
  Init: 'init',
};

/**
 * 地图点击元素
 * @enum
 * @property {string} ClickedAreaType.Map 地图
 * @property {string} ClickedAreaType.Marker 标记
 */
export const ClickedAreaType = {
  Map: 'map',
  Marker: 'marker',
};
