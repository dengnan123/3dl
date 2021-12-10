import { Button } from 'antd';

/**
 * 项目table columns
 */
export const tagColumns = [
  {
    title: '项目id',
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
    title: '颜色',
    dataIndex: 'color',
    key: 'color',
  },
];

/**
 * 页面table columns
 */
export const pageColumns = [
  {
    title: '项目id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    render: (text, record) => {
      const { id, tagId } = record;
      const btnPreview = () =>
        window.open(`${window.location.origin}/preview?pageId=${id}&tagId=${tagId}`);

      const btnEdit = () =>
        window.open(`${window.location.origin}/edit?pageId=${id}&tagId=${tagId}`);
      return (
        <>
          <Button style={{ paddingLeft: 0 }} type="link" onClick={btnPreview}>
            预览
          </Button>
          <Button style={{ paddingRight: 0 }} type="link" onClick={btnEdit}>
            编辑
          </Button>
        </>
      );
    },
  },
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
