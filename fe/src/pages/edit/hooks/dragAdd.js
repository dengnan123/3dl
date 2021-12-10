import { useEffect, useRef, useCallback } from 'react';
import { getCompStaticData } from '@/helpers/screen';
import { message } from 'antd';

export const useDragAdd = ({ leftDivRef, addCusCompToUseCompList }) => {
  const handler = useCallback(
    async e => {
      console.log('pageX, pageY end------', e);
      const { path, clientX, clientY } = e;
      const compName = path[0].alt;
      if (!compName) {
        message.error('组件 error');
        return;
      }
      const mockData = (await getCompStaticData(compName)) || {};
      // 图片 宽高 114 64
      addCusCompToUseCompList({
        mockData,
        compName,
        left: clientX - 114 / 2 - 300 - 200 - 16,
        top: clientY - 64 / 2 - 60 - 150 - 16,
      });
    },
    [addCusCompToUseCompList],
  );
  useEventListener('dragend', handler, leftDivRef.current);
};

export function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    const eventListener = event => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
