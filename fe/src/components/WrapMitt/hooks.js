import emitter from '@/helpers/mitt';
import { useState, useRef } from 'react';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'fast-deep-equal';
import { doAnimation, getAnimateStyles } from '@/helpers/animation/util';
import 'animate.css';

export const useLoading = props => {
  const loadingDeps = props?.loadingDeps || [];
  const [loading, setLoading] = useState(false);
  const [loadingOverRes, setLoadingOver] = useState(null);
  useCustomCompareEffect(
    () => {
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
    },
    [loadingDeps],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps, nextProps);
    },
  );
  return {
    loading,
    loadingOverRes,
    setLoadingOver,
  };
};

// export const useAnimation = (props, divRef) => {
//   const inAnimation = props?.basicStyle?.inAnimation;
//   useCustomCompareEffect(
//     () => {
//       doAnimation(divRef.current, inAnimation);
//     },
//     [inAnimation],
//     (prevDeps, nextDeps) => {
//       const preProps = prevDeps[0];
//       const nextProps = nextDeps[0];
//       return isEqual(preProps, nextProps);
//     },
//   );
// };

export const useStyle = props => {
  const { v } = props;
  const { left, top, width, height, zIndex } = v;
  const aniSty = getAnimateStyles(v?.basicStyle?.inAnimation);
  return {
    zIndex,
    left,
    top,
    width,
    height,
    position: 'absolute',
    ...aniSty,
  };
};

export const useMemoData = data => {
  const dataRef = useRef();
  if (!dataRef.current) {
    dataRef.current = data;
    return data;
  }
  // 预览页面 目前通过changeId 因为预览页面 变化好收集
  if (data.isPreview) {
    if (data.forceRender) {
      return data;
    }
    if (data.compChangeId !== dataRef.current?.compChangeId) {
      dataRef.current = data;
      return data;
    }
    return dataRef.current;
  }
  // 编辑页面
  // if (
  //   data.width !== dataRef.current?.width ||
  //   data.height !== dataRef.current?.height ||
  //   data.isHidden !== dataRef.current?.isHidden ||
  //   !isEqual(data.style, dataRef.current?.style) ||
  //   !isEqual(data.data, dataRef.current?.data)
  // ) {
  //   dataRef.current = data;
  //   return data;
  // }
  // return dataRef.current;
  return data;
};
