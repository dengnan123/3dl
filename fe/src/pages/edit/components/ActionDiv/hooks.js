import { eventArr } from './const';
import { useEffect, useState } from 'react';

export function getMenuPosition(left, top, menuWidth, menuHeight) {
  // 水平偏移距离
  const offsetX = 10;
  // 可视区域宽度、高度
  const clientWidth = document.body.clientWidth;
  const clientHeight = document.body.clientHeight;

  let curLeft = left + offsetX;
  let curTop = top;

  if (curLeft + menuWidth > clientWidth) {
    curLeft = left - menuWidth - offsetX;
  }

  if (curTop + menuHeight > clientHeight && top - menuHeight >= 0) {
    curTop = top - menuHeight;
  }
  return { left: curLeft, top: curTop };
}

export const useEventArr = ({ pageConfig, mulArr, isSelectCompInfo = {} }) => {
  const [data, setData] = useState(eventArr);
  const { isLocking, isHidden,groupId } = isSelectCompInfo;
  const { layoutType } = pageConfig;
  const mulLen = mulArr.length;
  const hashChild = isSelectCompInfo?.child?.length;
  useEffect(() => {
    const newData = eventArr.filter(v => {
      const { eventName } = v;
      if (mulLen) {
        if (v.eventName === 'doGroup') {
          return true;
        } else {
          return false;
        }
      }
      if (eventName === 'moveIn' && groupId) {
         return false
      }
      if (eventName === '_moveOut' && !groupId) {
        return false
     }
      if (v.eventName === 'show') {
        if (!isHidden) {
          return false;
        }
      }
      if (v.eventName === 'hidden') {
        if (isHidden) {
          return false;
        }
      }
      if (v.eventName === 'doGroup') {
        if (!mulLen) {
          return false;
        }
        if (layoutType === 'grid') {
          return false;
        }
      }
      if (v.eventName === 'cancelGroup') {
        if (!hashChild) {
          return false;
        }
        if (mulLen) {
          return false;
        }
        if (layoutType === 'grid') {
          return false;
        }
      }
      if (isLocking && v.eventName === 'locking') {
        return false;
      }
      if (!isLocking && v.eventName === 'unlock') {
        return false;
      }
      return true;
    });
    setData(newData);
  }, [mulLen, isLocking, layoutType, hashChild, isHidden,groupId]);

  return [data];
};

export const useEventListenerAndGetLT = ({ divId, setVis, menuWidth, menuHeight }) => {
  const [data, setPosition] = useState({});

  useEffect(() => {
    const ele = document.getElementById(divId);
    ele.addEventListener('click', e => {
      setVis(false);
    });
    ele.addEventListener('contextmenu', e => {
      e.preventDefault();
      const data = getMenuPosition(e.pageX, e.pageY, menuWidth, menuHeight);
      setPosition(data);
      setVis(true);
    });
  }, [setVis, menuWidth, setPosition, menuHeight, divId]);

  return [data];
};

export const getTreeDataByCompList = arr => {};
