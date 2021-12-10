import { useRef, useEffect } from 'react';
import { cloneDeep, isString, isFunction } from 'lodash';

export const checkAndTransformCode = codeStr => {
  try {
    // eslint-disable-next-line no-new-func
    new Function('params', codeStr);
  } catch (err) {
    console.log('validateCallback err', err.message);
    return;
  }
  const es5Code = compileCodeToEs5(codeStr);
  return es5Code;
};

export const compileCodeToEs5 = codeStr => {
  if (!window) {
    return;
  }
  if (!window.babelCompiler) {
    return;
  }
  const compilers = window.babelCompiler;
  const funcStr = `function test() {
    ${codeStr}
  }
  `;
  const { code, errors } = compilers.compile(funcStr);
  if (errors.length) {
    console.log('errorserrors', errors);
    return;
  }
  // 先把 function test() { 代码去掉
  const codeArr = code.replace('function test() {', '');
  const str1 = codeArr;
  // 再把 } 去掉
  return str1.substring(0, str1.length - 1);
};

// 数据过滤器
export const filterDataFunc = ({ filterFunc, filterFuncEs5Code, data }) => {
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', `${filterFunc}`);
    return filter(cloneDeep(data));
  } catch (err) {
    console.log('过滤器代码有误', err.message);
    console.log('filterFunc...', filterFunc);
    // 如果报错，可能是浏览器版本太低，如果有filterFuncEs5Code 代码 就走一遍new Function
    if (filterFuncEs5Code) {
      try {
        // eslint-disable-next-line no-new-func
        const filter = new Function('data', `${filterFuncEs5Code}`);
        return filter(cloneDeep(data));
      } catch (err) {
        console.log('filterFuncEs5Code有误', err.message);
        console.log('filterFuncEs5Code...', filterFuncEs5Code);
        return data;
      }
    }
    return data;
  }
};

// 数据过滤器
export const filterDataEs5Func = ({ filterFuncEs5Code, data }) => {
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', `${filterFuncEs5Code}`);
    return filter(cloneDeep(data));
  } catch (err) {
    console.log('filterFuncEs5Code有误', err.message);
    console.log('filterFuncEs5Code...', filterFuncEs5Code);
    return data;
  }
};

/**
 * 数据过滤器，避免每次仅仅是数据(data)改变重新生成函数
 */
export const useFilterDataEs5Func = ({ filterFuncEs5Code, data }) => {
  const filterRef = useRef(null);
  useEffect(() => {
    try {
      if (filterFuncEs5Code && isString(filterFuncEs5Code)) {
        // eslint-disable-next-line no-new-func
        filterRef.current = new Function('data', `${filterFuncEs5Code}`);
        return;
      }
      if (filterFuncEs5Code && isFunction(filterFuncEs5Code)) {
        filterRef.current = filterFuncEs5Code;
        return;
      }
      filterRef.current = null;
    } catch (err) {
      console.log('filterFuncEs5Code有误', err.message);
      console.log('useFilterDataEs5Func --- filterFuncEs5Code...', filterFuncEs5Code);
      filterRef.current = null;
    }
  }, [filterFuncEs5Code]);
  return filterRef.current ? filterRef.current(cloneDeep(data)) : undefined;
};
