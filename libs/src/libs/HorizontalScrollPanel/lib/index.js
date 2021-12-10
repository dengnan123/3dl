import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import styles from './index.less';
import 'animate.css';
import classnames from 'classnames';
import { filterDataFunc } from '../../../helpers/requestFilter';

import RenderImg from '../../../components/RenderImg';
import defPicLeft from '../../../assets/left_arrows.png';
import defPicRight from '../../../assets/right_arrows.png';

function HorizontalScrollPanel(props) {
  const { style = {}, data = {}, otherCompParams = {} } = props;
  const { value = [], leftImage, rightImage } = data;
  const {
    // Basic layout
    borderWidth = 0,
    borderColor = '#c2bebe',
    borderRadius = 0,
    boxShadow = 'rgba(43, 22, 22, 0.32) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    backgroundColor = '#eeeeee',
    itemBackgroundColor = '#F8E71C',
    itemEvenBackgroundColor = '#50E3C2',
    itemWidth = 200,
    itemHeight = 200,
    itemMargin = 10,
    // Advance
    displayButton = 'showAll',
    moveStep = 200,
    rawInlineCSS = '{}',
    rawHTML = 'return `${data}`',
    customizedContent = false,
    offItemHoverEffect = false,
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

  const renderCSS = useCallback(_ => rawInlineCSS, [rawInlineCSS]);

  const renderHTML = useCallback(
    data => {
      return filterDataFunc(rawHTML, data);
    },
    [rawHTML],
  );
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

  useEffect(() => {
    if (offItemHoverEffect) {
      return;
    }
    const lists = document.getElementById('HorizontalScrollPanel-ul').childNodes;
    const eventLists = ['touchstart', 'mouseover', 'touchend', 'mouseleave'];
    const margin = Number.parseInt(getComputedStyle(lists[0]).margin.match(/\d+/)[0]);

    const handleItemEvent = function(e) {
      e.preventDefault();
      if (['touchstart', 'mouseover'].includes(e.type)) {
        this.style.transform = 'scale(1.1)';
        this.style.margin = `${itemMargin * 2}px`;
      }
      if (['touchend', 'mouseleave'].includes(e.type)) {
        this.style.transform = 'scale(1)';
        this.style.margin = `${itemMargin}px`;
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
  }, [offItemHoverEffect, itemMargin]);

  const renderItems = data => {
    if (!isArray(data) || data.length === 0) {
      data = ['SLIDE 1', 'SLIDE 2', 'SLIDE 3', 'SLIDE 4', 'SLIDE 5', 'SLIDE 6'];
    }

    return data.map((item, index) => {
      // override itemStyle
      let itemStyle = {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        margin: `${itemMargin}px`,
      };
      const background = index % 2 === 0 ? itemBackgroundColor : itemEvenBackgroundColor;
      itemStyle['background'] = background;

      try {
        const customizedStyle = JSON.parse(renderCSS());
        itemStyle = { ...itemStyle, ...customizedStyle };
      } catch (error) {
        console.error(error);
      }

      return customizedContent ? (
        <li
          style={itemStyle}
          key={item}
          dangerouslySetInnerHTML={{
            __html: renderHTML(item),
          }}
        />
      ) : (
        <li style={itemStyle} key={item}>
          {item}
        </li>
      );
    });
  };

  const handleLeftClick = e => {
    e.preventDefault();
    const inner = document.getElementById('HorizontalScrollPanel-inner');
    // this.classList.add('animate__animated');
    // this.classList.add('animate__pulse');

    inner.scroll({
      left: inner.scrollLeft + moveStep,
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleRightClick = function(e) {
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

export default HorizontalScrollPanel;
