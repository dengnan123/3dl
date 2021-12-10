import { isObject, isString, filterObj, isArray } from '../utils/type';

export const dealWithFindInfo = data => {
  const newData = {
    ...data,
  };
  return newData
  // const girdLayout = data.girdLayout ? JSON.parse(data.girdLayout || '[]') : [];
  // return {
  //   ...newData,
  //   girdLayout,
  // };
};

export const dealWithUpdateInfo = (toUpdate, condition) => {
  // if (condition.girdLayout) {
  //   if (isArray(condition.girdLayout)) {
  //     condition.girdLayout = JSON.stringify(condition.girdLayout); // 数组转化为字符串
  //   } else {
  //     delete condition.girdLayout;
  //   }
  // }
  const updated = Object.assign(toUpdate, condition);
  return updated;
};
