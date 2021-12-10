import { useEffect, useRef, useState, useCallback } from 'react';
import { useSize } from '@umijs/hooks';
import { getNowUseApihostValue } from '@/helpers/view';
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useGetWidthAndHeight = (pageWidth, pageHeight) => {
  // 大屏宽高变动重新设置百分比
  const [{ canvasWidth, canvasHeight }, setState] = useState({});
  const [percentageValue, setPer] = useState(0);
  const [state] = useSize(document.querySelector('body'));

  useEffect(() => {
    const canvasWidth = state.width - 250 - 250 - 30 - 30;
    const percentage = (canvasWidth / pageWidth).toFixed(2);
    const percentageValue = percentage * 100;
    setPer(percentageValue);
  }, [state, setState, setPer, pageHeight, pageWidth]);

  return [
    {
      canvasWidth,
      canvasHeight,
      percentageValue,
    },
    setPer,
  ];
};

export const useGetDataId = ({ apiHostId, apiHostList, envList }) => {
  const [detail, setDetail] = useState();
  const dataRef = useRef();
  dataRef.current = {
    apiHostList,
    envList,
  };
  useEffect(() => {
    const detail = getNowUseApihostValue({
      apiHostId,
      ...dataRef.current,
    });
    setDetail(detail);
  }, [apiHostId, apiHostList.length, envList.length]);
  return [detail];
};

export function useUpdateState(initialState) {
  const [state, setState] = useState(initialState);
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);
  return [state, updateState];
}
