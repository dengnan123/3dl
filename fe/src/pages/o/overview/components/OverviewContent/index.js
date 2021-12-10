import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '@react-hook/debounce';
import classnames from 'classnames';
import { fullScreen, exitFullScreen } from '../../../../../helpers/view';
import { OverviewList } from '../index';
import { ViewTypeEnums, ViewTypeList } from '../../const';
import { Icon } from 'antd';
import styles from './index.less';

const overflowByType = {
  [ViewTypeEnums.default]: 'hidden',
  [ViewTypeEnums.auto]: 'hidden auto',
  [ViewTypeEnums.unset]: 'auto',
};

/**
 * 计算缩放比、偏移位置
 */
function calcHandler({ pageWidth, pageHeight, width, height, type }) {
  let scaleX = 1;
  let scaleY = 1;
  let ratioX = 1;
  let ratioY = 1;
  let left = 0;
  let top = 0;
  console.log('计算方法');
  if (!pageWidth || !pageHeight || !width || !height) {
    return { scaleX, scaleY, left, top };
  }

  ratioX = width / pageWidth;
  ratioY = height / pageHeight;

  if (type === ViewTypeEnums.default) {
    scaleX = ratioX < ratioY ? ratioX : ratioY;
    scaleY = scaleX;
    left = ratioX < ratioY ? 0 : (width - pageWidth * scaleX) / 2;
    top = ratioX < ratioY ? (height - pageHeight * scaleY) / 2 : 0;
  }

  if (type === ViewTypeEnums.auto) {
    scaleX = ratioX;
    scaleY = scaleX;
    left = 0;
    top = 0;
  }

  if (type === ViewTypeEnums.unset) {
    scaleX = 1;
    scaleY = 1;
  }
  return { scaleX, scaleY, left, top };
}

function OverviewContent(props) {
  const {
    data,
    pageList,
    selectTag,
    tagList,
    pageListLoading,
    setSelectPage,
    onTagSelectChange,
  } = props;
  const { id, pageWidth, pageHeight, tagId } = data || {};
  const content = useRef(null);

  // 是否全屏
  const [isFullScreen, setIsFullScreen] = useState(false);
  // 展示菜单
  const [menuVisible, setMenuVisible] = useState(false);
  // 展示模式下拉列表显示隐藏
  const [typeVisible, setTypeVisible] = useState(false);
  // 侧边按钮显示隐藏
  const [siderBtnVisible, setSiderBtnVisible] = useState(true);

  const [{ width, height }, setSize] = useDebounce({ width: 0, height: 0 }, 100);

  const [type, setType] = useState(ViewTypeEnums.default);

  useEffect(() => {
    if (!content.current) return;
    const { width, height } = content.current.getBoundingClientRect();
    setSize({ width, height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.current, isFullScreen]);

  // 监听窗口变化
  useEffect(() => {
    const handler = () => {
      if (!content.current) return;
      const { width, height } = content.current.getBoundingClientRect();
      setSize({ width, height });
    };
    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [setSize, isFullScreen]);

  // 全屏
  const handleFullScreen = useCallback(() => {
    fullScreen('iframeContainer', isFullScreen => {
      isFullScreen && content.current && content.current.scrollTo(0, 0);
      setIsFullScreen(isFullScreen);
      isFullScreen && setSiderBtnVisible(true);
      if (!isFullScreen) {
        setMenuVisible(false);
        setSiderBtnVisible(false);
      }
    });
  }, []);

  // 退出全屏
  const handleExitFullScreen = useCallback(() => {
    exitFullScreen();
    setMenuVisible(false);
    setSiderBtnVisible(false);
  }, []);

  // 显示类型切换
  const handleTypeChange = useCallback(type => {
    content.current && content.current.scrollTo(0, 0);
    setType(type);
  }, []);

  // 隐藏侧边按钮
  // const handleSiderBtnHide = useCallback(() => {
  //   setSiderBtnVisible(false);
  //   setMenuVisible(false);
  // }, [setSiderBtnVisible]);

  // 双击显示侧边按钮
  const handleAreaDoubleClick = useCallback(() => {
    setSiderBtnVisible(v => {
      if (v) {
        setMenuVisible(false);
      }
      return !v;
    });
  });

  const { scaleX, scaleY, left, top } = useMemo(() => {
    return calcHandler({ pageWidth, pageHeight, width, height, type });
  }, [pageWidth, pageHeight, width, height, type]);

  return (
    <div className={styles.content}>
      <div
        ref={content}
        className={styles.iframeContainer}
        style={{ overflow: overflowByType[type] }}
        id="iframeContainer"
      >
        <div
          className={styles.page}
          style={{
            left,
            top,
            width: pageWidth,
            height: pageHeight,
            transform: `scale(${scaleX}, ${scaleY})`,
          }}
        >
          {data && (
            <iframe
              width={pageWidth}
              height={pageHeight}
              title="data"
              src={`${window.location.origin}/preview?pageId=${id}&tagId=${tagId}`}
              frameBorder={0}
              scrolling="no"
              seamless="seamless"
            />
          )}
        </div>

        {isFullScreen && (
          <div className={styles.doubleClickArea} onDoubleClick={handleAreaDoubleClick}></div>
        )}

        {isFullScreen && siderBtnVisible && (
          <div
            className={styles.menu}
            style={{
              transform: `translateX(${menuVisible ? 0 : 400}px)`,
            }}
          >
            <div className={styles.sideBtns}>
              <div className={styles.btn} onClick={() => setMenuVisible(v => !v)}>
                {menuVisible ? '关闭预览' : '打开预览'}
              </div>
              <div className={styles.btn} onClick={handleExitFullScreen}>
                退出全屏
              </div>
              {/* <div className={styles.btn} onClick={handleSiderBtnHide}>
                <Icon type="close" />
              </div> */}
            </div>
            <OverviewList
              selectTag={selectTag}
              tagList={tagList}
              dataSource={pageList}
              loading={pageListLoading}
              onListClick={setSelectPage}
              onTagSelectChange={onTagSelectChange}
            />
          </div>
        )}
      </div>

      <div className={styles.toolbar}>
        <div
          className={classnames(styles.type, styles.btn)}
          onMouseLeave={() => setTypeVisible(false)}
          onClick={() => setTypeVisible(v => !v)}
        >
          {typeVisible && (
            <div className={styles.select}>
              {ViewTypeList.map(n => (
                <div
                  key={n.value}
                  className={classnames({ [styles.active]: type === n.value })}
                  onClick={() => handleTypeChange(n.value)}
                >
                  {n.label}
                </div>
              ))}
            </div>
          )}
          <Icon type="layout" />
        </div>

        <div className={classnames(styles.fullScreen, styles.btn)} onClick={handleFullScreen}>
          <Icon type="fullscreen" />
        </div>
      </div>
    </div>
  );
}

OverviewContent.propTypes = {
  setSelectPage: PropTypes.func,
  onTagSelectChange: PropTypes.func,
  data: PropTypes.object,
  pageList: PropTypes.array,
  selectTag: PropTypes.object,
  tagList: PropTypes.array,
  pageListLoading: PropTypes.bool,
};

export default OverviewContent;
