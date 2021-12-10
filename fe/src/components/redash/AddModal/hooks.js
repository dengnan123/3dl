import { getRegexValue } from '@/helpers/str';
export const getQueryParameters = str => {
  const arr = getRegexValue(str,'{{','}}');
  return arr.map(v => {
    return {
      locals: [],
      name: v,
      title: v,
      type: 'text',
      value: '',
    };
  });
};


