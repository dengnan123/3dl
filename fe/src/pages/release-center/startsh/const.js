/**
 * 环境变量table columns
 */
export const replaceJsonColumns = [
  {
    title: '配置id',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '配置详情',
    dataIndex: 'replaceJson',
    key: 'replaceJson',
    render: list => {
      return list.map(n => `${n.key}：${n.value}`).join(',');
    },
  },
];

/**
 * 启动脚本table columns
 */
export const startShColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '配置详情',
    dataIndex: 'json',
    key: 'json',
    render: list => {
      return list.map(n => `${n.key}：${n.value}`).join(',');
    },
  },
];

/**
 * 启动脚本默认值
 */
export const defaultEnvList = [
  // {
  //   key: 'DM_DIST_ZIP_NAME',
  //   value: 'df-visual-big-screen-building-system.zip',
  // },
  // {
  //   key: 'DM_DIST_NAME',
  //   value: 'df-visual-big-screen-building-system',
  // },

  { key: 'PORT', value: 3001 },
  // { key: 'UMI_PUBLIC_PATH', value: '/' },
  { key: 'UMI_ROUTER_BASE', value: '/' },
  // {
  //   key: 'FENGMAP_PROD',
  //   value: 'http://3dl.dfocus.top/api/static/fengmap.min.js',
  // },
  // { key: 'FE_ORIGIN', value: 'http://3dl.dfocus.top' },
  { key: 'API_HOST_PROD', value: 'https://3dl.dfocus.top/api' },
  // { key: 'API_BUILD_HOST_PROD', value: 'http://3dl.dfocus.top/build' },
  // { key: 'SHOW_VCONSOLE', value: 'false' },
];

/**
 * 防止打包做字符串替换
 */
const UMI_ROUTER_ = 'UMI_ROUTER_';
const API_HOST_ = 'API_HOST_';
/**
 * 启动脚本默认值描述
 */
export const defaultEnvConfig = {
  // DM_DIST_NAME: {
  //   isRequired: true,
  //   label: '压缩包名称',
  // },
  // DM_DIST_ZIP_NAME: {
  //   isRequired: true,
  //   label: '解压后文件名',
  // },
  PORT: { isDefault: true, label: '前端node服务启动端口' },
  // UMI_PUBLIC_PATH: { label: '指定 webpack 的 publicPath，指向静态资源文件所在的路径' },
  [`${UMI_ROUTER_}BASE`]: { label: '指定 react-router 的 base，nginx配置路径' },
  // FENGMAP_PROD: { label: '蜂鸟地图sdk路径' },
  // FE_ORIGIN: { isRequired: true, label: '页面域名或者ip+端口号' },
  [`${API_HOST_}PROD`]: { isRequired: true, label: '前端页面nginx配置路径' },
  // API_BUILD_HOST_PROD: { label: '前端打包api' },
  // SHOW_VCONSOLE: { label: '是否显示vconsole(true/false)' },
};
