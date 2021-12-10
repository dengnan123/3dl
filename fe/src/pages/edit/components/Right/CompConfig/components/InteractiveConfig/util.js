import { transformCode } from '@/helpers/screen';
import { pick } from 'lodash';
import { dynamicExpandKeys } from '@/helpers/const';

export const delwithDynamicExpand = ({ dynamicExpand, data }) => {
  const arr = dynamicExpand?.otherCompParamsFilterFuncArr || [];
  // 处理 otherCompParamsFilterFuncArr
  const newOtherCompParamsFilterFuncArr = arr.map(v => {
    const { filterFunc } = v;
    if (filterFunc) {
      const filterFuncEs5Code = transformCode(filterFunc);
      return {
        ...v,
        filterFuncEs5Code,
      };
    }
    if (!filterFunc) {
      return {
        ...v,
        filterFuncEs5Code: null,
      };
    }
    return v;
  });

  const pickData = pick(data, dynamicExpandKeys);
  return {
    ...dynamicExpand,
    otherCompParamsFilterFuncArr: newOtherCompParamsFilterFuncArr,
    ...pickData,
  };
};

export const getNewDataWithDynamicExpand = data => {
  const { dynamicExpand } = data;
  const pickData = pick(dynamicExpand, dynamicExpandKeys);
  return {
    ...data,
    ...pickData,
  };
};

export const getFuncAndFuncEs5CodeByKey = (key, func) => {
  const es5CodeKey = `${key}Es5Code`;
  const filterFuncEs5Code = transformCode(func);
  if (filterFuncEs5Code === undefined) {
    throw new Error('代码错误');
  }
  return {
    [key]: func,
    [es5CodeKey]: filterFuncEs5Code,
  };
};
