import { useEffect, useState, useRef, useMemo } from 'react';
import { useCustomCompareEffect } from 'react-use';
import { isObject } from 'lodash';
import { v4 as uuid } from 'uuid';
import isEqual from 'fast-deep-equal';
import { useDrag } from 'react-use-gesture';

import { getBasicStyle, getGridTransform, getTransform } from '@/helpers/utils';
import { filterDataFunc } from '@/helpers/screen';
import emitter from '@/helpers/mitt';
import { generateDivId, getCompItemProps } from '@/helpers/screen';
import { isInViewPort } from '@/helpers/view';

export const getIsHidden = props => {
  const { initIsHidden, pageIsHidden, isPreview } = props;

  const { isHidden: dataIsHidden } = getBasicStyle(props);
  if (!isPreview) {
    return initIsHidden;
  }
  if (dataIsHidden) {
    // dataIsHidden 说明 后端控制了 这个组件不能显示 必须一直隐藏
    return dataIsHidden;
  }
  if (pageIsHidden !== null) {
    //  pageIsHidden ！== null 说明页面操作了，用页面操作的状态
    return pageIsHidden;
  }
  if (dataIsHidden !== undefined) {
    // dataIsHidden !== undefined 说明 在高级配置里面设置了 比默认优先一点
    return dataIsHidden;
  }

  return initIsHidden;
};

export const getDivBasicStyle = props => {
  const { width, height, zIndex, isHidden, compName, pageConfig } = props;
  const loadingSty = () => {
    if (compName === 'Loading' && !isHidden) {
      return {
        zIndex: 9999,
        width: '100%',
        height: '100%',
      };
    }
    return {};
  };

  const transform =
    pageConfig.layoutType === 'normal' ? getTransform(props) : getGridTransform(props);

  const pageWrapStyle = () => {
    // 如果是 PageWrap 需要点击穿透
    if (compName === 'PageWrap') {
      return {
        pointerEvents: 'none',
      };
    }
    // 如果是 组件是在pageWrap 里面需要恢复正常点击，不然不会响应事件
    if (pageConfig.inPageWrap) {
      return {
        pointerEvents: 'auto',
      };
    }
    return {};
  };

  return {
    zIndex,
    width,
    height,
    transform,
    position: 'absolute',
    display: isHidden ? 'none' : 'block',
    isHidden,
    ...getBasicStyle(props),
    ...loadingSty(),
    ...pageWrapStyle(),
  };

  // const styData = {
  //   zIndex,
  //   width,
  //   height,
  //   transform,
  //   position: 'absolute',
  //   // display: isHidden ? 'none' : 'block',
  //   ...getBasicStyle(props),
  //   ...loadingSty(),
  // };
  // if (isHidden) {
  //   return {
  //     ...styData,
  //     transform: 'scale(0)',
  //   };
  // }
  // return styData;
};

export const useIsHidden = ({ id, setChangeId }) => {
  const [isHidden, setIsHidden] = useState(null);
  useEffect(() => {
    emitter.on(`${id}_show`, () => {
      setIsHidden(0);
    });
    emitter.on(`${id}_hidden`, () => {
      setIsHidden(1);
    });
    return () => {
      emitter.off(`${id}_show`);
      emitter.off(`${id}_hidden`);
    };
  }, [id]);
  useEffect(() => {
    setChangeId(uuid());
  }, [isHidden, setChangeId]);
  return {
    isHidden,
  };
};

export const useFetchData = ({ id, setChangeId, dataSourceId }) => {
  const [fetchData, setData] = useState(null);
  useEffect(() => {
    if (!dataSourceId) {
      return;
    }
    if (!dataSourceId.length) {
      return;
    }
    if (dataSourceId?.length) {
      for (const apiId of dataSourceId) {
        emitter.on(`${apiId}_data`, fetchData => {
          setData(data => {
            setTimeout(() => {
              setChangeId(uuid());
            }, 100);
            if (dataSourceId.length === 1) {
              return fetchData; // 如果组件关联了一个数据源 就直接返回
            }
            // 到这里说明组件关联了多个数据源，需要返回一个对象
            if (isObject(data)) {
              return {
                ...data,
                [apiId]: fetchData,
              };
            }
            return {
              [apiId]: fetchData,
            };
          });
        });
        emitter.on(`${apiId}_clearApiData`, () => {
          // 清理数据源
          setData(null);
        });
      }
    }
    return () => {
      if (dataSourceId?.length) {
        for (const apiId of dataSourceId) {
          emitter.off(`${apiId}_data`);
        }
      }
    };
  }, [id, dataSourceId, setChangeId]);
  return {
    fetchData,
  };
};

export const dealwithFetchData = ({
  filterFunc,
  filterFuncEs5Code,
  openHighConfig,
  compName,
  dataSourceId,
  aliasName,
  useDataType,
  type,
  id,
  childDataSourceName,
  otherCompParams,
  fetchData,
  aliseName,
}) => {
  let newData = fetchData;
  if (openHighConfig && filterFunc) {
    // 把其他组件传递的参数合并到数据源里面
    const des = `组件--${aliasName || compName}--数据过滤器报错`;
    return filterDataFunc({
      filterFunc,
      filterFuncEs5Code,
      data: newData,
      des,
      otherCompParams,
    });
  }
  return newData;
};

export const usePassParams = ({ id, setChangeId }) => {
  const [otherCompParams, setOtherCompParams] = useState(null);
  useEffect(() => {
    emitter.on(`${id}_passParams`, data => {
      setOtherCompParams(preData => {
        if (isObject(preData)) {
          // 新旧合并
          return {
            ...preData,
            ...data,
          };
        }
        return data;
      });
    });
    return () => {
      emitter.off(`${id}_passParams`);
    };
  }, [id]);

  useCustomCompareEffect(
    () => {
      setChangeId(uuid());
    },
    [otherCompParams, setChangeId, id],
    (pre, next) => {
      return isEqual(pre[0], next[0]);
    },
  );
  return {
    otherCompParams,
  };
};

export const useClearParams = ({ id, setChangeId }) => {
  const [shouldClearParams, setShouldClearParams] = useState(null);
  useEffect(() => {
    emitter.on(`${id}_clearParams`, data => {
      setShouldClearParams(uuid());
    });
    return () => {
      emitter.off(`${id}_clearParams`);
    };
  }, [id]);
  useEffect(() => {
    setChangeId(uuid());
  }, [shouldClearParams, setChangeId]);

  return {
    shouldClearParams,
  };
};

export const useLoading = ({ loadingDeps, setChangeId }) => {
  const [loading, setLoading] = useState(null);
  const [loadingOverRes, setLoadingOver] = useState(null);
  useEffect(() => {
    if (!loadingDeps?.length) {
      return;
    }
    const loadingTrueFunc = v => {
      setLoading(true);
      setLoadingOver(null);
    };
    const loadingFalseFunc = v => {
      setLoading(false);
      setLoadingOver(v);
    };
    if (loadingDeps && loadingDeps.length) {
      // 监听数据源
      for (const apiId of loadingDeps) {
        emitter.on(`${apiId}_loading_true`, loadingTrueFunc);
        emitter.on(`${apiId}_loading_false`, loadingFalseFunc);
      }
    }
    return () => {
      for (const apiId of loadingDeps) {
        emitter.off(`${apiId}_loading_true`, loadingTrueFunc);
        emitter.off(`${apiId}_loading_false`, loadingFalseFunc);
      }
    };
  }, [loadingDeps]);
  useEffect(() => {
    setChangeId(uuid());
  }, [loading, loadingOverRes, setChangeId]);
  return {
    loading,
    loadingOverRes,
    setLoadingOver(value) {
      setChangeId(uuid());
      setLoadingOver(value);
    },
  };
};

export const getNewProps = ({ v, newData }) => {
  const newProps = {
    ...v,
  };
  const keys = Object.keys(newData);
  for (const key of keys) {
    if (newData[key] !== null) {
      newProps[key] = newData[key];
    }
  }
  if (newData.fetchData !== null) {
    newProps.fetchData = dealwithFetchData({
      ...v,
      fetchData: newData.fetchData,
      otherCompParams: newData.otherCompParams,
    });
  }
  return newProps;
};

export const useGetNewData = ({ setChangeId, v, compChangeId }) => {
  const { fetchData } = useFetchData({
    ...v,
    setChangeId,
  });
  const { otherCompParams } = usePassParams({
    ...v,
    setChangeId,
  });
  const { shouldClearParams } = useClearParams({
    ...v,
    setChangeId,
  });
  const { loading, loadingOverRes, setLoadingOver } = useLoading({
    ...v,
    setChangeId,
  });
  return getNewProps({
    v,
    newData: {
      compChangeId,
      fetchData,
      otherCompParams,
      shouldClearParams,
      loading,
      loadingOverRes,
      setLoadingOver,
    },
  });
};

/**
 * 检测页面元素 是否在可视区域
 */
export const useObs = props => {
  const propRef = useRef();
  propRef.current = props;
  const { id } = props;
  useEffect(() => {
    const { compName, dataSourceId, isPreview } = propRef.current;
    if (!isPreview) {
      return;
    }
    const ID = generateDivId({
      id,
      compName,
    });
    const target = document.getElementById(ID);
    if (!target) {
      return;
    }
    isInViewPort(target, data => {
      for (const apiId of dataSourceId) {
        if (data) {
          emitter.emit(apiId, {
            compId: id,
            type: 'add',
          });
        } else {
          emitter.emit(apiId, {
            compId: id,
            type: 'delete',
          });
        }
      }
    });
  }, [id]);
};

/**
 *  isHidden ,  itemProps , itemStyle
 */

export const useData = ({ newProps, compChangeId, v, pageProps, PLeft, PTop, setChangeId }) => {
  const { isPreview } = pageProps;

  const newPropsRef = useRef();
  newPropsRef.current = newProps;
  const itemProps = useMemo(() => {
    return getCompItemProps(newPropsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compChangeId]);

  const itemPropsRef = useRef();
  itemPropsRef.current = itemProps;

  const { isHidden: initIsHidden } = v;
  const { isHidden: pageIsHidden } = useIsHidden({
    ...v,
    setChangeId,
  });
  const isHidden = useMemo(() => {
    return getIsHidden({
      ...itemPropsRef.current,
      initIsHidden,
      pageIsHidden,
      isPreview,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIsHidden, isPreview, initIsHidden, compChangeId]);
  itemPropsRef.current.isHidden = isHidden;
  const itemStyle = useMemo(() => {
    return getDivBasicStyle({
      ...itemPropsRef.current,
      PLeft,
      PTop,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compChangeId, PLeft, PTop]);

  if (!isPreview) {
    // 编辑页面不缓存 后面统一优化这块逻辑
    const itemProps = getCompItemProps(newProps);
    const itemStyle = getDivBasicStyle({
      ...itemProps,
      PLeft,
      PTop,
    });
    return {
      itemProps,
      itemStyle,
    };
  }

  return {
    itemStyle,
    itemProps: {
      ...itemProps,
      width: itemStyle.width,
      height: itemStyle.height,
      left: itemStyle.left,
      top: itemStyle.top,
    },
  };
};

/**
 * 页面开启 组件懒加载，
 * 如果 window[id] 有值，就不做处理
 */
export const useCompLazyLoading = ({ isHidden, openLazyLoading = true, id }) => {
  if (window[id]) {
    return false;
  }
  return openLazyLoading && isHidden;
};

/**
 * 组件滑动
 */
export const useCompDrag = props => {
  // const windowHeight = window.innerHeight;
  const { PLeft, PTop, v, isEditFirst } = props;
  const { left, top, basicStyle } = v;
  const initialX = left;
  const initialY = top;

  const [iX, setx] = useState(initialX);
  const [iY, sety] = useState(initialY);
  const [canceled, setCanceled] = useState(false);

  const {
    openRightSlide,
    openLeftSlide,
    rightSlideConfig,
    leftSlideConfig,
    openSlideUp,
    openSwipeDown,
    slideUpConfig,
    swipeDownConfig,
  } = basicStyle || {};

  // console.log('=====slideVVV', basicStyle);

  const lastTop = getHeightValue({ config: slideUpConfig, initialValue: 0 });
  const lastDowmHeight = getHeightValue({ config: swipeDownConfig, initialValue: initialY });

  const lastWidth = getWidthValue({ config: rightSlideConfig, initialValue: 0 });
  const lastLeftWidth = getWidthValue({ config: leftSlideConfig, initialValue: initialX });

  const xBind = useDrag(
    ({ last, vxvy: [vx], movement: [mx], cancel, canceled }) => {
      setCanceled(last);
      if (!openLeftSlide && vx < 0) {
        return;
      }
      if (!openRightSlide && vx > 0) {
        return;
      }
      if (last) {
        //vx <0 左滑，反之右滑
        const isLeft = vx < 0;
        let xvalue = isLeft ? lastLeftWidth : lastWidth;
        setx(xvalue);
        return;
      }
      setx(mx);
    },
    { initial: () => [iX, 0], filterTaps: true, bounds: { top: 0 }, rubberband: true },
  );

  const yBind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      // console.log('vyvyvyv', vy);
      // console.log('mymymy', my, last);
      setCanceled(last);
      if (!openSlideUp && vy < 0) {
        return;
      }
      if (!openSwipeDown && vy > 0) {
        return;
      }
      if (last) {
        //vy <0 上滑，反之下滑
        const isUp = vy < 0;
        let yvalue = isUp ? lastTop : lastDowmHeight;
        sety(yvalue);
        return;
      }
      sety(my);
    },
    { initial: () => [0, iY], filterTaps: true, bounds: { top: 0 }, rubberband: true },
  );

  const isNoAction = !openSlideUp && !openSwipeDown && !openRightSlide && !openLeftSlide;
  if (isNoAction || isEditFirst) {
    return {
      bind: {},
      style: {},
    };
  }

  const isXSlide = openRightSlide || openLeftSlide;
  const transition = canceled ? 'transform 0.4s ease-in-out' : 'transform 0s ease-in-out';
  const transform = getTransform({ PLeft, PTop, left: iX, top: iY });

  return {
    bind: isXSlide ? xBind() : yBind(),
    style: { transition, transform },
  };
};

const getHeightValue = ({ config, initialValue }) => {
  const windowHeight = window.innerHeight;
  const { lastHeight, heightUnit } = config || {};
  if (!lastHeight) {
    return initialValue;
  }
  if (heightUnit === 'px') {
    return lastHeight || 0;
  }
  return windowHeight * (lastHeight / 100);
};

const getWidthValue = ({ config, initialValue }) => {
  const windowHeight = window.innerWidth;
  const { lastWidth, widthUnit } = config || {};
  if (!lastWidth && lastWidth !== 0) {
    return initialValue;
  }
  if (widthUnit === 'px') {
    return lastWidth || 0;
  }
  return windowHeight * (lastWidth / 100);
};
