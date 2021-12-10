import { isObject, isString, filterObj, isArray } from '../utils/type';
import { v4 as uuid } from 'uuid';
const fields = [
  'deps',
  'cacheParamsDeps',
  'containerDeps',
  'clearParamsComps',
  'passParamsComps',
  'showComps',
  'hiddenComps',
  'loadingDeps',
  'dataSourceId',
  'clearApiDeps',
];

// 'clearParamsComps', 这四个字段 可能是数组 也可以能对象 前端使用需要处理下 最终处理成数组的形式被使用 
// 'passParamsComps',
// 'showComps',
// 'hiddenComps',

const objectFields = [
  'mockData',
  'style',
  'basicStyle',
  'grid',
  'dynamicExpand',
];


// export const dealWithAddInfo = (condition) => {
//   const newCondidtion = {
//     ...condition,
//   };
//   for (const v of objectFields) {
//     if (newCondidtion[v]) {
//       newCondidtion[v] = JSON.stringify(newCondidtion[v]);
//     } else {
//       newCondidtion[v] = '{}';
//     }
//   }
//   if (!newCondidtion.id) {
//     newCondidtion.id = uuid();
//   }

//   for (const v of fields) {
//     if (newCondidtion[v]) {
//       if (isArray(newCondidtion[v])) {
//         newCondidtion[v] = newCondidtion[v].join(','); // 数组转化为字符串
//       } else {
//         delete newCondidtion[v];
//       }
//     }
//   }

//   return newCondidtion;
// };

// export const dealWithUpdateInfo = (condition, toUpdate) => {
//   for (const v of objectFields) {
//     if (condition[v]) {
//       condition[v] = JSON.stringify(condition[v]);
//     }
//   }
//   for (const v of fields) {
//     if (condition[v]) {
//       if (isArray(condition[v])) {
//         condition[v] = condition[v].join(','); // 数组转化为字符串
//       } else {
//         delete condition[v];
//       }
//     }
//   }
//   const updated = Object.assign(toUpdate, condition);
//   return updated;
// };

// export const dealWithFindInfo = (data) => {
//   const newData = {
//     ...data,
//   };
//   const paserObject = () => {
//     const obj = {};
//     for (const v of objectFields) {
//       let newV = {};
//       try {
//         if (data[v]) {
//           newV = JSON.parse(data[v]);
//         }
//       } catch (err) { }
//       obj[v] = newV;
//     }
//     return obj;
//   };

//   const parseArr = () => {
//     const obj = {};
//     for (const v of fields) {
//       obj[v] = data[v] ? data[v].split(',') : [];
//     }
//     return obj;
//   };
//   return {
//     ...newData,
//     ...paserObject(),
//     ...parseArr(),
//   };
// };

const parseFields = [
  'mockData',
  'style',
  'basicStyle',
  'grid',
  'dynamicExpand',
  'deps',
  'cacheParamsDeps',
  'containerDeps',
  'clearParamsComps',
  'passParamsComps',
  'showComps',
  'hiddenComps',
  'loadingDeps',
  'dataSourceId',
  'clearApiDeps',
]


export const dealWithAddInfo = (condition) => {
  const newCondidtion = {
    ...condition,
  };
  for (const v of parseFields) {
    if (newCondidtion[v]) {
      newCondidtion[v] = JSON.stringify(newCondidtion[v]);
    }
  }
  return newCondidtion;
};

export const dealWithUpdateInfo = (condition, toUpdate) => {
  const newCondidtion = dealWithAddInfo(condition)
  const updated = Object.assign(toUpdate, newCondidtion);
  return updated;
};

export const dealWithFindInfo = (data) => {
  const newData = {
    ...data,
  }
  for (const v of parseFields) {
    if (newData[v]) {
      try {
        newData[v] = parseData(newData[v]);
      } catch (err) {
        console.log('parseData err', data.id, data.compName, newData[v], err)
        newData[v] = {}
      }

    } else {
      if (fields.includes(v)) {
        newData[v] = []
      } else {
        newData[v] = {}
      }
    }
  }
  return newData
};

const parseData = (findData) => {
  // findData，存储的数据，可能有三种形式 1,2,3 或者 [1,2,3]  或者 {a:1}
  if (isParseObject(findData)) {
    return JSON.parse(findData);
  }
  return findData.split(',') || []
}

const isParseObject = (str) => {
  if (!str) {
    return
  }
  const firstStr = str[0]
  if (firstStr === '[' || firstStr === '{') {
    return true
  }
}


