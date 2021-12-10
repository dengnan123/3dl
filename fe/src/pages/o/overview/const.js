/**
 * 展示方式
 */
export const ViewTypeEnums = {
  /** 缩放不滚动 */
  default: 'scaleNotScroll',
  /** 自适应滚动 */
  auto: 'scaleAndScroll',
  /** 原始尺寸 */
  unset: 'unset',
};

/**
 * 展示方式列表
 */
export const ViewTypeList = [
  {
    label: '缩放（不滚动）',
    value: ViewTypeEnums.default,
  },
  {
    label: '自适应（滚动）',
    value: ViewTypeEnums.auto,
  },
  {
    label: '原始尺寸',
    value: ViewTypeEnums.unset,
  },
];
