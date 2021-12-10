import React, { useEffect, useCallback, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { v4 } from 'uuid';
import RenderImg from '../../../components/RenderImg';
import defPicLeft from '../../../assets/left_arrows.png';

import defPicRight from '../../../assets/right_arrows.png';

function HorizontalScrollPanelContainer(props) {
  const { style = {}, data = {}, child: childComps = [] } = props;

  const { leftImage, rightImage } = data;
  const {
    // Basic layout
    containerWidth = 720,
    containerHeight = 320,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
    borderWidth = 0,
    borderColor = '#c2bebe',
    borderRadius = 0,
    boxShadow = 'rgba(43, 22, 22, 0.32) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    backgroundColor = '#eeeeee',
    // Advance
    displayButton = 'showAll',
    reversedButton = false,
    moveStep = 200,
    offDragScaleEffect = false,
  } = style;

  const leftImgProps = {
    data: { src: leftImage },
    defPic: defPicLeft,
    width: '30px',
    height: '30px',
  };
  const rightImgProps = {
    data: { src: rightImage },
    defPic: defPicRight,
    width: '30px',
    height: '30px',
  };
  const uuid = useRef(v4());

  const renderContent = useCallback(() => {
    if (!childComps || !childComps.length) {
      return (
        <>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
          <li style={{ textAlign: 'center' }}>这里为子组件集合！</li>
        </>
      );
    }
    return (
      <>
        {childComps.map((v, i) => {
          const { renderChildComp } = v;
          return (
            <li key={i}>
              <div style={{ position: 'relative', height: '100%' }}>{renderChildComp}</div>
            </li>
          );
        })}
      </>
    );
  }, [childComps]);

  // Drag | Touch event
  useEffect(() => {
    const inner = document.getElementById(`HorizontalScrollPanel-inner-${uuid.current}`);
    let isDraged = false;
    let startX;
    let scrollLeftAtBegin;

    const handleMouseClick = e => {
      e.preventDefault();
      e.stopPropagation();
      // isDraged = true;
      !offDragScaleEffect && inner.classList.add(`${styles.active}`);
      let mouseDownPoint;
      if (e.type === 'mousedown') {
        mouseDownPoint = e.pageX;
      }
      if (e.type === 'touchstart') {
        mouseDownPoint = e.targetTouches[0].pageX;
      }
      if (!mouseDownPoint) return;
      startX = mouseDownPoint - inner.scrollLeft;
      scrollLeftAtBegin = inner.scrollLeft;
    };

    const handleMove = e => {
      if (!startX) return;
      e.preventDefault();
      e.stopPropagation();

      let mouseDownPoint;
      if (e.type === 'mousemove') {
        mouseDownPoint = e.pageX;
      }
      if (e.type === 'touchmove') {
        mouseDownPoint = e.targetTouches[0].pageX;
      }
      if (!mouseDownPoint) return;
      const x = mouseDownPoint - inner.scrollLeft;
      const walk = (x - startX) * 0.5;
      console.log(walk, '=======myChay ===walk');
      if (Math.abs(walk) > 8) {
        isDraged = true;
      }
      inner.scrollLeft = scrollLeftAtBegin - walk;
    };

    const handleMouseLeave = e => {
      e.preventDefault();
      isDraged = false;
      startX = null;
      inner.classList.remove(`${styles.active}`);
    };

    const handleMouseUp = e => {
      e.preventDefault();
      if (isDraged) {
        e.stopPropagation();
      }
      isDraged = false;
      startX = null;
      inner.classList.remove(`${styles.active}`);
    };

    inner.addEventListener('mousedown', handleMouseClick, true);
    inner.addEventListener('mouseleave', handleMouseLeave);
    inner.addEventListener('mousemove', handleMove, true);
    inner.addEventListener('mouseup', handleMouseUp, true);

    inner.addEventListener('touchstart', handleMouseClick, true);
    inner.addEventListener('touchcancel', handleMouseLeave);
    inner.addEventListener('touchmove', handleMove, true);
    inner.addEventListener('touchend', handleMouseUp, true);

    return () => {
      inner.removeEventListener('mousedown', handleMouseClick);
      inner.removeEventListener('mouseleave', handleMouseLeave);
      inner.removeEventListener('mousemove', handleMove);
      inner.removeEventListener('mouseup', handleMouseUp);
      inner.removeEventListener('touchstart', handleMouseClick);
      inner.removeEventListener('touchcancel', handleMouseLeave);
      inner.removeEventListener('touchmove', handleMove);
      inner.removeEventListener('touchend', handleMouseUp);
    };
  }, [offDragScaleEffect]);

  const handleLeftClick = useCallback(
    e => {
      e.preventDefault();
      const inner = document.getElementById(`HorizontalScrollPanel-inner-${uuid.current}`);
      inner.scroll({
        left: reversedButton ? inner.scrollLeft - moveStep : inner.scrollLeft + moveStep,
        top: 0,
        behavior: 'smooth',
      });
    },
    [reversedButton, moveStep],
  );

  const handleRightClick = useCallback(
    e => {
      e.preventDefault();
      const inner = document.getElementById(`HorizontalScrollPanel-inner-${uuid.current}`);
      inner.scroll({
        left: reversedButton ? inner.scrollLeft + moveStep : inner.scrollLeft - moveStep,
        top: 0,
        behavior: 'smooth',
      });
    },
    [reversedButton, moveStep],
  );

  return (
    <main className={styles.main}>
      {['showAll', 'showLeft'].includes(displayButton) && (
        <div className={classnames(styles.img, styles.leftImg)} onClick={handleLeftClick}>
          <RenderImg {...leftImgProps} />
        </div>
      )}

      <div
        className={styles.wrapper}
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
          borderRadius,
          boxShadow,
          backgroundColor,
        }}
      >
        <div id={`HorizontalScrollPanel-inner-${uuid.current}`} className={styles.inner}>
          <ul id="HorizontalScrollPanel-ul" className={styles.list}>
            {renderContent()}
          </ul>
        </div>
      </div>

      {['showAll', 'showRight'].includes(displayButton) && (
        <div className={classnames(styles.img, styles.rightImg)} onClick={handleRightClick}>
          <RenderImg {...rightImgProps} />
        </div>
      )}
    </main>
  );
}

export default HorizontalScrollPanelContainer;
