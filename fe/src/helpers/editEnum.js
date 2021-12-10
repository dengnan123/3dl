export const ONCHANGE_LIST = [
  {
    label: '传参到其他组件', // Title
    key: 'passParamsComps', // 接口参数 key
    sourceType: 'component', // 组件还是数据源
    funcKey: 'otherCompParamsFilterFuncArr', // 组件单独设置的接口参数 key
    showSetting: true, // 组件单独设置
  },
  {
    label: '隐藏组件',
    key: 'hiddenComps',
    sourceType: 'component',
    showSetting: false,
    isCustomize: true, // 是否有高级配置
    openKey: 'openHiddenCompsFilterFunc', // 开启高级配置的key
    customizeKey: 'hiddenCompsFilterFunc', // 高级配置的key
  },
  {
    label: '显示组件',
    key: 'showComps',
    sourceType: 'component',
    showSetting: false,
    isCustomize: true,
    openKey: 'openShowCompsFilterFunc', // 开启高级配置的key
    customizeKey: 'showCompsFilterFunc', // 高级配置的key
  },
  {
    label: '清除组件条件',
    key: 'clearParamsComps',
    sourceType: 'component',
    showSetting: false,
    isCustomize: true,
    openKey: 'openClearParamsCompsFunc', // 开启高级配置的key
    customizeKey: 'clearParamsCompsFunc', // 高级配置的key
  },

  {
    label: '联动数据源',
    key: 'deps',
    sourceType: 'data',
    showSetting: false,
    isCustomize: true,
    openKey: 'openDepsFilterFunc', // 开启高级配置的key
    customizeKey: 'depsFilterFunc', // 高级配置的key
  },
  {
    label: '清理数据源',
    key: 'clearApiDeps',
    sourceType: 'data',
    showSetting: false,
    isCustomize: true,
    openKey: 'openClearApiDepsFunc', // 开启高级配置的key
    customizeKey: 'clearApiDepsFunc', // 高级配置的key
  },
  // {
  //   label: '清理数据源条件',
  //   key: 'clearApiParamsDeps',
  //   sourceType: 'data',
  //   showSetting: false,
  //   isCustomize: true,
  //   openKey: 'openClearApiParamsDepsFunc', // 开启高级配置的key
  //   customizeKey: 'clearApiParamsDepsFunc', // 高级配置的key
  // },
  {
    label: '缓存条件数据源',
    key: 'cacheParamsDeps',
    sourceType: 'data',
    showSetting: false,
    isCustomize: true,
    openKey: 'openCacheParamsDepsFunc', // 开启高级配置的key
    customizeKey: 'cacheParamsDepsFunc', // 高级配置的key
  },
  {
    label: 'loading关联数据源',
    key: 'loadingDeps',
    sourceType: 'data',
    showSetting: false,
  },
  {
    label: '回调函数',
    key: 'clickCallbackFunc',
    sourceType: 'callback', // 回调函数
  },
];

export const ONCLICK_LIST = [
  {
    label: '回调函数', // Title
    key: 'onClickCallbackFunc', // 接口参数 key
    sourceType: 'callback',
  },
];

export const CONTAINER_LIST = [
  {
    label: '新增关联', // Title
    key: 'groupId', // 接口参数 key
    sourceType: 'callback',
  },
];
