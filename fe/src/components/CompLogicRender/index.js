import React, { useState } from 'react';
import { generateDivId } from '@/helpers/screen';
import PurCompLib from '@/components/PurCompLib';
// import { useDebounce } from 'use-debounce';
// import { useMove } from 'react-use-gesture';
import { omit } from 'lodash';
import ReferenceLine from '@/components/ReferenceLine';
import { useGetNewData, useData, useCompDrag } from './hooks';
import { injectDataToEveryComp } from './util';
// import DragWrap from './DragWrap';

const getRenderContainerChild = props => {
  const { child, compName, PLeft, PTop, pageProps } = props;
  const newChild = child.map(v => {
    const newV = {
      ...v,
    };
    if (compName === 'GridCard' && child.length === 1) {
      /**
       * 如果是卡片组件 如果那个child只有一个元素，那么这个子元素宽高 直接100%
       */
      newV.width = '100%';
      newV.height = '100%';
      newV.PLeft = PLeft;
      newV.PTop = PTop;
    }
    const renderProps = {
      pageProps,
      data: [newV],
      PLeft: compName === 'GridCard' ? PLeft : v.left,
      PTop: compName === 'GridCard' ? PTop : v.top,
    };
    return {
      ...newV,
      renderChildComp: renderTree(renderProps),
      renderChildCompFunc(data, opts) {
        // renderChildCompFunc 用于容器组件 动态渲染子组件 data是容器组件关联数据列表的item
        const newRenderProps = {
          ...renderProps,
          pageProps: {
            ...pageProps,
            onChange(data) {
              // const params = omit(data.params, ['fetchData']);
              // cb && cb(params); // 用cb 来回传子组件的变动的params 到容器组件
              pageProps.onChange && pageProps.onChange(data);
            },
          },
          data: injectDataToEveryComp(renderProps.data, {
            forceRender: true,
            fetchData: data,
            useDataType: 'API',
            ...opts
          }),
        };
        return renderTree(newRenderProps);
      },
    };
  });
  return newChild;
};

const DivRender = ({ v, PLeft, PTop, isFirst, pageProps }) => {
  const { child, id, type, left, top, onClickCallbackFuncEs5Code, onClickCallbackFunc } = v;
  // const [changeId, setChangeId] = useState(null);
  // const [compChangeId] = useDebounce(changeId, 300);
  const isEditFirst = isFirst && !pageProps.isPreview;
  const [compChangeId, setChangeId] = useState(null);
  const { bind, style: dragStyle } = useCompDrag({ v, PLeft, PTop, isEditFirst });
  const newV = useGetNewData({
    setChangeId,
    v,
    compChangeId,
  });
  const newProps = {
    ...pageProps,
    v: newV,
  };

  const { itemProps, itemStyle } = useData({
    newProps,
    compChangeId,
    v,
    pageProps,
    PLeft,
    PTop,
    setChangeId,
  });

  if (isEditFirst) {
    // 如果是编辑页面，data里面第一层数据，样式不能加 transform
    delete itemStyle.transform;
  }
  const divProps = {
    style: { ...itemStyle, ...dragStyle },
    key: id,
    id: generateDivId(v),
    ...bind,
    // onClick() {
    //   pageProps.onClick && pageProps.onClick(v);
    // },
  };
  if (onClickCallbackFuncEs5Code || onClickCallbackFunc) {
    divProps.onClick = () => {
      pageProps.onClick && pageProps.onClick(v);
    };
  }
  // const notShowComp = useCompLazyLoading({
  //   isHidden: itemStyle.isHidden,
  //   id:v.id,
  //   openLazyLoading:pageProps.openLazyLoading
  // });
  // if (notShowComp) {
  //   return null;
  // }
  // window[v.id] = true;  // compName 渲染后 打一个tag 表示渲染了
  if (v.compName === 'PageWrap') {
    const { pageWrapData } = pageProps;
    const pageConfig = {
      ...pageProps.pageConfig,
      inPageWrap: true, // 表示组件在 PageWrap 里面
    };
    return (
      <div {...divProps}>
        {compRenderTree({
          ...pageProps,
          pageConfig,
          isPreview: true,
          data: pageWrapData[id]?.child || [],
        })}
      </div>
    );
  }
  if (child?.length && type === 'container') {
    // 容器
    const containerProps = {
      ...itemProps,
      child: getRenderContainerChild({
        ...newV,
        PLeft,
        PTop,
        pageProps,
      }),
    };
    return (
      <div {...divProps}>
        <PurCompLib {...containerProps}></PurCompLib>
        {!pageProps.isPreview && <ReferenceLine id={id}></ReferenceLine>}
      </div>
    );
  }
  if (child?.length) {
    // 普通成组
    const renderProps = {
      pageProps,
      data: child,
      PLeft: left,
      PTop: top,
    };
    return (
      <div {...divProps}>
        {renderTree(renderProps)}
        {!pageProps.isPreview && <ReferenceLine id={id}></ReferenceLine>}
      </div>
    );
  }
  return (
    <div {...divProps}>
      <PurCompLib {...itemProps}></PurCompLib>
      {!pageProps.isPreview && <ReferenceLine id={id}></ReferenceLine>}
    </div>
  );
};

const renderTree = ({ data = [], ...otherProps }) => {
  return data.map(v => {
    const divProps = {
      ...otherProps,
      v,
    };
    return <DivRender key={v.id} {...divProps}></DivRender>;
  });
};

const compRenderTree = props => {
  const pageProps = omit(props, ['data']);
  const renderProps = {
    pageProps,
    data: props.data,
    PLeft: 0,
    PTop: 0,
    isFirst: true, // 代表递归第一调用
  };
  return renderTree(renderProps);
};

export default compRenderTree;
