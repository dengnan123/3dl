import React from 'react';
import { Rnd } from 'react-rnd';
import { getCompLib, getCompItemProps } from '@/helpers/screen';
import { getStyle, getGridStyle } from '@/helpers/utils';
import ReferenceLine from '@/components/ReferenceLine';

const renderChild = props => {
  const {
    v = {},
    containerName,
    onDragStop,
    onResizeStop,
    showClickStatus,
    setParentId,
    parentId,
    percentageValue,
    canvasId,
  } = props;
  const { id } = v;
  const getItemStyle = () => {
    if (containerName === 'GridCard') {
      return {
        ...getGridStyle({
          ...v,
        }),
      };
    }
    return {
      ...getStyle({
        ...v,
      }),
    };
  };
  const itemStyle = getItemStyle();
  const itemProps = getCompItemProps({
    ...props,
    v,
  });

  const rndWidth = parseInt(v.width);
  const rndHeight = parseInt(v.height);
  const rndX = parseInt(v.left);
  const rndY = parseInt(v.top);
  return (
    <Rnd
      id={id}
      size={{ width: rndWidth, height: rndHeight }}
      position={{ x: rndX, y: rndY }}
      scale={percentageValue / 100}
      style={itemStyle}
      key={id}
      onDragStop={(...args) => {
        onDragStop(...args, id);
      }}
      onResizeStop={(...args) => {
        onResizeStop(...args, id);
      }}
      onClick={e => {
        e.stopPropagation();
        showClickStatus(v);
        setParentId(parentId);
      }}
      onMouseLeave={e => {
        e.stopPropagation();
        setParentId(null);
      }}
      bounds={`#${canvasId}`}
    >
      {getCompLib(itemProps)}
      <ReferenceLine id={id}></ReferenceLine>
    </Rnd>
  );
};

const renderContainerTree = props => {
  const { v } = props;
  const { child, compName } = v;
  const itemProps = getCompItemProps(props);
  const newChild = child.map(v => {
    if (child.length === 1) {
      const data = {
        ...v,
      };
      /**
       * 如果是卡片组件 如果那个child只有一个元素，那么这个子元素宽高 直接100%
       */
      data.width = '100%';
      data.height = '100%';
      data.left = 0;
      data.top = 0;
      const itemStyle = {
        ...getStyle({
          ...data,
        }),
      };
      const itemProps = getCompItemProps({
        ...props,
        v: data,
      });
      const oneItem = () => {
        return (
          <div style={itemStyle} key={data.id}>
            {getCompLib(itemProps)}
            <ReferenceLine id={data.id}></ReferenceLine>
          </div>
        );
      };
      return {
        ...v,
        renderChildComp: oneItem(),
      };
    }
    return {
      ...v,
      renderChildComp: renderChild({
        ...props,
        v,
        containerName: compName,
      }),
    };
  });
  return getCompLib({
    ...itemProps,
    child: newChild,
  });
};

/**
 * 生成大屏render
 */
const compRenderTree = props => {
  const { v } = props;
  const { child } = v;
  const itemProps = getCompItemProps({
    ...props,
    v,
  });
  if (!child?.length) {
    return getCompLib(itemProps);
  }
  // 容器
  return renderContainerTree(props);
};

const CompRender = props => {
  return compRenderTree(props);
};

export default CompRender;
