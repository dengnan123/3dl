import { updateAndBakDataByKey } from '@/helpers/arrayUtil';
import {
  getIndexById,
  // getNewIndexArrAndData,
  sortArrByZindex,
  getClickInfoById,
} from '@/helpers/utils';
/**
 *
 * 置顶，找到最大的zIndex 然后 加1
 */
export const toTop = ({ arr, id, isSelectCompInfo }) => {
  const maxZIndex = getMaxZIndex(arr);
  let changeArr = [];
  const newZIndex = maxZIndex + 1;
  const newArr = arr.map(v => {
    if (v.id === isSelectCompInfo.id) {
      changeArr.push({
        ...v,
        zIndex: newZIndex,
      });
      return {
        ...v,
        zIndex: newZIndex,
      };
    }
    return v;
  });
  return {
    newArr: sortArrByZindex(newArr),
    changeArr,
  };
};

/**
 *
 * 置底，如果最小zindex 大于0 那么当前zindex就等于 zindex - 1,如果等于0 那么当前的zindex也等于0
 */
export const toBottom = ({ arr, id, isSelectCompInfo }) => {
  const minZIndex = getMinZIndex(arr);
  if (isSelectCompInfo.zIndex === minZIndex) {
    // 相等的话 不需要任何操作
    return;
  }
  let changeArr = [];
  let newArr;
  if (minZIndex > 0) {
    // 如果最小zindex 大于0 那么当前zindex就等于 zindex - 1
    let newZIndex = minZIndex - 1;
    newArr = arr.map(v => {
      if (v.id === isSelectCompInfo.id) {
        changeArr.push({
          ...v,
          zIndex: newZIndex,
        });
        return {
          ...v,
          zIndex: newZIndex,
        };
      }
      return v;
    });
  } else {
    // 如果等于0 那么当前的zindex也等于0 其他的都加1
    let newZIndex = 0;
    newArr = arr.map(v => {
      if (v.id === isSelectCompInfo.id) {
        return {
          ...v,
          zIndex: newZIndex,
        };
      } else {
        return {
          ...v,
          zIndex: v.zIndex + 1,
        };
      }
    });
    changeArr = [...newArr];
  }
  return {
    changeArr,
    newArr: sortArrByZindex(newArr),
  };
};

/**
 *
 * 相邻交换位置
 */
export const toUpperLevel = ({ id, arr, isSelectCompInfo }) => {
  console.log('isSelectCompInfoisSelectCompInfo', isSelectCompInfo);
  const nowLocaltion = getIndexById(arr, id);
  const maxZIndex = getMaxZIndex(arr);
  if (isSelectCompInfo.zIndex === maxZIndex) {
    return;
  }
  const preLocaltion = nowLocaltion - 1;
  const { zIndex: preIndex, id: preId } = arr[preLocaltion];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  const { otherData, data, newArr } = getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: preId,
      zIndex: preIndex,
    },
  });
  return {
    newArr: sortArrByZindex(newArr),
    changeArr: [data, otherData],
  };
};

/**
 *
 * 相邻交换位置
 */
export const toLowLevel = ({ arr, id, isSelectCompInfo }) => {
  let nowLocaltion = getIndexById(arr, id);
  const minZindex = getMinZIndex(arr);
  // 代表已经最底层了
  if (isSelectCompInfo.zIndex === minZindex) {
    return;
  }
  const nextLocaltion = nowLocaltion + 1;
  // zindex 互换
  const { zIndex: nextIndex, id: nextId } = arr[nextLocaltion];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  const { otherData, data, newArr } = getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: nextId,
      zIndex: nextIndex,
    },
  });
  return {
    newArr: sortArrByZindex(newArr),
    changeArr: [data, otherData],
  };
};

export const updateCompIndex = ({ arr, isSelectCompInfo, key }) => {
  const keyHash = {
    toLowLevel,
    toUpperLevel,
    toTop,
    toBottom,
  };
  if (!keyHash[key]) {
    throw new Error(`${key} is error`);
  }
  const { id, groupId } = isSelectCompInfo;
  if (!groupId) {
    return keyHash[key]({
      arr: sortArrByZindex(arr),
      id,
      isSelectCompInfo,
    });
  }
  const groupData = getClickInfoById(arr, groupId);
  const { child } = groupData;
  const resData = keyHash[key]({
    arr: sortArrByZindex(child),
    id,
    isSelectCompInfo,
  });
  if (!resData) {
    return;
  }
  const { changeArr, newArr: childNewArr } = resData;
  const { newArr } = updateAndBakDataByKey({
    condition: {
      id: groupId,
    },
    arr,
    data: {
      ...groupData,
      child: childNewArr,
    },
  });
  return {
    newArr,
    changeArr,
  };
};

export const getMinZIndex = arr => {
  let zIndex;
  for (const v of arr) {
    if (zIndex === undefined) {
      zIndex = v.zIndex;
    }
    if (v.zIndex < zIndex) {
      zIndex = v.zIndex;
    }
  }
  return zIndex;
};

export const getMaxZIndex = arr => {
  let zIndex;
  for (const v of arr) {
    if (zIndex === undefined) {
      zIndex = v.zIndex;
    }
    if (v.zIndex > zIndex) {
      zIndex = v.zIndex;
    }
  }
  return zIndex;
};

export const getNewIndexArrAndData = ({ arr, nowData, changeData }) => {
  let otherData = {};
  let data = {};
  const newArr = arr.map(v => {
    if (v.id === nowData.id) {
      data = {
        ...v,
        zIndex: changeData.zIndex,
      };
      return data;
    }
    if (v.id === changeData.id) {
      otherData = {
        ...v,
        zIndex: nowData.zIndex,
      };
      return otherData;
    }
    return v;
  });
  return {
    otherData,
    data,
    newArr,
  };
};
