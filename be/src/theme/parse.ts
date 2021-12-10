import { isArray } from '../utils/type';

export const dealWithAddInfo = condition => {
  const newCondidtion = {
    ...condition,
  };

  if (newCondidtion.colors) {
    if (isArray(newCondidtion.colors)) {
      newCondidtion.colors = JSON.stringify(newCondidtion.colors); // 数组转化为字符串
    } else {
      delete newCondidtion.colors;
    }
  }
  return newCondidtion;
};

export const dealWithUpdateInfo = (condition, toUpdate) => {
  if (condition.colors) {
    if (isArray(condition.colors)) {
      condition.colors = JSON.stringify(condition.colors); // 数组转化为字符串
    } else {
      delete condition.colors;
    }
  }
  const updated = Object.assign(toUpdate, condition);
  return updated;
};

export const dealWithFindInfo = data => {
  const newData = {
    ...data,
  };
  const colors = data.colors ? JSON.parse(data.colors) : [];

  return {
    ...newData,
    colors,
  };
};
