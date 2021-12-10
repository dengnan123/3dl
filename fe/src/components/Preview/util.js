import { getCompItemProps } from '@/helpers/screen';
import { getBasicStyle } from '@/helpers/utils';
import { staticPath } from '@/config';

export const dealWithGridProps = props => {
  const newData =
    props?.data?.map(v => {
      const _itemProps = getCompItemProps({
        ...props,
        isPreview: true,
        v,
      });
      const newBasicStyle = getBasicStyle(_itemProps) || {};
      return {
        ...v,
        ...newBasicStyle,
        basicStyle: {
          ...v.basicStyle,
          ...newBasicStyle,
        },
      };
    }) || [];

  return {
    ...props,
    data: newData,
  };
};

export const getNewPreviewStyle = ({ pageConfig, API_HOST, widthScalePer, heightScalePer }) => {
  let styleProps = {
    backgroundColor: pageConfig.bgc,
    backgroundImage: pageConfig.bgi
      ? `url(${staticPath}/${pageConfig.id}/${pageConfig.bgi})`
      : null,
    backgroundSize: 'cover',
  };

  // 大屏展示全铺满
  if (pageConfig.type === 'allSpread') {
    styleProps.transform = `scale(${widthScalePer},${heightScalePer})`;
    styleProps.width = pageConfig.pageWidth;
    styleProps.height = pageConfig.pageHeight;
  }
  // 默认不处理
  if (pageConfig.type === 'default') {
    styleProps.width = pageConfig.pageWidth;
    styleProps.height = pageConfig.pageHeight;
  }
  // 宽度等比缩放高度铺满 不用处理
  return styleProps;
};
