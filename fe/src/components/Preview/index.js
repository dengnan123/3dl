import React, { useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { useDebounce } from '@react-hook/debounce';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { API_HOST } from '@/config/index';
// import PreviewRender from '@/components/PreviewRender';
import PreviewGridRender from '@/components/PreviewGridRender';
import { useModal } from '@/hooks/usePreviewModal';
// import CompRender from '@/components/CompRender';
import CompLogicRender from '@/components/CompLogicRender';

import {
  useInit,
  useLoading,
  useRegistInterval,
  onChange,
  onClick,
  useHotUpdate,
  useInitFetchData,
  useDoPageShell,
  useMoveEvent,
  useLoadFuncToWindow,
  useSetBodyStyle,
  useSocket,
  useScalePer,
  useCheckBuildTime,
} from '@/hooks/preview';
import {
  usePageSwitch,
  usePageSwitchAnimate,
  // useDataSourceRefCurrent,
} from '@/hooks/preview/pageSwitch';
import { getNewPreviewStyle } from './util';
import { useApiHostHash } from '@/hooks/preview/optimization';
// import 'animate.css';
import styles from './index.less';

function App() {
  const preview = useModal();
  const {
    pageConfig,
    init,
    initUseCompList: data,
    setHasData,
    dataSourceList,
    lang,
    updateClearParams,
    updatePassParamsHash,
    // passParamsHash,
    fetchPageUseCompListApi,
    updateCompsHiddenOrShow,
    updateLoading,
    setLang,
    apiHostList,
    envList,
    pageWrapData,
  } = preview;
  useCheckBuildTime();
  const { getNowApiHostValueById } = useApiHostHash(apiHostList, envList);
  const content = useRef(null);
  const [{ width, height }, setSize] = useDebounce({ width: 0, height: 0 }, 100);
  useEffect(() => {
    if (!content.current) return;
    const { width, height } = content.current.getBoundingClientRect();
    setSize({ width, height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.current]);

  // 监听窗口变化
  useEffect(() => {
    const handler = () => {
      if (!content.current) return;
      const { width, height } = content.current.getBoundingClientRect();
      setSize({ width, height });
    };
    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [setSize]);
  useSetBodyStyle(pageConfig.type);
  // 页面初始化后，执行页面插件
  useDoPageShell({ pageConfig });

  // 处理页面body样式
  useLoadFuncToWindow({
    setLang,
  });

  const idParamsRef = useRef({});
  const cacheParamsRef = useRef({});
  // emitter 逻辑
  // 热更新逻辑
  useHotUpdate({ pageConfig, fetchPageUseCompList: fetchPageUseCompListApi });
  // 页面切换处理
  usePageSwitch({ pageConfig, init });
  useInit({ init });
  useInitFetchData({ dataSourceList, setHasData, apiHostList, envList, getNowApiHostValueById });
  const scalePer = useScalePer({ pageConfig });
  const { showLoading } = useLoading({ propsList: data });
  useRegistInterval({
    dataSourceList,
    setHasData,
    idParamsRef,
    cacheParamsRef,
    envList,
    apiHostList,
    getNowApiHostValueById,
  });
  useMoveEvent(data);
  const _onChange = useCallback(
    compData => {
      onChange({
        data: compData,
        idParamsRef,
        setHasData,
        dataSourceList,
        cacheParamsRef,
        updateClearParams,
        updatePassParamsHash,
        updateCompsHiddenOrShow,
        updateLoading,
        useCompList: data,
        apiHostList,
        envList,
        getNowApiHostValueById,
      });
    },
    [
      setHasData,
      updateCompsHiddenOrShow,
      dataSourceList,
      updateClearParams,
      updatePassParamsHash,
      updateLoading,
      data,
      apiHostList,
      envList,
      getNowApiHostValueById,
    ],
  );

  const _onClick = useCallback(data => {
    onClick({ data });
  }, []);

  /**
   * socket逻辑
   */
  useSocket({
    dataSourceList,
    setHasData,
    idParamsRef,
    cacheParamsRef,
    envList,
    apiHostList,
    getNowApiHostValueById,
  });

  const styleProps = getNewPreviewStyle({
    pageConfig,
    API_HOST,
    ...scalePer,
  });

  const isGridLayout = pageConfig.layoutType && pageConfig.layoutType === 'grid';

  const commonProps = {
    onChange: _onChange,
    onClick: _onClick,
    updateCompsHiddenOrShow,
    lang,
    data,
    pageConfig,
    isPreview: true,
    pageWrapData,
  };
  const animateStr = usePageSwitchAnimate();

  let containerStyles = { ...styleProps };

  if (pageConfig.type === 'fullScreen') {
    const { scaleX, scaleY, left, top } = calcHandler({ pageConfig, width, height });
    containerStyles = {
      ...styleProps,
      left,
      top,
      width: pageConfig.pageWidth,
      height: pageConfig.pageHeight,
      transform: `scale(${scaleX}, ${scaleY})`,
    };
  }

  return (
    <div
      ref={content}
      style={{
        fontFamily: 'myFont',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: showLoading ? 'hidden' : null,
        backgroundColor: pageConfig.type === 'fullScreen' ? pageConfig.bgc : 'inherit',
      }}
    >
      <div
        className={classnames(styles.PreviewDiv, animateStr)}
        style={containerStyles}
        id="containerDiv"
      >
        {isGridLayout ? (
          <PreviewGridRender {...commonProps} />
        ) : (
          <CompLogicRender {...commonProps}></CompLogicRender>
        )}
      </div>
    </div>
  );
}
export default App;

/**
 * 计算缩放比、偏移位置
 */
function calcHandler({ pageConfig, width, height }) {
  const { pageWidth, pageHeight, type } = pageConfig;
  let scaleX = 1;
  let scaleY = 1;
  let ratioX = 1;
  let ratioY = 1;
  let left = 0;
  let top = 0;
  if (!pageWidth || !pageHeight || !width || !height || type !== 'fullScreen') {
    return { scaleX, scaleY, left, top };
  }

  ratioX = width / pageWidth;
  ratioY = height / pageHeight;

  // scaleX = ratioX < ratioY ? ratioX : ratioY;
  scaleX = Math.min(ratioX, ratioY);
  scaleY = scaleX;
  left = ratioX < ratioY ? 0 : (width - pageWidth * scaleX) / 2;
  top = ratioX < ratioY ? (height - pageHeight * scaleY) / 2 : 0;

  return { scaleX, scaleY, left, top };
}
