import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { isArray, isObject } from 'lodash';
import styles from './index.less';
import classnames from 'classnames';
import { callBackStyle } from '../../../hooks/externalStyle';
import RenderImg from '../../../components/RenderImg';
import defPicLeft from '../../../assets/left_arrows.png';
import defPicRight from '../../../assets/right_arrows.png';

function InitialSearch(props) {
  const { style = {}, data = {}, otherCompParams = {}, onChange } = props;
  const { value = [], leftImage, rightImage } = data;

  const {
    // Basic layout
    borderWidth = 0,
    borderColor = '#c2bebe',
    borderRadius = 0,
    boxShadow = 'rgba(43, 22, 22, 0.32) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    backgroundColor = '#ffffff',
    fontSize = 16,
    fontColor = '#000000',
    itemBackgroundColor = 'rgba(0, 0, 0, 0)',
    itemWidth = 30,
    itemHeight = 40,
    itemMargin = 10,
    // Advance
    buttonWidth = 20,
    buttonHeight = 20,
    displayButton = 'showNone',
    moveStep = 100,
    hoverStyles = '{}',
    offItemHoverEffect = false,
    offDragScaleEffect = false,
  } = style;

  const leftImgProps = {
    data: { src: leftImage },
    defPic: defPicLeft,
    width: buttonWidth,
    height: buttonHeight,
  };
  const rightImgProps = {
    data: { src: rightImage },
    defPic: defPicRight,
    width: buttonWidth,
    height: buttonHeight,
  };

  // Drag | Touch event
  useEffect(() => {
    const inner = document.getElementById('HorizontalScrollPanel-inner');
    let isDraged = false;
    let startX;
    let scrollLeftAtBegin;

    const handleMouseClick = e => {
      e.preventDefault();
      isDraged = true;
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
      if (!isDraged) return;
      e.preventDefault();
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
      inner.scrollLeft = scrollLeftAtBegin - walk;
    };

    const handleMouseLeave = e => {
      e.preventDefault();
      isDraged = false;
      inner.classList.remove(`${styles.active}`);
    };

    const handleMouseUp = e => {
      e.preventDefault();
      isDraged = false;
      inner.classList.remove(`${styles.active}`);
    };

    inner.addEventListener('mousedown', handleMouseClick);
    inner.addEventListener('mouseleave', handleMouseLeave);
    inner.addEventListener('mousemove', handleMove);
    inner.addEventListener('mouseup', handleMouseUp);

    inner.addEventListener('touchstart', handleMouseClick);
    inner.addEventListener('touchcancel', handleMouseLeave);
    inner.addEventListener('touchmove', handleMove);
    inner.addEventListener('touchend', handleMouseUp);

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

  // 应用hover样式之前，获取该item的最初样式
  const getOriginalStyle = useCallback(
    (el, hoverStyles = {}) => {
      let originalStyles = {};
      Object.keys(hoverStyles).forEach(property => {
        const styles = window.getComputedStyle(el);
        const originalValue = styles.getPropertyValue(property);
        originalStyles[property] = originalValue;
      });
      return originalStyles;
    },
    [hoverStyles],
  );

  const originalItemStyle = useRef({});
  //Hover | Leave event
  useEffect(() => {
    if (offItemHoverEffect) {
      return;
    }
    const lists = document.getElementById('HorizontalScrollPanel-ul').childNodes;
    const eventLists = ['touchstart', 'mouseover', 'touchend', 'mouseleave'];

    const handleItemEvent = function(e) {
      e.preventDefault();
      if (['touchstart', 'mouseover'].includes(e.type)) {
        lists.forEach(li => (li.style.opacity = 0.45));
        // 引入自定义hover样式，并把该item的hover前的样式存储在【originalItemStyle】中，以便hover结束后返回该item的初始样式
        try {
          const hs = JSON.parse(hoverStyles);
          const originalStyles = getOriginalStyle(this, hs);
          originalItemStyle.current = originalStyles;
          callBackStyle(originalStyles, this, hs);
        } catch (error) {
          console.error(error);
        }
        this.style.opacity = 1;
      }
      if (['touchend', 'mouseleave'].includes(e.type)) {
        lists.forEach(li => (li.style.opacity = 0.8));
        callBackStyle(originalItemStyle.current, this);
      }
    };

    lists.forEach(list =>
      eventLists.forEach(event => list.addEventListener(event, handleItemEvent)),
    );
    return () => {
      lists.forEach(list =>
        eventLists.forEach(event => list.removeEventListener(event, handleItemEvent)),
      );
    };
  }, [offItemHoverEffect, itemMargin, hoverStyles]);

  const handleItemClick = e => {
    const init = e.target.innerText;
    console.log('Search content start with: ', init);
    onChange && onChange({ init });
  };

  const renderItems = useCallback(
    value => {
      const alphabet = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ];
      return alphabet.map((item, index) => {
        // override itemStyle
        let itemStyle = {
          color: fontColor,
          fontSize: `${fontSize}px`,
          width: `${itemWidth}px`,
          height: `${itemHeight}px`,
          margin: `${itemMargin}px`,
        };
        itemStyle['background'] = itemBackgroundColor;
        if (isArray(value) && value.length) {
          value.forEach(i => {
            if (isObject(i) && Object.keys(i).includes(item)) {
              if (isObject(i[item])) {
                itemStyle = { ...itemStyle, ...i[item] };
              }
            }
          });
        }
        return (
          <li style={itemStyle} key={item} onClick={handleItemClick}>
            {item}
          </li>
        );
      });
    },
    [value, fontSize, fontColor, itemWidth, itemHeight, itemMargin, itemBackgroundColor],
  );

  const handleLeftClick = e => {
    e.preventDefault();
    const inner = document.getElementById('HorizontalScrollPanel-inner');

    inner.scroll({
      left: inner.scrollLeft + moveStep,
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleRightClick = e => {
    e.preventDefault();
    const inner = document.getElementById('HorizontalScrollPanel-inner');
    inner.scroll({
      left: inner.scrollLeft - moveStep,
      top: 0,
      behavior: 'smooth',
    });
  };

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
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius,
          boxShadow,
          backgroundColor,
        }}
      >
        <div id="HorizontalScrollPanel-inner" className={styles.inner}>
          <ul id="HorizontalScrollPanel-ul" className={styles.list}>
            {renderItems(data?.value)}
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

export default InitialSearch;
