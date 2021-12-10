import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';

import Control from './control';
import Indicators from './Indicators';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { render, getTotal } from './render';

import styles from './index.less';

const Pre = props => {
  const { child = [{}, {}, {}], style, shouldClearParams, onChange, data } = props;

  const timer = useRef();
  const timeoutRef = useRef();

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  const preIndexRef = useRef(0);
  const {
    compKey = 'pre',
    // cPadding = '0',
    autoPlay = false,
    swipeable = true,
    infiniteLoop = true,
    interval = 2,
    defaultActiveIndex,
    openListCarousel,
    listHeight = 'auto',
    listItemdistance = 10,
    pageSize = 10,
    forceRender,
  } = style || {};
  const [nowPage, setPage] = useState(0);
  useEffect(() => {
    if (!forceRender) {
      return;
    }
    setPage(parseInt(defaultActiveIndex));
  }, [defaultActiveIndex, forceRender]);

  /******子组件RenderData******/
  let renderData = [];
  if (!child || child.length === 0) {
    renderData = [];
  } else {
    renderData = (child || []).sort((a, b) => {
      return a.basicStyle?.sortIndex - b.basicStyle?.sortIndex;
    });
  }

  const dyList = data?.dataSource || [];
  const totalPage = getTotal({
    openListCarousel,
    renderData,
    dyList,
    pageSize,
  });

  // 循环时间
  let intervalVal = 2000;
  if (interval && typeof interval === 'number') {
    intervalVal = interval * 1000;
  }

  const onIndicatorClick = useCallback((isSelected, index) => {
    setPage(index);
  }, []);

  const nextPage = () => {
    setPage(v => {
      const newV = v + 1 === totalPage ? v : v + 1;
      return newV;
    });
  };

  const prePage = () => {
    setPage(v => {
      const newV = v - 1 < 0 ? 0 : v - 1;
      return newV;
    });
  };

  const onCarouselChange = useCallback(
    current => {
      if (nowPage !== current) {
        setPage(current);
      }
    },
    [nowPage],
  );

  // 清楚自动轮播
  const clearAutoPlay = useCallback(() => {
    clearInterval(timer.current);
    timer.current = null;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  // 开始自动轮播
  const startAutoPlay = useCallback(() => {
    clearAutoPlay();
    if (!autoPlay || totalPage === 0) {
      return clearAutoPlay;
    }

    timer.current = setInterval(() => {
      setPage(prev => {
        let pageValue = prev + 1;
        pageValue = pageValue % totalPage;
        if (!infiniteLoop && pageValue === totalPage - 1) {
          // 如果不循环并且已经是最后一个了，则停止自动轮播
          clearInterval(timer.current);
          timer.current = null;
        }
        return pageValue;
      });
    }, intervalVal);
  }, [autoPlay, intervalVal, infiniteLoop, totalPage, clearAutoPlay]);

  const handleDivClick = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    timeoutRef.current = setTimeout(() => {
      startAutoPlay();
    }, 1000 * 30);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
  }, [startAutoPlay]);

  // 重置
  useEffect(() => {
    // 判断 defaultActiveIndex 是否可用
    console.log('defaultActiveIndex--change', defaultActiveIndex);
    if (
      isNaN(defaultActiveIndex) ||
      totalPage === 0 ||
      defaultActiveIndex < 0 ||
      defaultActiveIndex > totalPage - 1
    )
      return;
    console.log('defaultActiveIndex--change--setPage', defaultActiveIndex);
    setPage(defaultActiveIndex);
  }, [totalPage, defaultActiveIndex, shouldClearParams]);
  console.log('defaultActiveIndex--style', defaultActiveIndex);
  console.log('defaultActiveIndex--nowPage', nowPage);

  // onChange
  useEffect(() => {
    const onChange = onChangeRef.current;
    localStorage.setItem('prePageIndex', nowPage);
    onChange &&
      onChange({
        [compKey]: {
          _type: 'autoChange',
          data: { index: nowPage, prevIndex: preIndexRef.current },
        },
      });
    preIndexRef.current = nowPage;
  }, [compKey, nowPage]);

  const preDis = nowPage === 0 || totalPage === 0;
  const nextDis = nowPage === totalPage - 1 || totalPage === 0;

  if (!renderData || !renderData.length) {
    return <div>请放入子组件</div>;
  }

  const controlProps = {
    style,
    prePage,
    nextPage,
    preDis,
    nextDis,
  };

  return (
    <div
      className={styles.pre}
      id={compKey}
      onMouseOver={clearAutoPlay}
      onMouseLeave={startAutoPlay}
      onClick={handleDivClick}
      onTouchStart={handleDivClick}
    >
      {totalPage && (
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          useKeyboardArrows
          selectedItem={nowPage}
          autoPlay={false}
          infiniteLoop={infiniteLoop}
          // interval={intervalVal}
          swipeable={swipeable}
          onChange={onCarouselChange}
          stopOnHover={false}
          startOnLeave={false}
        >
          {render({
            onChange,
            renderData,
            dyList,
            pageSize,
            openListCarousel,
            listItemdistance,
            listHeight,
          })}
        </Carousel>
      )}
      <Control {...controlProps}></Control>
      <Indicators
        activeIndex={nowPage}
        total={totalPage}
        style={style}
        onIndicatorClick={onIndicatorClick}
      />
    </div>
  );
};

export default Pre;
