import { getRegexValue } from '@/helpers/str';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
export const getQueryParameters = str => {
  return getRegexValue(str, '{{', '}}');
};

export const useGetQueryParameters = str => {
  const [v, setV] = useState();
  const [newV] = useDebounce(str, 300);
  useEffect(() => {
    if (str === undefined) {
      setV([]);
    }
  }, [str]);
  useEffect(() => {
    if (newV === undefined) {
      return;
    }
    const value = getQueryParameters(newV) || [];
    const newData = Array.from(new Set(value));
    setV(newData);
  }, [newV]);
  return [v];
};

const getNewParameters = (pv = [], nv = []) => {
  const hash = {};
  for (const v of pv) {
    const { name } = v;
    hash[name] = v;
  }
  return nv.map(v => {
    if (hash[v]) {
      return {
        ...hash[v],
      };
    }
    return {
      name: v,
      type: 'text',
    };
  });
};

export const useParameters = (data = [], keys) => {
  const [value, setV] = useState(data);
  const newv = getNewParameters(value, keys);
  return [newv, setV];
};
