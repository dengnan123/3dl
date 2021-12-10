import React, { useState } from 'react';
import { enableResizingData, disableResizingData } from '@/helpers/canvas';
import { Rnd } from 'react-rnd';
import { getDisableDraggingAndResizing } from '@/helpers/status';
import styles from './index.less';
import classnames from 'classnames';
import ReferenceLine from '@/components/ReferenceLine';
import CompLogicRender from '@/components/CompLogicRender';
import { getBasicStyle } from '@/helpers/utils';
// import { useSelection } from './hooks';

const EditRender = props => {
  const {
    v,
    inputEl,
    percentageValue,
    onDragStop,
    onResizeStop,
    showClickStatus,
    onMouseUp,
    enableResizing,
    isSelectCompInfo,
  } = props;
  const { id, isLocking, isHidden, zIndex, width, height, left, top } = v;

  // const showSelectionline = useSelection(v);

  const [showHover, setHover] = useState(false);
  const showClick = isSelectCompInfo.id === id;
  const disableDragging = getDisableDraggingAndResizing({
    isClick: showClick,
    isLocking,
    nowId: id,
  });
  const rndWidth = parseInt(width);
  const rndHeight = parseInt(height);
  const rndX = parseInt(left);
  const rndY = parseInt(top);

  const onMouseEnter = () => {
    if (isSelectCompInfo.id === id) {
      return;
    }
    setHover(true);
  };
  const getClass = () => {
    if (isHidden) {
      return styles.hidden;
    }
    // if (showSelectionline) {
    //   return styles.hoverLine;
    // }
    if (showHover) {
      return styles.hoverLine;
    }
    return styles.rnd;
  };
  const getStyle = () => {
    const basic = getBasicStyle(v);
    if (showClick && !v.isLocking) {
      return {
        ...basic,
        zIndex: 999,
      };
    }
    return {
      ...basic,
      zIndex,
    };
  };

  const renderProps = {
    ...props,
    data: [v],
  };

  return (
    <Rnd
      id={id}
      scale={percentageValue / 100}
      key={id}
      ref={inputEl}
      disableDragging={disableDragging}
      enableResizing={enableResizing ? enableResizingData : disableResizingData}
      size={{ width: rndWidth, height: rndHeight }}
      position={{ x: rndX, y: rndY }}
      onDragStop={(...args) => {
        onDragStop(...args, id);
      }}
      onResizeStop={(...args) => {
        onResizeStop(...args, id);
      }}
      onClick={e => {
        e.stopPropagation();
        showClickStatus(v);
        setHover(false);
      }}
      onMouseEnter={onMouseEnter}
      onMouseDown={e => {
        // 鼠标右击
        if (e.button === 2) {
          onMouseUp({
            id,
            top: e.clientY,
            left: e.clientX,
          });
        }
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      bounds="#canvas"
      className={classnames(getClass())}
      style={getStyle()}
    >
      <ReferenceLine id={id}></ReferenceLine>
      <CompLogicRender {...renderProps}></CompLogicRender>
    </Rnd>
  );
};

export default EditRender;
