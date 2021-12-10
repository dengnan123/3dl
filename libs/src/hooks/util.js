import { useEffect, useRef, useCallback } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { isArray, isFunction, isObject } from 'lodash';

export const useEffectDeepEqual = (fn, depArr) => {
  if (!isArray(depArr)) {
    throw new Error('fn must function');
  }
  if (!isFunction(fn)) {
    throw new Error('depArr must array');
  }
};

/**
 * 多少分钟不操作页面  do something
 */
export const useMinNoActionDoSome = ({
  ele = document,
  autoCloseTime,
  callback,
  eventName = 'touchstart',
}) => {
  const timerRef = useRef();
  useEffect(() => {
    if (!autoCloseTime) {
      return;
    }

    if (timerRef.current) {
      return;
    }
    const timerFunc = () => {
      console.log('timerFunc is invoked');
      const timerId = setTimeout(() => {
        callback();
      }, 1000 * autoCloseTime);
      timerRef.current = timerId;
    };

    const setTimerCountDown = () => {
      clearTimeout(timerRef.current);
      timerFunc();
    };
    timerFunc();
    if (eventName instanceof Array) {
      for (let name of eventName) {
        ele.addEventListener(name, setTimerCountDown);
      }
      return;
    }
    ele.addEventListener(eventName, setTimerCountDown);

    return () => {
      if (eventName instanceof Array) {
        for (let name of eventName) {
          ele.removeEventListener(name, setTimerCountDown);
        }
        return;
      }
      ele.removeEventListener(eventName, setTimerCountDown);
    };
  }, [autoCloseTime, callback, ele, eventName]);
};

/**
 * 删除 drawerdom
 */
export const useDelDrawer = isHidden => {
  useEffect(() => {
    // if (isHidden) {
    //   const eleArr = document.getElementsByClassName('ant-drawer');
    //   console.log('eleArreleArreleArr', eleArr);
    //   if (eleArr.length) {
    //     const ele = eleArr[0];
    //     // 拿到父节点:
    //     var parentElement = ele.parentElement;

    //     // 删除:
    //     parentElement.removeChild(ele);
    //   }
    // }

    return () => {
      const eleArr = document.getElementsByClassName('ant-drawer');
      console.log('eleArreleArreleArr', eleArr);
      if (eleArr.length) {
        const ele = eleArr[0];
        // 拿到父节点:
        var parentElement = ele.parentElement;

        // 删除:
        parentElement.removeChild(ele);
      }
    };
  }, []);
};

export const delDrawer = () => {
  const eleArr = document.getElementsByClassName('ant-drawer');
  console.log('eleArreleArreleArr', eleArr);
  if (eleArr.length) {
    const ele = eleArr[0];
    // 拿到父节点:
    var parentElement = ele.parentElement;

    // 删除:
    parentElement.removeChild(ele);
  }
};

/**
 *
 * 动态更改元素样式
 */
export const useDyChnageEleStyle = ({ id, classStr, style }) => {
  const getEle = useCallback(({ id, classStr }) => {
    const idEle = document.getElementById(id);
    if (idEle) {
      return idEle;
    }
    const classEleArr = document.getElementsByClassName(classStr);
    if (classEleArr?.length) {
      return classEleArr[0];
    }
  }, []);

  useDeepCompareEffect(() => {
    const ele = getEle({
      id,
      classStr,
    });
    if (!ele) {
      return;
    }
    if (!isObject(style)) {
      return;
    }
    const oldStyle = ele.style;
    console.log('oldStyleoldStyle', oldStyle);
    ele.style = {
      ...oldStyle,
      ...style,
    };
  }, [id, classStr, style]);
};
